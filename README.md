# Last Mile Delivery

A full-stack last-mile delivery management application that allows customers to register, log in, calculate delivery charges, create delivery orders, automatically assign available delivery agents, and track the status history of their orders.

## Live Application

**Frontend:**  
https://last-mile-delivery-1-l609.onrender.com

**Backend API:**  
https://last-mile-delivery-063b.onrender.com

The deployed application has been tested end-to-end for:

- User registration
- User login
- Delivery price calculation
- Order creation
- Automatic agent assignment
- Order status tracking
- Order history and status history

---

# Features

### Customer Authentication

- User registration with name, email, and password
- Password hashing using bcrypt
- JWT-based authentication
- Protected order and pricing endpoints
- Customer role is assigned automatically during registration

### Delivery Price Calculation

The application calculates delivery charges based on:

- Pickup area
- Drop area
- Delivery zone
- Package dimensions
- Actual package weight
- Volumetric weight
- Chargeable weight
- Order type (`B2B` / `B2C`)
- Payment type (`COD` / `PREPAID`)

### Automatic Agent Assignment

When an order is created:

1. The pickup area's zone is identified.
2. Available agents belonging to that zone are considered.
3. Agents without location information are ignored.
4. The nearest available agent is selected using geographic distance.
5. The order is automatically assigned to that agent.
6. The order status changes from `CREATED` to `ASSIGNED`.

### Order History

Customers can view all their orders along with:

- Order ID
- Current order status
- Complete status history
- Timestamp of each status update

Status history is displayed from the latest update to the oldest update.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- CSS

## Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- CORS

## Database

- PostgreSQL
- Prisma ORM

## Deployment

- Frontend: Render - Static hosting
- Backend: Render - Web Service
- PostgreSQL database - Neon 

---

# Project Structure

```text
last_mile_delivery/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── database-design.dbml
│   ├── database-design.png
│   └── sequence_flow.png
│
├── system_design.txt
└── README.md
