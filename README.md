# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**  
Backend API for a sports & outdoor equipment rental service.

---

## Project Overview

GearUp is a backend API where:

- **Customers** browse gear, place rental orders, pay, track order status, and leave reviews.
- **Providers** manage their gear inventory and fulfill rental orders.
- **Admins** oversee the platform, manage users, manage categories, and monitor rentals.

---

## Roles & Permissions

| Role         | Key Permissions                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------- |
| **Customer** | Browse gear, create rental orders, pay, view rentals, cancel (PLACED only), review after return     |
| **Provider** | Add/update/remove gear from inventory, view incoming orders, update order status                    |
| **Admin**    | View all users, suspend/activate users, view all gear listings, view all rentals, manage categories |

> Users select their role during registration.

---

## Tech Stack

- Node.js, Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication (**Cookie-based**)
- Zod Validation
- Stripe Checkout (Test Mode)

---

## Project Setup

### 1) Clone & Install

```bash
git clone <https://github.com/nurulaminsw/GearUp-B7A4.git>
npm install

```

2. Environment Variables
   Create a .env file in the project root:

env

PORT=5000
NODE_ENV=development

DATABASE_URL=""

APP_URL=https://gearup-b7a4.onrender.com/

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRE_IN=1d
JWT_REFRESH_EXPIRE_IN=7d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=sk_test_xxx
CLIENT_URL=https://gearup-b7a4.onrender.com

## Webhook (Optional)

```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Prisma: Migrate & Generate

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Seed Database

```bash
npm run seed
```

### Seed Credentials

```txt
Admin:
Email: admin@gearup.com
Password: 123456

Provider:
Email: provider@gearup.com
Password: 123456

Customer:
Email: customer@gearup.com
Password: 123456
```

---

## Run Server

```bash
npm run dev
```

### Base URL

```txt
https://gearup-b7a4.onrender.com
```

---

# Authentication Notes

- Authentication is cookie-based.
- Login sets the following `httpOnly` cookies:
  - `accessToken`
  - `refreshToken`
- Protected routes require authentication cookies.
- When using Postman, make sure cookies are enabled.

---

# API Documentation (Postman)

## Postman Collection

The exported Postman collection is available here:

```txt
./postman/GearUp.postman_collection.json
```

### How to Use

1. Open Postman.
2. Click **Import**.
3. Select the file:

```txt
./postman/GearUp.postman_collection.json
```

4. Create an environment variable:

```txt
baseUrl = https://gearup-b7a4.onrender.com
```

### Example URLs

```txt
{{baseUrl}}/api/gear
{{baseUrl}}/api/categories
{{baseUrl}}/api/rentals
{{baseUrl}}/api/payments
```

---

# API Endpoints

**Base URL:**

```txt
{{baseUrl}}
```

---

## Authentication

| Method | Endpoint                  | Description                               |
| ------ | ------------------------- | ----------------------------------------- |
| POST   | `/api/auth/register`      | Register a new customer or provider       |
| POST   | `/api/auth/login`         | Login user and set authentication cookies |
| POST   | `/api/auth/refresh-token` | Refresh access token using cookie         |
| GET    | `/api/auth/me`            | Get current authenticated user            |

---

## Categories

| Method | Endpoint              | Description                                            |
| ------ | --------------------- | ------------------------------------------------------ |
| GET    | `/api/categories`     | Get all categories (public)                            |
| POST   | `/api/categories`     | Create a category (admin only)                         |
| PUT    | `/api/categories/:id` | Update a category (admin only)                         |
| DELETE | `/api/categories/:id` | Delete a category (admin only, blocked if gear exists) |

---

## Gear (Public)

| Method | Endpoint        | Description                         |
| ------ | --------------- | ----------------------------------- |
| GET    | `/api/gear`     | Get all active gear with filters    |
| GET    | `/api/gear/:id` | Get gear details (active gear only) |

### Gear Filters (Query Params)

```txt
/api/gear?categoryId=<id>
/api/gear?brand=intex
/api/gear?minPrice=100&maxPrice=1000
/api/gear?categoryId=<id>&brand=nike&minPrice=100
```

---

## Provider Gear Management

| Method | Endpoint                 | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| POST   | `/api/provider/gear`     | Add gear to provider inventory           |
| PUT    | `/api/provider/gear/:id` | Update a gear listing                    |
| DELETE | `/api/provider/gear/:id` | Remove gear from inventory (soft remove) |

### Soft Remove Behavior

When a provider removes gear:

- `gear.status` is set to `INACTIVE`
- `inventory.totalQuantity` is set to `0`
- Rental history is preserved
- Foreign key errors are prevented

---

## Rental Orders (Customer)

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/api/rentals`            | Create a new rental order (`PLACED`) |
| GET    | `/api/rentals`            | Get current user's rental orders     |
| GET    | `/api/rentals/:id`        | Get rental order details             |
| PATCH  | `/api/rentals/:id/cancel` | Cancel rental order (`PLACED` only)  |

---

## Provider Orders

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| GET    | `/api/provider/orders`     | Get provider's incoming rental orders |
| PATCH  | `/api/provider/orders/:id` | Update rental order status            |

### Allowed Status Transitions

```txt
PLACED -> CONFIRMED   (Provider)
CONFIRMED -> PAID     (Payment)
PAID -> PICKED_UP     (Provider)
PICKED_UP -> RETURNED (Provider)
PLACED -> CANCELLED   (Customer)
```

---

## Payments (Stripe)

| Method | Endpoint                | Description                                                |
| ------ | ----------------------- | ---------------------------------------------------------- |
| POST   | `/api/payments/create`  | Create Stripe Checkout Session (order must be `CONFIRMED`) |
| POST   | `/api/payments/confirm` | Confirm or verify payment callback                         |
| GET    | `/api/payments`         | Get current user's payment history                         |
| GET    | `/api/payments/:id`     | Get payment details                                        |
| POST   | `/api/payments/webhook` | Stripe webhook endpoint (optional)                         |

---

## Reviews

| Method | Endpoint           | Description                              |
| ------ | ------------------ | ---------------------------------------- |
| POST   | `/api/reviews`     | Create a review after rental is returned |
| PATCH  | `/api/reviews/:id` | Update own review (customer only)        |
| DELETE | `/api/reviews/:id` | Delete own review (customer only)        |

### Review Rules

- A review can only be created when the rental status is `RETURNED`.
- One rental order can have only one review.
- Reviewed gear must belong to the rental order items.
- A customer can update or delete only their own review.

---

## Admin

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/api/admin/users`     | Get all users              |
| PATCH  | `/api/admin/users/:id` | Suspend or activate a user |
| GET    | `/api/admin/gear`      | Get all gear listings      |
| GET    | `/api/admin/rentals`   | Get all rental orders      |

---

# Stripe Test Card

Use the following Stripe test card for payment testing:

```txt
Card Number: 4242 4242 4242 4242
Expiry Date: 12/34
CVC: 123
```

---

# Error Handling & Validation

- Input validation is handled using **Zod**.
- A global error handler returns structured error responses.
- A `404` handler is included for unknown routes.

---

# Video Explanation

Add your project video link here:

```txt
https://drive.google.com/file/d/11dxmW6RUnG0evDzeKYXLiSy56x4pKCJm/view?usp=sharing
```

---

# License

This project is created for assignment and demo purposes.
