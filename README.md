# mvc_order

This is a RESTful API built with Node.js, Express, and MySQL using MVC architecture. 

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL
- MVC Structure
- dotenv

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kawaljain/mvc_order.git
cd mvc_order

````

### 1. Set up environment variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development

DB_HOST=host
DB_USER=user
DB_PASSWORD=your_password
DB_NAME=db_name
DB_PORT=3306

```


### 3. Run Setup

```bash
npm run setup
```

### 4. Start your application

```bash
npm start
```
### 4. Start your application In Development Mode

```bash
npm run dev
```


## 📬 API Endpoints

### POST `/api/orders/create`

Create a new order with items.

#### Request Payload:

```json
{
  "customer_id": 1,
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

---

## 👨‍💻 Author

**Kawal Jain**
[GitHub](https://github.com/kawaljain)
