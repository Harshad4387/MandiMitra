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
      .populate('vendorId', 'name location') // Only fetch customer name
      .select('vendorId deliveryAddress items'); // Only include needed fields

    const formattedOrders = orders.map(order => ({
      id : order._id,
      customerName: order.vendorId.name,
      deliveryAddress: order.deliveryAddress,
      latitude : order.vendorId.location.latitude,
      longitude : order.vendorId.location.longitude,
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
          orderCount: 1,
          totalSpent: order.totalAmount || 0
        });
      } else {
        const existing = customerMap.get(vendor._id.toString());
        existing.orderCount += 1;

        existing.totalSpent += order.totalAmount || 0;

      }
    });

    const customers = Array.from(customerMap.values());

    res.json(customers);
  } catch (err) {
    console.error('❌ Failed to get customers:', err);
    res.status(500).json({ error: 'Failed to fetch customer data' });
  }
};

const getanalytics = async (req, res) => {
  try {
    const supplierId = req.user._id;

    // 1. All orders of the supplier
    const orders = await Order.find({ supplierId });

    // 2. Total Orders
    const totalOrders = orders.length;

    // 3. Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 4. Order Status Breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // 5. Revenue Over Time (Daily)
    const revenueByDate = {};
    orders.forEach(order => {
      const date = new Date(order.placedAt).toISOString().split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
    });

    // 6. Most Ordered Items
    const itemQuantityMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemQuantityMap[item.name] = (itemQuantityMap[item.name] || 0) + item.quantity;
      });
    });

    const mostOrderedItems = Object.entries(itemQuantityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

   
    const supplierItems = await Item.find({ supplierId });
    const itemIdToCategory = {};
    supplierItems.forEach(item => {
      itemIdToCategory[item._id.toString()] = item.category;
    });

    const categoryCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = itemIdToCategory[item.itemId?.toString()];
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
        }
      });
    });

    const categoryStats = Object.entries(categoryCount).map(([category, quantity]) => ({
      category,
      quantity
    }));
    return res.json({
      totalOrders,
      totalRevenue,
      statusBreakdown,
      revenueByDate,
      mostOrderedItems,
      categoryStats
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {addItem , getSupplierOrders,
  updateOrderStatus,
  updateDeliveryDetails,getCustomersForSupplier , getanalytics};

  