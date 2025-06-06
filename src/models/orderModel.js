const db = require("../config/db");
exports.createOrder = async (customerId, orderItems) => {
  let connection;
  try {
    const connection = await db.getConnection();

    await connection.beginTransaction();

    const [customer] = await connection.query(
      "SELECT * FROM customers WHERE id = ? AND is_active = 1",
      [customerId]
    );

    if (customer.length === 0) {
      throw new Error("Customer not found or inactive");
    }

    let total = 0.0;

    for (const item of orderItems) {
      const [productRows] = await connection.query(
        "SELECT * FROM products WHERE id = ?",
        [item.product_id]
      );

      if (productRows.length === 0) {
        throw new Error(`Product ID ${item.product_id} does not exist`);
      }

      const product = productRows[0];

      if (product.quantity < item.quantity) {
        throw new Error(
          `Not enough quantity for product ID ${item.product_id}`
        );
      }

      total += product.price * item.quantity;

      await connection.query(
        "UPDATE products SET quantity = quantity - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_id, total_price) VALUES (?, ?)",
      [customerId, total]
    );
    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      const [productInfo] = await connection.query(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id]
      );

      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, productInfo[0].price]
      );
    }

    await connection.commit();
    return { orderId, total };
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr.message);
      }
    }
    throw err;
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseErr) {
        console.error("Release failed:", releaseErr.message);
      }
    }
  }
};
