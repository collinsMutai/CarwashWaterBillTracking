Here’s a comprehensive `README.md` file for your **Car Wash Water Bill Backend** project:

---

# 🚗💧 Car Wash Water Bill Backend

This is a Node.js REST API for managing vehicle services, water billing, and payment tracking for a car wash business. It features user authentication, secure CRUD operations for vehicles, water bills, and payments, as well as daily financial balance tracking.

---

## 📦 Features

* **User Authentication** (JWT-based)
* **Vehicle Management**
* **Water Billing** (with duplicate entry prevention)
* **Payment Recording** with balance tracking
* **Daily Financial Calculation**
* **Role-protected API routes**
* **MongoDB integration**

---

## 🛠 Tech Stack

* Node.js + Express
* MongoDB + Mongoose
* JWT for authentication
* dotenv for configuration
* CORS for API access
* RESTful routing

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/car-wash-waterbill-backend.git
cd car-wash-waterbill-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/carwashdb
JWT_SECRET=your_jwt_secret
```

---

## 🧪 Running the Server

```bash
npm start
```

The server will run at:

```
http://localhost:5000
```

---

## 📂 API Endpoints

### 🔑 Auth (`/api/auth`)

| Method | Endpoint    | Description             |
| ------ | ----------- | ----------------------- |
| POST   | `/login`    | Login user              |
| POST   | `/register` | Register new user       |
| PUT    | `/user/:id` | Update user (protected) |
| DELETE | `/user/:id` | Delete user (protected) |

---

### 🚗 Vehicles (`/api/vehicles`)

> **Protected: Requires JWT**

| Method | Endpoint | Description              |
| ------ | -------- | ------------------------ |
| GET    | `/`      | Search vehicles by plate |
| POST   | `/`      | Add new vehicle          |

---

### 💧 Water Bills (`/api/waterbills`)

> **Protected: Requires JWT**

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| GET    | `/`      | Get last 30 water bills |
| POST   | `/`      | Add daily water bill    |

---

### 💵 Payments (`/api/payments`)

> **Protected: Requires JWT**

| Method | Endpoint | Description                               |
| ------ | -------- | ----------------------------------------- |
| GET    | `/`      | Get all payment entries                   |
| POST   | `/`      | Add new payment and update balances       |
| PUT    | `/:id`   | Update a specific payment                 |
| DELETE | `/:id`   | Delete a payment and recalculate balances |

---

## 🛡️ Authentication

All protected routes require a `Bearer` token in the header:

```http
Authorization: Bearer <your_token>
```

You can obtain a token from the `/api/auth/login` endpoint.

---

## 📊 Business Logic Summary

* Each payment includes:

  * `cashPaid`
  * `services[]` (linked to vehicles)
  * `waterUnits`
* Balance is updated daily:

  * `balance = previous_balance + total_income - (water_units * cost_per_unit)`
* Recalculates future balances when a payment is updated or deleted.

---

## 🧠 Developer Notes

* Water bill is only one per day (duplicate protection).
* Payments update balances across future days.
* Services must reference valid vehicle IDs.
* Passwords are hashed using the `User` model's internal logic.

---

## ✅ Example `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/carwashdb
JWT_SECRET=supersecretkey
```

---

## 📎 License

MIT License. Free to use and modify.

---

## 🙋 Support

Feel free to open issues or contribute to the project. PRs are welcome!

