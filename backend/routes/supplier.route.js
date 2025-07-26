const express = require('express');
const verifyjwt = require('../middlewares/auth.middleware');
const router = express.Router();
const {addItem} = require("../controllers/suppiler.controller");

router.post("/additem", verifyjwt , addItem)


module.exports = router;