const express = require('express');
const verifyjwt = require('../middlewares/auth.middleware');
const router = express.Router();
const  {addToCart,getCart, removeCartItem ,clearCart } = require("../controllers/vendor.cart.controller");


const { placeOrder, searchItemsByName} = require('../controllers/vendor.controller');
router.post("/place-order", verifyjwt,placeOrder);
router.get('/search', searchItemsByName);
router.post("/cart/add" ,verifyjwt,addToCart);
router.get("/cart/getcart",verifyjwt,getCart);
router.delete("/cart/remove/:itemId",verifyjwt,removeCartItem);
router.delete("/cart/clear",verifyjwt,clearCart);



module.exports = router;