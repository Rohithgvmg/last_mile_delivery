# Last Mile Delivery

A full-stack last-mile delivery management application that allows customers to register, log in, calculate delivery charges, create delivery orders, automatically assign available delivery agents, and track the status history of their orders.

## Live Application

**Frontend:**  
https://last-mile-delivery-1-l609.onrender.com

**Backend API:**  
https://last-mile-delivery-063b.onrender.com

## Setup Guide

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run build
npm start
```

Create backend/.env file
```
PORT=5000
DATABASE_URL=<PostgreSQL connection string>
DIRECT_URL=<PostgreSQL direct connection string>
JWT_SECRET=<JWT secret>
```
The backend runs on http://localhost:5000. (locally)

### Frontend
```bash
cd frontend
npm install
```

Create frontend/.env file
```
VITE_API_URL=(backend url link)
```

## API Documentation & Rate Calculation

The API provides endpoints for user registration/login (`POST /api/auth/register`, `POST /api/auth/login`), price preview (`POST /api/pricing/preview`), order creation (`POST /api/orders`), and authenticated order history (`GET /api/orders/history`). Protected endpoints require a JWT in the `Authorization: Bearer <token>` header. For pricing, the system first determines the delivery type as `INTRA` when pickup and drop areas belong to the same zone, otherwise `INTER`; it then selects the appropriate rate card using the order type and zone type, calculates volumetric weight as `(length × breadth × height) / 5000`, uses `max(actualWeight, volumetricWeight)` as the chargeable weight, calculates the base charge as `chargeableWeight × ratePerKg`, adds the COD surcharge when applicable, and finally computes `totalCharge = baseCharge + codSurcharge`.


## DB Schema 
Attached in docs folder




