const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['vendor', 'supplier'],
    required: true
  },


  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Vendor-specific
  name: { type: String },
  foodType: { type: String },
   location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },

  loyaltyPoints: { type: Number, default: 0 },

  // Supplier-specific
  businessName: { type: String },
  ownerName: { type: String },
  businessAddress: { type: String },
  gstNumber: { type: String },
  deliveryMethod: {
    type: String,
    enum: ['Delivery', 'Pickup', 'Both']
  },
  serviceArea: { type: String } 
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
