const express = require('express');
const {signup , login , logout ,checkauth ,profile} = require("../controllers/auth.controller.js");
const verifyjwt = require("../middlewares/auth.middlewares.js");

const router = express.Router();

router.post("/login", login);
router.post("/signup",signup);
router.post("/logout",logout);
router.get("/profile",verifyjwt,profile);
router.get("/check",verifyjwt, checkauth);


module.exports = router;