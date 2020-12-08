const express       = require("express");
const router        = express.Router();
const cache         = require("./cache");
const ping          = require("./ping");
const ignoreOptions         = require("../controllers/middlewares/options").ignoreOptions;
const endpointNotFound      = require("../controllers/middlewares/error").endpointNotFound;

// Preflight OPTIONS filtering
router.options("/*",ignoreOptions);

// Application routers
router.use("/ping", ping);
router.use("/cache",cache);

// Endpoint not found controller
router.use(endpointNotFound);

module.exports = router;