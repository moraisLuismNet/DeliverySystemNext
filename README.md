# DeliverySystemNext

Multi-restaurant food delivery platform built with Next.js 15 App Router, TypeScript, and Sequelize ORM. A full-stack rewrite consolidating the previous [DeliverySystemApiNode](https://github.com/moraisLuismNet/DeliverySystemApiNode) (Express) backend and [DeliverySystemReact](https://github.com/moraisLuismNet/DeliverySystemReact) (Vite + React) frontend into a single deployable Next.js application.

## Key Features

### For Customers

- Browse active restaurants with search and pagination
- View restaurant menus with categories, images, and stock info
- Add/update/remove items from a persistent shopping cart
- Checkout with Stripe Checkout Sessions for secure card payments
- Track order history and order details in real-time
- WhatsApp delivery notifications via OpenWA
- Installable PWA (web manifest + service worker) for mobile/desktop

### For Administrators

- Full CRUD management of restaurants, menu items, and categories
- View and manage all carts, orders, and users
- Monitor email and WhatsApp notification queues
- Order status management (pending, confirmed, preparing, in-delivery, delivered, cancelled)
- Low stock email alerts for menu items

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19) |
| **Language** | TypeScript |
| **Database** | Neon PostgreSQL (serverless) via Sequelize 6 ORM |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Payments** | Stripe Checkout Sessions |
| **Email** | Brevo (SendinBlue) API |
| **WhatsApp** | OpenWA REST API (Docker + ngrok tunnel) |
| **State** | Zustand 5 |
| **Forms** | React Hook Form + Zod validation |
| **UI** | Bootstrap 5 + PrimeReact + PrimeIcons |
| **PWA** | Web manifest + service worker (offline/installable) |
| **Hosting** | Vercel (Next.js) + local PC (OpenWA + ngrok) |

## Architecture

```
┌─────────────────────────────────────────────┐
│              Vercel (Production)             │
│  Next.js 15 App Router (API + Frontend)     │
│  https://delivery-system-next.vercel.app    │
└──────┬──────────────┬───────────────────────┘
       │              │
       │              │ HTTPS (ngrok tunnel)
       │              ▼
       │  ┌───────────────────────────────┐
       │  │   Local PC (Docker Compose)   │
       │  │   openwa-api  :2785           │
       │  │   openwa-ngrok → ngrok        │
       │  └───────────┬───────────────────┘
       │              │
       ▼              │
┌──────────────┐      │
│ Neon Postgres│      │
│ (serverless) │      │
└──────────────┘      │
                      │
          ┌───────────┴──────────────┐
          │   OpenWA WhatsApp API    │
          │   correct-tinwork-both.  │
          │   ngrok-free.dev         │
          └──────────────────────────┘
```

## Project Structure

