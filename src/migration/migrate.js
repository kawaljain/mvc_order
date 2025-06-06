require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    console.log("creating Table - Start ");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone_no VARCHAR(20) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_price DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log("creating Table - Completed");
    console.log("Inserting Customer - Start ");
    await connection.query(`
      INSERT INTO customers (name, email, phone_no, is_active)
      VALUES 
        ('Kawal Jain', 'kawal@example.com', '9999999999', TRUE),
        ('Rahul Jain', 'rahul@example.com', '8888888888', TRUE)
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);

    console.log("Inserting Customer - Completed ");
    console.log("Inserting Product - Start ");
    await connection.query(`
      INSERT INTO products (name, description, price, quantity)
      VALUES 
        ('Jainsons Lights', 'Jainsons Lights Humphry Brown Metal Wall Sconces JLHBMWS-01', 5990.00, 50),
        ('Gold Metal Wall', 'Sinoman Teardrop Shaped Gold Metal Wall Sconces STSGMWS-01', 1199.00, 30)
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);
    console.log("Inserting Product - Completed ");
  } catch (err) {
  } finally {
    await connection.end();
  }
})();
