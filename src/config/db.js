const mysql = require("mysql2/promise");

let pool;

async function initDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

module.exports = {
  getPool: async () => {
    if (!pool) {
      await initDb();
    }
    return pool;
  },
  getConnection: async () => {
    const activePool = await module.exports.getPool();
    return await activePool.getConnection();
  },
  query: async (...args) => {
    const activePool = await module.exports.getPool();
    return activePool.query(...args);
  },
};
