const express = require("express");
const router  = express.Router();
const ping    = require("../controllers/controllers").ping;

// Ping endpoint
router.get("/",ping.ping);

module.exports = router;