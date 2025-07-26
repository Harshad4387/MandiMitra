const express = require('express');
const verifyjwt = require('../middlewares/auth.middleware');
const router = express.Router();

const { placeOrder } = require('../controllers/vendor.controller');
router.post("/place-order", verifyjwt , placeOrder);

module.exports = router;