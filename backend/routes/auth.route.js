const express = require('express');
const {signup , login , logout , updateprofile,checkauth} = require("../controllers/auth.controller.js");
const verifyjwt = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/login", login);
router.post("/signup",signup);
router.post("/logout",logout);
router.get("/profile",verifyjwt,updateprofile);
// router.get("/check",verifyjwt, checkauth);


module.exports = router;