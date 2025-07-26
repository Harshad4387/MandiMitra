// POST /api/cart/add
const Cart = require('../models/cart.model');

const addToCart = async (req, res) => {
  const vendorId = req.user._id;
  const { itemId, quantity } = req.body;

  if (!itemId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid item or quantity" });
  }

  let cart = await Cart.findOne({ vendorId });

  if (!cart) {
    cart = new Cart({ vendorId, items: [{ itemId, quantity }] });
  } else {
    const existingItem = cart.items.find(i => i.itemId.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }
  }
  await cart.save();
  res.status(200).json({ message: "Item added to cart", cart });
};

const getCart = async (req, res) => {
  const vendorId = req.user._id;
  const cart = await Cart.findOne({ vendorId }).populate('items.itemId');

  if (!cart) return res.status(200).json({ items: [] });

  res.status(200).json({ items: cart.items });
};

const removeCartItem = async (req, res) => {
  const vendorId = req.user._id;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ vendorId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i.itemId.toString() !== itemId);
  await cart.save();
  res.status(200).json({ message: "Item removed from cart", cart });
};

const clearCart = async (req, res) => {
  await Cart.deleteOne({ vendorId: req.user._id });
  res.status(200).json({ message: "Cart cleared" });
};



module.exports  = {addToCart,getCart, removeCartItem ,clearCart };
