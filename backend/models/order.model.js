const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    name: String,
    quantity: Number,
    pricePerUnit: Number,
    totalPrice: Number
  }],
  totalAmount: { type: Number, required: true },
  deliveryMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_transit', 'delivered'],
    default: 'pending'
  },
  deliveryTimeEstimate: String,
  deliveryAddress: String,
  placedAt: { type: Date, default: Date.now },
  isRated: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', orderSchema);