```
DeliverySystemNext/
├── src/
│   ├── app/
│   │   ├── api/                    # 33 API route handlers
│   │   │   ├── auth/               # Login, register, session mgmt
│   │   │   ├── cart/               # Cart CRUD + checkout
│   │   │   ├── categories/         # Category CRUD
│   │   │   ├── menuitems/          # Menu item CRUD
│   │   │   ├── messages/           # Email + WhatsApp queues
│   │   │   ├── orders/             # Order CRUD + payment
│   │   │   ├── restaurants/        # Restaurant CRUD
│   │   │   └── users/              # User management
│   │   ├── delivery/               # Frontend pages
│   │   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── cart/               # Shopping cart
│   │   │   ├── orders/             # Order list + detail
│   │   │   ├── payment/            # Payment success/cancel
│   │   │   └── restaurants/        # Restaurant list + menu
│   │   ├── auth/                   # Login + register pages
│   │   ├── globals.css
│   │   ├── layout.tsx              # Root layout (Bootstrap + PrimeReact)
│   │   └── page.tsx                # Root redirect to /delivery/restaurants
│   ├── components/
│   │   ├── common/                 # BootstrapClient, ProtectedRoute
│   │   └── layout/                 # Layout, Navbar, Footer
│   ├── db/
│   │   ├── models/                 # 11 Sequelize models + enums
│   │   └── repositories/           # 11 repositories + BaseRepository + interfaces
│   ├── dtos/                       # 27 DTOs across 10 domains
│   ├── helpers/                    # ApiResponse, ResponseHelper
│   ├── hooks/                      # useAuth, useCart, useFetch
│   ├── interfaces/                 # 10 frontend interfaces
│   ├── middleware/                  # Auth (JWT), Rate limiting
│   ├── services/                   # 14 backend services + interfaces
│   ├── services/ (frontend)        # 8 API client services
│   ├── store/                      # Zustand stores (auth, cart)
│   └── utils/                      # fetch-api, errorHandling
├── middleware.ts                    # Root Next.js middleware (rate limiting)
├── public/
│   ├── manifest.json                # PWA web manifest
│   ├── sw.js                        # Service worker (offline/installable)
│   └── icons/                       # PWA icons (192/512 + maskable)
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

## Pages & Routes

### Public

| Path | Description |
|---|---|
| `/` | Redirects to `/delivery/restaurants` |
| `/auth/login` | User login |
| `/auth/register` | User registration |
| `/delivery/restaurants` | Browse active restaurants |

### Protected (session required)

| Path | Description |
|---|---|
| `/delivery/restaurants/[id]/menu` | View restaurant menu |
| `/delivery/cart` | Shopping cart |
| `/delivery/orders` | User's order history |
| `/delivery/orders/[id]` | Order detail |
| `/delivery/payment/success` | Payment success callback |
| `/delivery/payment/cancel` | Payment cancelled callback |

### Admin (Admin role required)

| Path | Description |
|---|---|
| `/delivery/admin/restaurants` | Manage restaurants |
| `/delivery/admin/menu-items` | Manage menu items |
| `/delivery/admin/categories` | Manage categories |
| `/delivery/admin/orders` | View all orders |
| `/delivery/admin/carts` | View all carts |
| `/delivery/admin/users` | Manage users |
| `/delivery/admin/messages` | WhatsApp notification queue |
| `/delivery/admin/mails` | Email notification queue |

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/register` | Register new account |
| GET | `/api/auth/session/status` | OpenWA session status |
| GET | `/api/auth/session/qr` | OpenWA QR code |
| POST | `/api/auth/session/reset` | Reset OpenWA session |
| GET/POST | `/api/cart` | Get / clear cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items` | Update cart item quantity |
| DELETE | `/api/cart/items/[id]` | Remove cart item |
| POST | `/api/cart/checkout` | Checkout (creates Stripe session) |
| GET | `/api/cart/admin` | Admin: all carts |
| GET/POST | `/api/categories` | List / create categories |
| GET/PUT/DELETE | `/api/categories/[id]` | Get / update / delete category |
| GET | `/api/categories/active` | Active categories |
| GET/POST | `/api/menuitems` | List / create menu items |
| GET/PUT/DELETE | `/api/menuitems/[id]` | Get / update / delete menu item |
| GET | `/api/menuitems/restaurant/[id]` | Menu items by restaurant |
| GET | `/api/menuitems/restaurant/[id]/available` | Available items by restaurant |
| GET/POST | `/api/orders` | List / create orders |
| GET | `/api/orders/my` | Current user's orders |
| GET/POST/DELETE | `/api/orders/[id]` | Get / confirm / cancel order |
| POST | `/api/orders/[id]/confirm` | Confirm order |
| PUT | `/api/orders/[id]/status` | Update order status |
| POST | `/api/orders/[id]/pay` | Create payment session |
| GET | `/api/orders/payment-success` | Confirm Stripe payment |
| GET | `/api/orders/payment-cancel` | Payment cancelled |
| GET/POST | `/api/restaurants` | List / create restaurants |
| GET/PUT/DELETE | `/api/restaurants/[id]` | Get / update / delete restaurant |
| GET | `/api/restaurants/active` | Active restaurants |
| GET/POST | `/api/messages` | Notification queues |
| GET | `/api/messages/whatsapp` | WhatsApp queue |
| GET | `/api/messages/emails` | Email queue |
| GET/POST | `/api/users` | List / create users |
| GET/PUT/DELETE | `/api/users/[email]` | Get / update / delete user |

## Backend Services

| Service | Responsibility |
|---|---|
| `authService` | Login, register, password change |
| `jwtService` | Token generation and validation |
| `userService` | User CRUD |
| `restaurantService` | Restaurant CRUD |
| `menuItemService` | Menu item CRUD with restaurant/category resolution |
| `categoryService` | Category CRUD |
| `cartService` | Cart management with stock validation, checkout orchestration |
| `orderService` | Order lifecycle management |
| `paymentService` | Stripe session creation, payment confirmation, direct email/WhatsApp delivery (queued on failure) |
| `emailQueueService` | Email queue management |
| `notificationService` | WhatsApp + email queue reads |
| `brevoEmailProvider` | Brevo (SendinBlue) email sending |
| `openWAProvider` | OpenWA WhatsApp message sending |
| `openWASessionService` | OpenWA session management (status, QR, create, delete) |

## Notification Delivery

Order confirmations are sent **directly** during payment confirmation (in `paymentService.confirmPaymentAsync`):

- **Email (Brevo)** — sent immediately via `brevoEmailProvider`; on failure, queued as `Pending` in the `EmailQueues` table.
- **WhatsApp (OpenWA)** — sent immediately via `openWAProvider` (phone number is normalized to an international `chatId`); on failure, queued as `Pending` in the `NotificationQueues` table.
- Successful direct sends are recorded with status `Sent` and a `SentAt` timestamp so admins can track them.
- The admin queues (`/delivery/admin/messages`, `/delivery/admin/mails`) show both successful (`Sent`) and pending/failed records.

> Note: Items left as `Pending` require processing (there is no always-on background worker; this is a serverless app on Vercel). Ensure the external providers are reachable from Vercel (authorize Vercel's outbound IPs in Brevo, and keep the OpenWA session ready).

## Getting Started

### Prerequisites

- Node.js 18+
- Docker + Docker Compose (for OpenWA)
- Neon account (free tier works) for PostgreSQL

### Environment Variables

Create `.env.local` in the project root:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:xxx@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT
JWT_KEY=your-secret-key
JWT_ISSUER=DeliverySystemApiNode
JWT_AUDIENCE=DeliverySystemApiNode
JWT_EXPIRY_HOURS=1

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SUCCESS_URL=https://delivery-system-next.vercel.app/delivery/payment/success
STRIPE_CANCEL_URL=https://delivery-system-next.vercel.app/delivery/payment/cancel

# Brevo Email
EMAIL_BREVO_API_KEY=xkeysib-...
EMAIL_FROM_EMAIL=your@email.com
EMAIL_FROM_NAME=Delivery System
EMAIL_ADMIN_EMAIL=your@email.com

# OpenWA (ngrok tunnel)
OPENWA_BASE_URL=https://correct-tinwork-both.ngrok-free.dev/api
OPENWA_API_KEY=owa_...
OPENWA_SESSION_ID=delivery-session
OPENWA_DEFAULT_COUNTRY_CODE=34  # prepended when the phone number has no country code

# App
NEXT_PUBLIC_APP_URL=https://delivery-system-next.vercel.app
NEXT_PUBLIC_API_URL=/api
```

