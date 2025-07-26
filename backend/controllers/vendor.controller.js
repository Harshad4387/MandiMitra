const Item = require("../models/Item");
const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  try {
    const { items, deliveryMethod, deliveryAddress } = req.body;
    const vendorId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item must be included in the order." });
    }

    if (!deliveryMethod || !['pickup', 'delivery'].includes(deliveryMethod)) {
      return res.status(400).json({ message: "Invalid delivery method." });
    }

    let totalAmount = 0;
    const orderItems = [];

    let supplierId = null;

    for (const item of items) {
      const dbItem = await Item.findById(item.itemId);
      if (!dbItem) {
        return res.status(404).json({ message: `Item with ID ${item.itemId} not found.` });
      }

      if (item.quantity > dbItem.stock) {
        return res.status(400).json({ message: `Insufficient stock for item: ${dbItem.name}` });
      }

      if (!supplierId) {
        supplierId = dbItem.supplierId;
      } else if (supplierId.toString() !== dbItem.supplierId.toString()) {
        return res.status(400).json({ message: "All items must be from the same supplier." });
      }

      const itemTotal = dbItem.pricePerUnit * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        itemId: dbItem._id,
        name: dbItem.name,
        quantity: item.quantity,
        pricePerUnit: dbItem.pricePerUnit,
        totalPrice: itemTotal
      });

      // Optional: reduce stock
      dbItem.stock -= item.quantity;
      await dbItem.save();
    }

    const order = new Order({
      vendorId,
      supplierId,
      items: orderItems,
      totalAmount,
      deliveryMethod,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : "",
      status: "pending"
    });

    await order.save();

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      totalAmount,
    });

  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { placeOrder };
