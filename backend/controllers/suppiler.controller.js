const Item = require('../models/item.model');
const cloudinary = require('../utlis/cloudinary')
const Order = require('../models/order.model');

const addItem = async (req, res) => {
  try {
    const supplierId = req.user._id; // assuming auth middleware sets req.user

    const {
      name,
      pricePerUnit,
      unit,
      stock,
      deliveryAvailable,
      imageBase64 // frontend should send image as base64 string if using JSON
    } = req.body;

    // Basic validation
    if (!name || !pricePerUnit || !unit) {
      return res.status(400).json({ message: "Item name, price per unit, and unit type are required." });
    }

    if (!['kg', 'litre', 'piece'].includes(unit)) {
      return res.status(400).json({ message: "Unit must be 'kg', 'litre', or 'piece'." });
    }

    let imageUrl = '';

    // Upload image to Cloudinary if provided
    if (imageBase64) {
      const uploaded = await cloudinary.uploader.upload(imageBase64, {
        folder: "item_images"
      });
      imageUrl = uploaded.secure_url;
    }

    const newItem = new Item({
      supplierId,
      name,
      pricePerUnit,
      unit,
      stock: stock || 0,
      deliveryAvailable: deliveryAvailable === 'true' || deliveryAvailable === true,
      imageUrl
    });

    const savedItem = await newItem.save();

    return res.status(201).json({
      message: "Item added successfully",
      item: savedItem
    });

  } catch (error) {
    console.error("Error in addItem:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSupplierOrders = async (req, res) => {
  try {
    const supplierId = req.user._id; // secure and correct way

    const orders = await Order.find({ supplierId, status: 'pending' })
                              .populate('vendorId', 'name location'); // optional, to show vendor info
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching supplier orders' });
  }
};


// 2. Accept or reject an order
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

// 3. Update delivery time or mark order as in_transit
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




module.exports = {addItem , getSupplierOrders,
  updateOrderStatus,
  updateDeliveryDetails};