const Item = require('../models/item.model');
const cloudinary = require('../utlis/cloudinary')
const Order = require('../models/order.model');
const User = require('../models/user.model');
const addItem = async (req, res) => {
  try {
    const supplierId = req.user._id;

    const {
      name,
      pricePerUnit,
      unit,
      stock,
      deliveryAvailable,
      imageBase64,
      category,
    } = req.body;

    if (!name || !pricePerUnit || !unit || !category) {
      return res.status(400).json({
        message: "Item name, price per unit, unit type, and category are required."
      });
    }

    if (!['kg', 'litre', 'piece'].includes(unit)) {
      return res.status(400).json({
        message: "Unit must be 'kg', 'litre', or 'piece'."
      });
    }

    if (
      ![
        'Fresh Produce',
        'Grains and Flours',
        'Spices and Condiments',
        'Oils and Fats',
        'Packaging and Disposables'
      ].includes(category)
    ) {
      return res.status(400).json({
        message: "Invalid category. Must be one of the predefined categories."
      });
    }

    let imageUrl = '';

    if (imageBase64) {
      const uploaded = await cloudinary.uploader.upload(imageBase64, {
        folder: "item_images"
      });
      imageUrl = uploaded.secure_url;
    }

    const newItem = await Item.create({
      supplierId,
      name,
      pricePerUnit,
      unit,
      stock: stock || 0,
      deliveryAvailable: deliveryAvailable === 'true' || deliveryAvailable === true,
      imageUrl,
      category,
    });

    return res.status(201).json({
      message: "Item added successfully",
      item: newItem
    });

  } catch (error) {
    console.error("Error in addItem:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user._id;

    const orders = await Order.find({ supplierId, status: 'pending' })
      .populate('vendorId', 'name') 
      .select('vendorId deliveryAddress items'); 

    const formattedOrders = orders.map(order => ({
      customerName: order.vendorId.name,
      deliveryAddress: order.deliveryAddress,
      latitude : order.vendorId.location.latitude,
      longitude : order.vendorId.location.latitude,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.totalPrice
      }))
    }));

    res.json(formattedOrders);

  } catch (err) {
    console.error("Error fetching supplier orders:", err);
    res.status(500).json({ error: 'Error fetching supplier orders' });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

const updateDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryTimeEstimate, status } = req.body;

    const validStatuses = ['in_transit'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid delivery status' });
    }

    const update = {};
    if (deliveryTimeEstimate) update.deliveryTimeEstimate = deliveryTimeEstimate;
    if (status) update.status = status;

    const updatedOrder = await Order.findByIdAndUpdate(id, update, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update delivery details' });
  }
};

const getCustomersForSupplier = async (req, res) => {
  try {
    const supplierId = req.user._id;

    // Find all orders where supplierId matches
    const orders = await Order.find({ supplierId })
      .populate('vendorId', 'name email phone location') // Only fetch selected fields from User
      .sort({ placedAt: -1 }); // Sort by most recent

    // Group orders by vendorId
    const customerMap = new Map();

    orders.forEach(order => {
      const vendor = order.vendorId;
      if (!customerMap.has(vendor._id.toString())) {
        customerMap.set(vendor._id.toString(), {
          _id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.location, // or use `vendor.businessAddress` if relevant
          lastOrder: order,
          orderCount: 1
        });
      } else {
        const existing = customerMap.get(vendor._id.toString());
        existing.orderCount += 1;
      }
    });

    const customers = Array.from(customerMap.values());

    res.json(customers);
  } catch (err) {
    console.error('❌ Failed to get customers:', err);
    res.status(500).json({ error: 'Failed to fetch customer data' });
  }
};

module.exports = {addItem , getSupplierOrders,
  updateOrderStatus,
  updateDeliveryDetails,getCustomersForSupplier};

  