# FixItNow

A backend API for a home-service booking platform that connects **customers** with **technicians** (plumbing, electrical, cleaning, painting, and more). Customers can browse services, book technicians, pay online, and leave reviews. Technicians manage their profile, availability, and bookings. Admins moderate users and service categories.

Built with **Express**, **TypeScript**, and **Prisma ORM** on **PostgreSQL**.

---

## Tech Stack

- **Runtime:** Node.js + TypeScript (`tsx` for dev, watch mode)
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (access token), `bcryptjs` for password hashing
- **Other:** `cors`, `cookie-parser`, `http-status`

---

## Project Structure

```
src/
├── app.ts                     # Express app setup, route mounting
├── server.ts                  # Server bootstrap
├── config/                    # Environment config
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── middlewares/
│   ├── auth.ts                 # JWT verification + role-based guard
│   ├── globalErrorHandler.ts   # Centralized error handling (Prisma-aware)
│   └── notFound.ts
├── utils/
│   ├── catchAsync.ts
│   ├── jwt.ts
│   └── sendResponse.ts
└── modules/
    ├── user/                   # User registration, own profile
    ├── auth/                   # Login, /me
    ├── profile/                 # Profile CRUD
    ├── technician/               # TechnicianProfile CRUD (admin/public)
    ├── technician-panel/         # Technician self-service (profile/availability/bookings)
    ├── availability/             # Availability slots (nested under technicians)
    ├── service-category/         # Service categories
    ├── service/                  # Services offered by technicians
    ├── booking/                  # Bookings between customers & technicians
    ├── payment/                  # Payment records (Stripe / SSLCommerz)
    ├── review/                   # Customer reviews for technicians
    └── admin/                    # Admin: user & booking moderation

prisma/
├── schema.prisma
├── enum.prisma
├── user.prisma
├── profile.prisma
├── technician.prisma
├── service.prisma
├── booking.prisma
├── payment.prisma
└── review.prisma
```

Each module follows the same pattern: `*.interface.ts` (types) → `*.service.ts` (Prisma queries) → `*.controller.ts` (request/response) → `*.route.ts` (Express router).

---

## Database Schema (overview)

| Model               | Purpose                                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `User`              | Account info, hashed password, `role` (`CUSTOMER` / `TECHNICIAN` / `ADMIN`), `activeStatus` (`BAN` / `UNBAN`)              |
| `Profile`           | Optional bio/photo, 1-1 with `User`                                                                                        |
| `TechnicianProfile` | Skills, experience, hourly rate, location, average rating — 1-1 with `User`                                                |
| `Availability`      | Weekly time slots per technician                                                                                           |
| `ServiceCategory`   | Service types (Plumbing, Electrical, etc.)                                                                                 |
| `Service`           | A specific service offered by a technician, under a category                                                               |
| `Booking`           | A customer's booking of a technician for a service, with a status lifecycle                                                |
| `Payment`           | Payment record tied to a booking (`method`: `STRIPE` / `SSLCOMMERZ`, `status`: `PENDING` / `PAID` / `FAILED` / `REFUNDED`) |
| `Review`            | Customer's rating + comment for a technician, tied to a completed booking                                                  |

**Booking status flow:** `PENDING → ACCEPTED / DECLINED → IN_PROGRESS → COMPLETED` (or `CANCELLED` at any point).

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require"

PORT=5000
NODE_ENV=development
APP_URL="http://localhost:3000"

BCRYPT_SALT_ROUNDS=12

JWT_ACCESS_SECRET="your-access-token-secret"
JWT_ACCESS_EXPIRES_IN="7d"

STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
```

> Adjust variable names to match whatever `src/config/index.ts` actually reads — the list above reflects the config keys referenced elsewhere in the codebase (`app_url`, `bcrypt_salt_rounds`, `jwt_access_secret`, `stripe_webhook_secret`).

### 3. Generate Prisma Client & run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start the dev server

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

---

## Authentication

Most endpoints require a JWT sent as either:

- `Authorization: Bearer <token>` header, or
- an `accessToken` cookie

Roles: `CUSTOMER`, `TECHNICIAN`, `ADMIN`. Endpoints are protected with role-based guards (`auth(Role.ADMIN)`, etc.) — see the table below for which role each endpoint expects.

---

## API Endpoints

### Authentication

| Method | Endpoint             | Auth | Description                                                     |
| ------ | -------------------- | ---- | --------------------------------------------------------------- |
| POST   | `/api/auth/register` | —    | Register new user (`role`: `CUSTOMER` / `TECHNICIAN` / `ADMIN`) |
| POST   | `/api/auth/login`    | —    | Login, returns JWT                                              |
| GET    | `/api/auth/me`       | Any  | Get current authenticated user                                  |

### Services & Technicians (Public)

| Method | Endpoint               | Auth | Description                                                             |
| ------ | ---------------------- | ---- | ----------------------------------------------------------------------- |
| GET    | `/api/services`        | —    | Get all services. Filters: `type` (category name), `location`, `rating` |
| GET    | `/api/technicians`     | —    | Get all technician profiles                                             |
| GET    | `/api/technicians/:id` | —    | Get technician profile with reviews                                     |
| GET    | `/api/categories`      | —    | Get all service categories                                              |

### Bookings

| Method | Endpoint            | Auth     | Description                                                |
| ------ | ------------------- | -------- | ---------------------------------------------------------- |
| POST   | `/api/bookings`     | Customer | Create new booking                                         |
| GET    | `/api/bookings`     | Any      | Get bookings (filterable by `customerId` / `technicianId`) |
| GET    | `/api/bookings/:id` | Any      | Get booking details                                        |

### Payments (Stripe / SSLCommerz)

| Method | Endpoint                | Auth                 | Description                                             |
| ------ | ----------------------- | -------------------- | ------------------------------------------------------- |
| POST   | `/api/payments/create`  | Customer             | Create a payment record for a booking                   |
| POST   | `/api/payments/confirm` | — (webhook/callback) | Confirm/verify payment by `bookingId` + `transactionId` |
| GET    | `/api/payments`         | Any                  | Get logged-in user's payment history                    |
| GET    | `/api/payments/:id`     | Any                  | Get payment details                                     |

> **Note:** Payment creation currently writes directly to the database — it does not yet call the Stripe/SSLCommerz APIs to create a real payment intent/session. `/confirm` is not signature-verified against the provider; wire that in before production use.

### Technician Management (self-service)

| Method | Endpoint                       | Auth       | Description                                           |
| ------ | ------------------------------ | ---------- | ----------------------------------------------------- |
| PUT    | `/api/technician/profile`      | Technician | Update own technician profile                         |
| PUT    | `/api/technician/availability` | Technician | Replace own availability slots                        |
| GET    | `/api/technician/bookings`     | Technician | Get own bookings                                      |
| PATCH  | `/api/technician/bookings/:id` | Technician | Update own booking's status (accept/decline/complete) |

### Reviews

| Method | Endpoint       | Auth     | Description                           |
| ------ | -------------- | -------- | ------------------------------------- |
| POST   | `/api/reviews` | Customer | Create review for a completed booking |

### Admin

| Method | Endpoint                | Auth  | Description                          |
| ------ | ----------------------- | ----- | ------------------------------------ |
| GET    | `/api/admin/users`      | Admin | Get all users                        |
| PATCH  | `/api/admin/users/:id`  | Admin | Update user status (`BAN` / `UNBAN`) |
| GET    | `/api/admin/bookings`   | Admin | Get all bookings                     |
| GET    | `/api/admin/categories` | Admin | Get all categories                   |
| POST   | `/api/admin/categories` | Admin | Create new service category          |

---

## Known Limitations / TODO

- [ ] Real Stripe / SSLCommerz payment intent & webhook signature verification
- [ ] Restrict review creation to bookings with `status: COMPLETED`
- [ ] Validate booking status transitions (e.g. block `PENDING → COMPLETED` directly)
- [ ] Filtering on `GET /api/services` by `type` currently matches category **name** exactly (case-insensitive) — consider supporting `categoryId` as an alternate filter

---

## License

For educational/assignment purposes.
