const express = require("express");
const router = express.Router();
const verifyjwt = require("../middlewares/auth.middleware.js");
const { groqChecker } = require("../controllers/chat.contorlller.js");

router.post("/groq", groqChecker);

module.exports = router;