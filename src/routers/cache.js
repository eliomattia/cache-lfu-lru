const express = require("express");
const router  = express.Router();
const cache   = require("../controllers/controllers").cache;

// Cache endpoints
router.put   ("/put/:itemKey",   cache.put);
router.delete("/delete/:itemKey",cache.delete);
router.get   ("/get/:itemKey",   cache.get);

module.exports = router;