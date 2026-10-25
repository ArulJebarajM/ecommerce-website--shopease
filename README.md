# ShopEase

**A Modern Full-Stack E-commerce Web Application Built with the MERN Stack**

ShopEase is a full-stack e-commerce application built using MongoDB, Express.js, React, and Node.js. It provides a modern shopping interface with product discovery, cart management, customer accounts, order handling, and administrative product management.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Using ShopEase](#using-shopease)
- [Demo Accounts](#demo-accounts)
- [API Reference](#api-reference)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Developer](#developer)

## Overview

ShopEase combines a React-based storefront with an Express REST API and MongoDB database. The frontend handles the shopping experience, while the backend manages supported product and order operations.

The project is organized into two main applications:

- **Client:** React frontend powered by Vite.
- **Server:** Node.js and Express backend connected to MongoDB using Mongoose.

## Features

### Product Catalog
- Browse available products.
- Search products by name.
- Filter products by category.
- View product information through a quick-view interface.
- Display product images and prices.

### Shopping Cart
- Add products to the cart.
- Increase or decrease item quantities.
- Remove products from the cart.
- Calculate the subtotal based on product quantities and prices.

### Customer Accounts
- Customer registration.
- Customer login.
- Authentication-dependent functionality, according to the current implementation.

### Orders and Checkout
- Demo checkout workflow.
- Submit orders through the backend.
- Store supported order information in MongoDB.
- Retrieve order details through the available API.
- Order history functionality, where connected to the current implementation.

### Product Reviews
- Product review functionality, where implemented and connected to the application.

### Admin Product Management
- Create products.
- Update product information.
- Delete products.
- Manage product data through administrative API endpoints.

### Additional Features
- Responsive storefront interface.
- REST API architecture.
- MongoDB and Mongoose integration.
- Sample product seeding script.
- PNG product images, where included in `client/public/images/`.

> **Note:** Features depend on the current source code and backend configuration. Checkout is a demonstration flow, not a real payment-processing integration.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | Database modeling |
| npm | Package management |
| Git and GitHub | Version control |

## Project Structure

```text
shopease-mern-ecommerce/
├── client/
│   ├── public/
│   │   └── images/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── package.json
│   └── .env.example
├── docs/
├── .gitignore
└── README.md
```

This is a representative structure. Actual filenames and folders may differ in the repository.

## Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) — preferably an LTS release.
- npm — included with Node.js.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/atlas).
- [Git](https://git-scm.com/).

Verify the installations:

```bash
node --version
npm --version
git --version
```

## Getting Started

### 1. Clone the Repository

Replace `YOUR_REPOSITORY_URL` with the actual GitHub repository URL.

```bash
git clone YOUR_REPOSITORY_URL
cd shopease-mern-ecommerce
```

If you already have the project on your computer, open its existing root folder.

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure the Environment

If `server/.env.example` exists, create a local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Open `server/.env` and configure the variables required by the backend.

Example configuration:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopease
JWT_SECRET=replace_with_a_long_random_secret
```

These are example values. Use the variable names required by your actual backend code and `.env.example` file.

Never commit real passwords, database credentials, JWT secrets, or API keys.

### 4. Start MongoDB

For a local database, ensure MongoDB is running.

For MongoDB Atlas, configure your connection string and verify the database user's permissions and network access settings.

### 5. Seed Sample Products

If the backend defines a seed script, run it from the `server` directory:

```bash
npm run seed
```

Check `server/package.json` if the script has a different name. Review the seed script before rerunning it to understand whether it inserts, replaces, or removes existing data.

### 6. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend commonly runs at:

```text
http://localhost:5000
```

The actual port depends on the environment configuration.

### 7. Install and Start the Frontend

Open a second terminal in the project root:

```bash
cd client
npm install
npm run dev
```

Vite will display the frontend URL, commonly:

```text
http://localhost:5173
```

Open the URL printed in the terminal.

**Keep both frontend and backend terminals running while using the application.**

## Environment Configuration

The backend may use the following variables:

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT signing, if JWT is implemented |

The exact variables depend on the current source code. Update `.env.example` whenever new configuration variables are introduced, but use placeholders rather than real secrets.

## Using ShopEase

1. Start MongoDB.
2. Start the backend server.
3. Start the frontend development server in a separate terminal.
4. Open the local frontend URL.
5. Browse products or search by name.
6. Filter products by category.
7. Open product details.
8. Add products to the cart.
9. Update quantities and review the subtotal.
10. Test the demo checkout and order functionality.
11. Use administrative functionality only with a properly authorized account.

Some actions require customer authentication or administrative permissions, depending on the implementation.

## Demo Accounts

The following account details were provided for local testing. The accounts must exist in the configured database and be supported by the current authentication system.

### Customer Account

| Field | Value |
|---|---|
| Name | AKASH |
| Email | `aka@gmail.com` |
| Password | Configure locally; do not publish it here |

### Administrator Account

| Field | Value |
|---|---|
| Email | `admin@shopease.local` |
| Password | Configure locally; do not publish it here |

**Security:** These are demonstration account details, not guaranteed working credentials. Do not publish passwords in a public README. If the supplied passwords are used by an existing account, keep them private and change them if they have already been exposed.

## API Reference

The following table describes the intended API routes. Verify each endpoint against the current backend implementation.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API health |
| `GET` | `/api/products` | Retrieve products |
| `GET` | `/api/products/:id` | Retrieve a product by ID |
| `POST` | `/api/orders` | Create a demo order |
| `GET` | `/api/orders/:id` | Retrieve order details |
| `POST` | `/api/admin/products` | Create a product |
| `PUT` | `/api/admin/products/:id` | Update a product |
| `DELETE` | `/api/admin/products/:id` | Delete a product |

### Example API Request

Retrieve the product catalog:

```bash
curl http://localhost:5000/api/products
```

The response format depends on the backend implementation.

Administrative endpoints must be protected by server-side authorization. Do not rely on a fixed demo key or demonstration header for production security.

## Security

Before public deployment:

- Hash customer passwords securely.
- Enforce authentication and role-based authorization on the server.
- Validate incoming request data.
- Verify order ownership before returning private order information.
- Calculate order totals on the server.
- Configure CORS and rate limiting appropriately.
- Use HTTPS in deployment.
- Keep environment secrets outside the repository.
- Implement appropriate cookie and CSRF protections where applicable.
- Use a payment-provider sandbox if payment integration is added.
- Add automated tests and conduct a security review.

The demo checkout must not be used to accept real payments.

## Troubleshooting

### Backend cannot connect to MongoDB
- Check that MongoDB is running.
- Verify `MONGODB_URI` in `server/.env`.
- Confirm your database permissions and connection settings.

### Frontend cannot load products
- Confirm the backend is running.
- Check the API URL used by the frontend.
- Inspect the browser console and backend terminal for errors.

### `npm run dev` is unavailable
- Run `npm install` in the relevant `client` or `server` directory.
- Check the `scripts` section in that directory's `package.json`.

### Demo login fails
- Confirm that the account exists in the database.
- Verify that the login endpoint and authentication settings match the current implementation.
- Do not expose account passwords or secret values when asking for help.

## Future Improvements

- Persistent shopping cart and wishlist.
- Improved order history and order status tracking.
- Product inventory management.
- Secure role-based admin dashboard.
- Payment-provider sandbox integration.
- Automated unit and integration tests.
- Improved logging and error handling.
- Deployment with secure environment configuration.

## License

No license is specified by this README. Add a `LICENSE` file if you want to grant others permission to use, modify, or redistribute the project.

## Developer

**Developed by ARUL JEBARAJ M**

ShopEase — MERN Stack E-commerce Web Application.

---

Built with MongoDB, Express.js, React, and Node.js.