### Install & Run Locally

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

### 1. Next.js on Vercel

- Push to GitHub
- Import project in [Vercel](https://vercel.com)
- Set all environment variables in **Settings > Environment Variables** (Production scope)
- Deploy -- `output: "standalone"` is pre-configured

### 2. OpenWA Container (WhatsApp)

Runs on your local PC, exposed to the internet via ngrok:

```bash
cd E:\CODE\OpenWA

# Start OpenWA API + ngrok tunnel
docker compose --profile ngrok up -d

# Verify tunnel works
curl https://correct-tinwork-both.ngrok-free.dev/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Stop everything
docker compose --profile ngrok down
```

The `E:\CODE\OpenWA\.env` file contains:

```bash
API_MASTER_KEY=owa_k1_...
NGROK_AUTHTOKEN=your-ngrok-authtoken
NGROK_DOMAIN=correct-tinwork-both.ngrok-free.dev
CORS_ORIGINS=https://delivery-system-next.vercel.app,http://localhost:3000
```

### 3. Neon Database (Serverless PostgreSQL)

- Create a free account at [neon.tech](https://neon.tech)
- Create a project and copy the connection string
- Set `DATABASE_URL` in Vercel env vars with the Neon connection string (with `sslmode=require`)
- The database schema is managed by Sequelize models (auto-synced on first request)

## Screenshots

| | | |
|---|---|---|
| <kbd><img src="img/01.png" width="60%" height="90%" alt="01"></kbd> | <kbd><img src="img/02.png" width="60%" height="90%" alt="02"></kbd> | <kbd><img src="img/03.png" width="90%" height="90%" alt="03"></kbd> |
| <kbd><img src="img/04.png" width="80%" height="90%" alt="04"></kbd> | <kbd><img src="img/05.png" width="60%" height="90%" alt="05"></kbd> | <kbd><img src="img/06.png" width="90%" height="90%" alt="06"></kbd> |
| <kbd><img src="img/07.png" width="90%" height="90%" alt="07"></kbd> | <kbd><img src="img/08.png" width="60%" height="90%" alt="08"></kbd> | <kbd><img src="img/09.png" width="90%" height="90%" alt="09"></kbd> |
| <kbd><img src="img/10.png" width="90%" height="90%" alt="10"></kbd> | <kbd><img src="img/11.png" width="90%" height="90%" alt="11"></kbd> | <kbd><img src="img/12.png" width="60%" height="90%" alt="12"></kbd> |
| <kbd><img src="img/13.png" width="90%" height="90%" alt="13"></kbd> | <kbd><img src="img/14.png" width="90%" height="90%" alt="14"></kbd> | <kbd><img src="img/15.png" width="60%" height="90%" alt="15"></kbd> |
| <kbd><img src="img/16.png" width="90%" height="90%" alt="16"></kbd> | <kbd><img src="img/17.png" width="90%" height="90%" alt="17"></kbd> | <kbd><img src="img/18.png" width="60%" height="90%" alt="18"></kbd> |

---

[DeepWiki moraisLuismNet/DeliverySystemNext](https://deepwiki.com/moraisLuismNet/DeliverySystemNext)
