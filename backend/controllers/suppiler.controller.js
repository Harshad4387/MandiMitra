const Item = require('../models/item.model');
const cloudinary = require('../utlis/cloudinary')

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

module.exports = {addItem};