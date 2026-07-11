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

# Webhook (optional)

STRIPE_WEBHOOK_SECRET=whsec_xxx 3) Prisma (Migrate + Generate)
Bash

npx prisma migrate dev
npx prisma generate 4) Seed Database
Bash

npm run seed
Seed Credentials

txt

Admin: admin@gearup.com / 123456
Provider: provider@gearup.com / 123456
Customer: customer@gearup.com / 123456 5) Run Server
Bash

npm run dev
Base URL:

txt

https://gearup-b7a4.onrender.com
Authentication Notes
Authentication is cookie-based
Login sets httpOnly cookies:
accessToken
refreshToken
Protected routes require the cookie to be present (Postman cookies must be enabled)
API Documentation (Postman)
Postman Collection
Exported Postman collection is included:

txt

./postman/GearUp.postman_collection.json
How to use
Postman → Import → select the JSON file
Create an environment variable:
txt

baseUrl = https://gearup-b7a4.onrender.com
Use URLs like:
txt

{{baseUrl}}/api/gear
{{baseUrl}}/api/categories
{{baseUrl}}/api/rentals
{{baseUrl}}/api/payments
API Endpoints
Base URL: {{baseUrl}}

Authentication
Method Endpoint Description
POST /api/auth/register Register new user (customer/provider)
POST /api/auth/login Login user (sets cookies)
POST /api/auth/refresh-token Refresh access token (cookie-based)
GET /api/auth/me Get current authenticated user
Categories
Method Endpoint Description
GET /api/categories Get all categories (public)
POST /api/categories Create category (admin only)
PUT /api/categories/:id Update category (admin only) (optional)
DELETE /api/categories/:id Delete category (admin only, blocked if gear exists) (optional)
Gear (Public)
Method Endpoint Description
GET /api/gear Get all gear with filters
GET /api/gear/:id Get gear details (ACTIVE only)
Gear Filters (Query Params)

txt

/api/gear?categoryId=<id>
/api/gear?brand=intex
/api/gear?minPrice=100&maxPrice=1000
/api/gear?categoryId=<id>&brand=nike&minPrice=100
Provider Gear Management
Method Endpoint Description
POST /api/provider/gear Add gear to inventory
PUT /api/provider/gear/:id Update gear listing
DELETE /api/provider/gear/:id Remove gear from inventory (soft remove)
Soft Remove Behavior

Sets gear.status = INACTIVE
Sets inventory.totalQuantity = 0
Prevents FK errors and preserves rental history
Rental Orders (Customer)
Method Endpoint Description
POST /api/rentals Create new rental order (status: PLACED)
GET /api/rentals Get user's rental orders
GET /api/rentals/:id Get rental order details
PATCH /api/rentals/:id/cancel Cancel order (PLACED only)
Provider Orders
Method Endpoint Description
GET /api/provider/orders Get provider's incoming orders
PATCH /api/provider/orders/:id Update rental order status
Allowed Status Transitions

txt

PLACED -> CONFIRMED (provider)
CONFIRMED -> PAID (payment)
PAID -> PICKED_UP (provider)
PICKED_UP -> RETURNED (provider)
PLACED -> CANCELLED (customer)
Payments (Stripe)
Method Endpoint Description
POST /api/payments/create Create Stripe checkout session (order must be CONFIRMED)
POST /api/payments/confirm Confirm/verify payment (callback)
GET /api/payments Get user's payment history
GET /api/payments/:id Get payment details
POST /api/payments/webhook Stripe webhook (optional)
Reviews
Method Endpoint Description
POST /api/reviews Create review (only after RETURNED),
PATCH /api/reviews/:id Update review (customer only won review)
DELETE /api/reviews/:id delete review (customer only won review)

Review Rules

Review allowed only if order status is RETURNED
One order = one review
Review gear must belong to the rental order items
Admin
Method Endpoint Description
GET /api/admin/users Get all users
PATCH /api/admin/users/:id Suspend/activate user
GET /api/admin/gear Get all gear listings
GET /api/admin/rentals Get all rental orders
Stripe Test Card
txt

Card: 4242 4242 4242 4242
Exp: 12/34
CVC: 123
Error Handling & Validation
Input validation via Zod
Global error handler returns structured responses
404 handler for unknown routes
Video Explanation (3–5 min)
Add your video link here:

txt

<VIDEO_LINK>
License
This project is created for assignment/demo purposes.
