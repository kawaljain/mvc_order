const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

router.post("/create", orderController.createOrder);
router.post("/get", (res, req) => {
  req.send("done");
});

module.exports = router;
