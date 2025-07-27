const express = require('express');
const verifyjwt = require('../middlewares/auth.middleware');
const router = express.Router();
const {addItem , getSupplierOrders,
  updateOrderStatus,
  updateDeliveryDetails,getCustomersForSupplier} = require("../controllers/suppiler.controller");

router.post("/additem", verifyjwt , addItem);
router.get("/orders/pending" ,verifyjwt ,getSupplierOrders);
router.put("orders/:id/status" , verifyjwt ,updateOrderStatus);
router.put("/orders/:id/delivery" , verifyjwt ,updateDeliveryDetails);
router.get("/customers", verifyjwt , getCustomersForSupplier);





module.exports = router;