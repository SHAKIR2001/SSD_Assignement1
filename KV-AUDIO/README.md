# KV-AUDIO Backend (Node/Express + MongoDB)

REST API for KV-AUDIO. Built with Express, MongoDB (Mongoose), JWT auth, and role-based access (admin/customer) enforced inside controllers.

## Tech

- Node.js (ESM project: `"type": "module"`)
- Express 5
- MongoDB + Mongoose
- JWT (`Authorization: Bearer <token>`)
- bcrypt (password hashing)
- nodemon (dev start)

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Create `.env`

Create a file named `.env` in this `backend/` folder:

```env
MONGO_URL=mongodb://127.0.0.1:27017/kv-audio
JWT_SECRET=replace-with-a-long-random-secret
```

### 3) Run

```bash
npm run start
```

Server starts on:

- `http://localhost:3000`

Base API prefix:

- `http://localhost:3000/api`

## Scripts

- `npm run start` — starts the server with nodemon (`index.js`)

## Authentication

On every request, the server reads the header:

- `Authorization: Bearer <JWT>`

If the token is valid, `req.user` is set (from the JWT payload). Controllers then decide whether a route is allowed.

Typical roles:

- `admin`
- `customer`

Notes:

- Some routes are public (no token needed).
- Some routes require login (`req.user != null`).
- Some routes require `req.user.role === "admin"`.

## API Endpoints

### Health

There is no dedicated health route; use any public endpoint like `GET /api/products` to confirm the server is reachable.

---

## Users — `/api/users`

### Register

`POST /api/users`

Body (required fields based on schema):

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "address": "Some address",
  "phone": "0771234567",
  "profilePicture": "https://..." 
}
```

Response:

```json
{ "message": "User registred successfully" }
```

### Login

`POST /api/users/login`

Body:

```json
{ "email": "user@example.com", "password": "password123" }
```

Response (includes JWT):

```json
{ "message": "Login successful", "token": "...", "user": { /* user doc */ } }
```

### Get current user (from token)

`GET /api/users`

Requires: `Authorization` header.

### Get all users (admin only)

`GET /api/users/all`

Requires: admin token.

### Block / Unblock a user (admin only)

`PUT /api/users/block/:email`

Requires: admin token.

---

## Products — `/api/products`

### Add product (admin only)

`POST /api/products`

Requires: admin token.

Body (common fields from schema):

```json
{
  "key": "PRD001",
  "name": "Speaker",
  "price": 2500,
  "category": "Audio",
  "dimensions": "10x10x10",
  "description": "...",
  "availability": true,
  "image": ["https://..."]
}
```

### List products

`GET /api/products`

- Public users: returns only `{ availability: true }`
- Admin: returns all products

### Get product by key

`GET /api/products/:key`

Public.

### Update product (admin only)

`PUT /api/products/:key`

Requires: admin token.

### Delete product (admin only)

`DELETE /api/products/:key`

Requires: admin token.

---

## Reviews — `/api/reviews`

### Add review (login required)

`POST /api/reviews`

Requires: token.

Body:

```json
{ "rating": 5, "comment": "Great service!" }
```

The server auto-fills from JWT:

- `email`, `name`, `profilePicture`

### List reviews

`GET /api/reviews`

- Public users: returns only approved reviews (`isApproved: true`)
- Admin: returns all reviews

### Delete review (admin or owner)

`DELETE /api/reviews/:email`

Requires: token.

- Admin can delete any review
- Customer can delete only their own (matching JWT email)

### Approve review (admin only)

`PUT /api/reviews/approve/:email`

Requires: admin token.

---

## Inquiries — `/api/inquiries`

### Add inquiry (customer only)

`POST /api/inquiries`

Requires: customer token.

Body:

```json
{ "message": "I need details about renting item X" }
```

Server auto-fills:

- `email` (from JWT)
- `phone` (from JWT)
- `id` (auto-increment style)

### List inquiries (admin or customer)

`GET /api/inquiries`

- Admin: all inquiries
- Customer: only their inquiries

### Update inquiry (admin or owner)

`PUT /api/inquiries/:id`

Requires: token.

- Admin can update any fields
- Customer can update only `message`

### Delete inquiry (admin or owner)

`DELETE /api/inquiries/:id`

Requires: token.

---

## Orders — `/api/orders`

### Create order (login required)

`POST /api/orders`

Requires: token.

Body:

```json
{
  "orderedItems": [
    { "key": "PRD001", "quantity": 2 },
    { "key": "PRD002", "quantity": 1 }
  ],
  "days": 3,
  "startingDate": "2026-02-15T00:00:00.000Z",
  "endingDate": "2026-02-18T00:00:00.000Z"
}
```

Server will:

- generate `orderId` like `ORD0001`
- compute `totalAmount`
- copy product details into the order (snapshot)

### Get quotation (no login required)

`POST /api/orders/quote`

Body is the same as create order.

Response:

```json
{ "message": "Order quatation", "total": 12345 }
```

### List orders (admin or customer)

`GET /api/orders`

- Admin: all orders
- Customer: only their orders

### Update order status (admin only)

`PUT /api/orders/status/:orderId`

Requires: admin token.

Body:

```json
{ "status": "Approved" }
```

---

## Contact Messages — `/api/contact`

### Create contact message (public)

`POST /api/contact`

Body:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "phone": "",
  "subject": "Rental question",
  "message": "Hello..."
}
```

Response:

```json
{ "message": "Message sent successfully", "id": 1 }
```

### List contact messages (admin only)

`GET /api/contact`

Requires: admin token.

### Mark contact message as resolved (admin only)

`PUT /api/contact/:id`

Requires: admin token.

---

## Example cURL

### Login and use token

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
```

Then call an endpoint that needs auth:

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

- `index.js` — Express app + JWT middleware + route mounting
- `routes/` — Express routers
- `controllers/` — route handlers (includes role checks)
- `models/` — Mongoose schemas

## Troubleshooting

- **MongoDB connection fails**: confirm `MONGO_URL` is correct and MongoDB is running.
- **401/403 errors**: ensure you pass `Authorization: Bearer <token>` and the user has the correct `role`.
- **Port**: server listens on `3000` (hard-coded in `index.js`).
