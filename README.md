# Funding — Backend

---

## Features

- **Admin Auth** – Email + password with **bcrypt** & **JWT**
- **Stripe Checkout** – Secure, PCI‑compliant donation flow (default currency = BDT)
- **Donation Ledger** – Every successful session stored for instant KPI reporting
- **RESTful API** – Clean, predictable JSON endpoints
- **Stateless** – Easy horizontal scaling & container deployment

---

## Tech Stack

| Layer     | Tool                           |
| --------- | ------------------------------ |
| Runtime   | Node.js 18 LTS                 |
| Framework | Express 5                      |
| Database  | MongoDB Atlas + Mongoose       |
| Payments  | Stripe SDK (Checkout Sessions) |
| Auth      | JSON Web Tokens                |
| Security  | bcryptjs · cors · helmet       |

---

## **Architecture**

```
┌───────────┐    HTTPS    ┌─────────────┐    Mongo Driver    ┌──────────────┐
│ Front‑End │ ───────────▶│  Express API │───────────────────▶│  MongoDB Atlas│
└───────────┘             └─────────────┘                    └──────────────┘
                                │
                                │ Stripe SDK
                                ▼
                          ┌───────────────┐
                          │Stripe Checkout│
                          └───────────────┘
```

The service is **stateless**; spin up multiple instances behind a load balancer for horizontal scaling.

---

## Getting Started

```bash
# 1. Clone & install
git clone https://github.com/Mathew2004/Funding---Backend.git
cd Funding---Backend
npm install


a. npm run dev   
# or
b. node index    # vanilla
```

Server listens on **`http://localhost:5000`** by default.

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
JWT_SECRET=ChangeMeNow
JWT_EXPIRATION=1h
STRIPE_SECRET_KEY=sk_live_********************************
FRONTEND_SUCCESS_URL=https://your‑frontend.com/success
FRONTEND_CANCEL_URL=https://your‑frontend.com/cancel
```

> Never commit real secrets—use platform config vars.

---

## API Overview

### Auth (`/admin`)

| Verb | Path      | Body                  | Success         |
| ---- | --------- | --------------------- | --------------- |
| POST | `/signup` | `{ email, password }` | `200 { msg }`   |
| POST | `/login`  | `{ email, password }` | `200 { token }` |

Add header `Authorization: Bearer <token>` to protected routes.

### Donations (`/donate`)

| Verb | Path        | Auth | Body                                      | Success                         |
| ---- | ----------- | ---- | ----------------------------------------- | ------------------------------- |
| POST | `/`         | ✗    | `{ name, email, phone, amount, message }` | `200 { url }` (Stripe Checkout) |
| GET  | `/payments` | ✓    | —                                         | `200 { data, totals }`          |

Amounts are in Bangladeshi Taka (BDT).

---

## License

MIT

