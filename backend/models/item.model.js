const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'litre', 'piece'], required: true },
  stock: { type: Number, default: 0 },
  deliveryAvailable: { type: Boolean, default: false },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
