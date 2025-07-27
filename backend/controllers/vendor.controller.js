const Item = require("../models/item.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const sendOrderMail = require("../utlis/sendOrderMail");
const User = require("../models/user.model");

const placeOrder = async (req, res) => {
  // console.log(req.body);
  try {
    const vendorId = req.user._id;
    const cart = await Cart.findOne({ vendorId });

    if (!cart) {
      return res
        .status(400)
        .json({ message: "Cart not found for this vendor." });
    }
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const items = cart.items;
    const { deliveryMethod, deliveryAddress } = req.body;

    if (!deliveryMethod || !["pickup", "delivery"].includes(deliveryMethod)) {
      return res.status(400).json({ message: "Invalid delivery method." });
    }

    let totalAmount = 0;
    const orderItems = [];
    let supplierId = null;
    // console.log("length",{items})

    for (const item of items) {
      const dbItem = await Item.findById(item.itemId);
      if (!dbItem) {
        return res
          .status(404)
          .json({ message: `Item with ID ${item.itemId} not found.` });
      }

      if (item.quantity > dbItem.stock) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for item: ${dbItem.name}` });
      }

      if (!supplierId) {
        supplierId = dbItem.supplierId;
      } else if (supplierId.toString() !== dbItem.supplierId.toString()) {
        return res
          .status(400)
          .json({ message: "All items must be from the same supplier." });
      }

      const itemTotal = dbItem.pricePerUnit * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        itemId: dbItem._id,
        name: dbItem.name,
        quantity: item.quantity,
        pricePerUnit: dbItem.pricePerUnit,
        totalPrice: itemTotal,
      });

      dbItem.stock -= item.quantity;
      await dbItem.save();
    }

    // console.log(5)
    // Save the order
    const newOrder = new Order({
      vendorId,
      supplierId,
      items: orderItems,
      totalAmount,
      deliveryMethod,
      deliveryAddress,
    });

    await newOrder.save();
    console.log("1");
    // Delete cart after order is placed
    await Cart.findOneAndDelete({ vendorId });
    const vendor = await User.findById(vendorId);
    const supplier = await User.findById(supplierId);

    if (vendor && vendor.email && supplier) {
      await sendOrderMail({
        vendor,
        supplier,
        items: orderItems,
        totalAmount,
        deliveryMethod,
        deliveryAddress,
      });
    }
    console.log("2");
    return res
      .status(201)
      .json({ message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchItemsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Item name is required in query" });
    }
    const items = await Item.find({ name: { $regex: name, $options: "i" } });

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error in searchItemsByName:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const myorders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const orders = await Order.find({ vendorId })
      .populate("supplierId", "name email")
      .populate("items.itemId", "name");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { placeOrder, searchItemsByName, myorders };
