# Funding — Backend

> *“Build bridges, not walls — and make sure the bridge can process payments at scale.”*

A lean, type‑safe Node.js service that authenticates your admins, spins up **Stripe Checkout** sessions, and aggregates donation metrics for instant reporting. Think of it as the financial engine room behind your philanthropic star‑ship — traditional best‑practice architecture, modern DX, and a sprinkle of Gen‑Z swagger.

---

## Table of Contents
1. [Why This Exists](#why-this-exists)
2. [Feature Matrix](#feature-matrix)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Security Playbook](#security-playbook)
10. [Roadmap](#roadmap)
11. [Contributing](#contributing)
12. [License](#license)

---

## Why This Exists
Most donation backends are either *too* simple (no auth, no ledger) or *too* bloated (monolithic, hard‑to‑deploy). This repo aims for the goldilocks zone:

* **Minimal surface area** — <400 LOC.
* **Scalable** — stateless, horizontally shard‑able.
* **Auditable** — every successful Stripe session is stored with metadata for later BI crunching.

If you need a fast, secure, Stripe‑first donation backend, clone → tweak → deploy. Done.

---

## Feature Matrix
| Domain | What it does | Why you care |
|--------|--------------|--------------|
| **Admin Auth** | Email + password signup/login, salted with **bcrypt** and signed with **JWT**. | Protects the ledger from randos. |
| **Stripe Checkout** | One‑shot donation flow via `checkout.sessions.create` (default currency = BDT). | PCI compliance & polished UX out of the box. |
| **Donation Ledger** | Persists all completed sessions, surfaces totals & donor counts. | Zero‑effort KPIs for finance & marketing. |
| **Role‑based Guard** | `verifyToken` middleware injects `req.admin` on every call. | Least‑privilege by design. |
| **REST API** | Clean, predictable routes documented below. | Integrate from web, mobile, or Zapier without tears. |

---

## Tech Stack
* **Node.js 18 LTS**
* **Express 5**
* **MongoDB Atlas + Mongoose**
* **Stripe SDK** (Checkout Sessions)
* **JSON Web Tokens**
* **bcryptjs**
* **dotenv / cors / helmet**

---

## Architecture
```
┌──────────────┐        ┌────────────┐        ┌─────────────────┐
│  Front‑End   │──HTTP──▶  Express   │──REST──▶  MongoDB Atlas   │
│(Next.js, etc)│        │  Server    │        │ Admins / Donors │
└──────────────┘        │  (this)    │        └─────────────────┘
        ▲               │            │
        │               └────┬───────┘
        │                    │Stripe SDK
        │        ┌───────────▼───────────┐
        └────────┤  Stripe Checkout UI   │
                 └───────────────────────┘
```
The server is **stateless**; horizontal scaling is a `docker compose up --scale api=3` away.

---

## Getting Started
### 1. Clone & Install
```bash
git clone https://github.com/Mathew2004/Funding---Backend.git
cd Funding---Backend
npm install
```

### 2. Copy Env & Fill Secrets
```bash
cp .env.example .env
# open .env in your editor of choice
```

### 3. Run Locally
```bash
npm run dev   # nodemon hot‑reload
# or
node index    # vanilla
```
The API boots on **`http://localhost:5000`**.

### 4. Run Tests
```bash
npm test
```
> Uses **Jest + Supertest**. Coverage report in `/coverage`.

### 5. Deploy
| Target | Command |
|--------|---------|
| **Render.com** | one‑click deploy button (coming soon) |
| **Docker** | `docker build -t funding-api . && docker run -p 80:5000 funding-api` |
| **Heroku** | `git push heroku main` (uses `Procfile`) |

---

## Configuration
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<db>?retryWrites=true&w=majority
JWT_SECRET=ChangeMeNow
JWT_EXPIRATION=1h
STRIPE_SECRET_KEY=sk_live_********************************
FRONTEND_SUCCESS_URL=https://your‑frontend.com/success
FRONTEND_CANCEL_URL=https://your‑frontend.com/cancel
```
> **Never** commit real secrets. Use Render/Heroku config vars or GitHub Actions secrets.

---

## API Reference
All responses are `application/json`. Amounts are in **Bangladeshi Taka (BDT)** unless noted.

### Auth Endpoints `/admin`
| Verb | Path | Body | 200 OK | Errors |
|------|------|------|--------|--------|
| POST | `/signup` | `{ email, password }` | `{ msg: "Signup success" }` | `400 Email exists` |
| POST | `/login`  | `{ email, password }` | `{ token: "<JWT>" }` | `401 Invalid creds` |

Add header `Authorization: Bearer <token>` to every protected route.

### Donation Endpoints `/donate`
| Verb | Path | Auth? | Body | 200 OK | Purpose |
|------|------|-------|------|--------|---------|
| POST | `/` | No | `{ name, phone, email, amount, message }` | `{ url: "https://checkout.stripe.com/..." }` | Creates a Checkout session. |
| GET | `/payments` | Yes | — | `{ data: [...], totals: { count, sum } }` | All completed donations. |
| GET | `/dashboard` | Yes | — | `{ charts: {...} }` | (WIP) Analytics endpoint. |

#### Sample Checkout Flow
```http
POST /donate
Content-Type: application/json
{
  "name": "Tanvir Rahman",
  "phone": "017XXXXXXXX",
  "email": "donor@example.com",
  "amount": 500,
  "message": "Keep up the great work!"
}
→ 200 { "url": "https://checkout.stripe.com/pay/cs_test_..." }
```
Client then `window.location.href = url`.

---

## Database Schema
### `Admin`
```ts
{
  _id: ObjectId,
  email: String!,
  password: String!, // bcrypt hash
  createdAt: Date,
  updatedAt: Date
}
```
### `Donation`
```ts
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  amount: Number, // in smallest currency unit (e.g. 500 = ৳500)
  message: String,
  stripeSessionId: String,
  paid: Boolean,
  createdAt: Date
}
```
Indexes: `Admin.email` (unique), `Donation.stripeSessionId` (unique).

---

## Security Playbook
* **HTTPS** only in production (terminate TLS at LB).
* **JWT rotation** — keep `JWT_EXPIRATION` ≤ 1h and refresh on client.
* **Webhook Verification** — every Stripe event is verified with `stripe.webhooks.constructEvent`.
* **Helmet & Rate‑Limiter** enabled by default (`app.use(helmet())`).
* **CI SAST** — `npm run lint && npm audit` gates in GitHub Actions.

---

## Roadmap
- [ ] Stripe webhook listener for `checkout.session.completed` (in PR #12)
- [ ] Docker‑Compose dev stack (Mongo + API) 🐳
- [ ] OpenAPI 3 docs served at `/docs` via **swagger‑ui**
- [ ] Role granularity (super‑admin, analyst, read‑only)
- [ ] GraphQL layer (if demand exists)

---

## Contributing
1. **Fork** ➜ **Branch** ➜ **Commit** ➜ **PR**.
2. Use **Conventional Commits** (`feat:`, `fix:`, `chore:` …).
3. `npm run lint && npm test` must pass.
4. No secrets or personal data in the diff — the bots will bark.

---

## License
Released under the **MIT License**. See `LICENSE` for full text.

---

> *Built with ☕, ⚡, and the stubborn belief that generous donors change the world.*

