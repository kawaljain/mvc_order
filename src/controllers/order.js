const orderModel = require("../models/orderModel");

const createOrder = async (req, res) => {
  try {
    const { customer_id, order_items } = req.body;

    if (
      !customer_id ||
      !Array.isArray(order_items) ||
      order_items.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "customer_id and order_items are required" });
    }

    for (const item of order_items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: "Each order item must have a valid product_id and quantity",
        });
      }
    }

    const result = await orderModel.createOrder(customer_id, order_items);
    res.status(201).json({
      message: "Order placed successfully",
      order_id: result.orderId,
      total_price: result.total,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrder };
