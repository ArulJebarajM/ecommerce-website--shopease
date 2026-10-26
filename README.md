# ShopEase

**A Modern Full-Stack E-commerce Web Application Built with the MERN Stack**

ShopEase is a full-stack e-commerce application built using MongoDB, Express.js, React, and Node.js. It provides a modern shopping interface with product discovery, cart management, customer accounts, order handling, order tracking, email notifications, and administrative product management.

## Live Demo

- **Website:** https://ecommerce-website-shopease-peach.vercel.app
- **Backend API:** https://shopease-api-bshj.onrender.com

The frontend is hosted on Vercel, and the backend API is hosted on Render.

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

---

## Overview

ShopEase combines a React-based storefront with an Express REST API and MongoDB database.

The project is organized into two main applications:

- **Client:** React frontend powered by Vite.
- **Server:** Node.js and Express backend connected to MongoDB using Mongoose.

The application supports product browsing, cart operations, customer accounts, order creation, order status tracking, email notifications, and administrative product management.

## Features

### 1. Product Catalog

- Browse available products.
- Search products by name.
- Filter products by category.
- View product details.
- Display product images and prices.

### 2. Shopping Cart

- Add products to the cart.
- Increase or decrease item quantities.
- Remove products from the cart.
- Calculate the subtotal based on product quantities and prices.

### 3. Customer Accounts

- Customer registration.
- Customer login.
- Access authentication-dependent functionality.

### 4. Orders and Checkout

- Submit orders through the backend.
- Store order information in MongoDB.
- Generate an order number.
- View order information and order history where supported by the application.
- Support a demonstration checkout workflow.

### 5. Order Tracking

- Track order status.
- Record order status changes in the order's status history.
- Store timestamps for status updates.
- Display order progress where the tracking interface is implemented.

Order history entries help record the order's progress from placement through subsequent status changes.

### 6. Email Notifications

ShopEase includes email notifications using **Nodemailer and Brevo SMTP**.

- **Order confirmation email:** Sent after an order is created.
- **Order status update email:** Sent when an administrator changes an order's status.
- **SMTP configuration:** Uses environment variables to keep email credentials outside the source code.
- **Error handling:** Email sending failures are handled separately so an email failure does not automatically undo a saved order or status change.

Email delivery requires valid SMTP credentials and a verified sender address.

### 7. Admin Product Management

- Create products.
- Update product information.
- Delete products.
- Manage products through administrative API endpoints.
- Update order statuses where supported by the admin functionality.

### 8. Additional Features

- Responsive storefront interface.
- REST API architecture.
- MongoDB and Mongoose integration.
- Sample product seeding, if configured in the backend.
- Product images stored in the frontend's public assets, where included.

> **Note:** Checkout is a demonstration flow and does not process real payments.

---

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
| Nodemailer | Email notifications |
| Brevo SMTP | Email delivery |
| npm | Package management |
| Git and GitHub | Version control |
| Vercel | Frontend hosting |
| Render | Backend hosting |

---

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
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── scripts/
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

*This is a representative structure. Some folders or filenames may differ in the current repository.*

---

## Prerequisites

Install the following software:

- [Node.js](https://nodejs.org/) — preferably an LTS release.
- npm — included with Node.js.
- [MongoDB](https://www.mongodb.com/) — local installation or MongoDB Atlas.
- [Git](https://git-scm.com/).

Verify your installations:

```bash
node --version
npm --version
git --version
```

---

## Getting Started

### 1. Clone the Repository

Replace `YOUR_REPOSITORY_URL` with your GitHub repository URL.

```bash
git clone YOUR_REPOSITORY_URL
cd shopease-mern-ecommerce
```

If you already have the project on your computer, open the existing project folder instead.

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

Open a second terminal from the project root:

```bash
cd client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory.

If `server/.env.example` exists, use it as a starting point. Make sure the variable names match those used by the backend.

Example configuration:

```dotenv
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_login
SMTP_PASS=your_smtp_key
EMAIL_FROM=your_verified_sender_email
```

**Configuration notes:**

- `PORT` specifies the backend port.
- `MONGODB_URI` contains your MongoDB connection string.
- `JWT_SECRET` is used for authentication token signing if required by the application.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` configure the SMTP connection.
- `EMAIL_FROM` specifies the sender address configured for email delivery.

Use your own credentials. Do not copy real secrets into this README or commit your `.env` file to GitHub.

### 5. Configure MongoDB

For a local MongoDB installation, ensure the database service is running.

For MongoDB Atlas, configure your connection string and confirm that your database user and network access settings permit the connection.

### 6. Seed Sample Products

If the backend has a seed script configured in `server/package.json`, run the appropriate command from the `server` directory.

For example, if the script is named `seed`:

```bash
npm run seed
```

Check `server/package.json` for the actual script name before running it.

### 7. Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend may run at:

```text
http://localhost:5000
```

The actual port depends on your environment configuration.

### 8. Start the Frontend

From the `client` directory in a separate terminal:

```bash
npm run dev
```

Vite will display the local frontend URL, commonly:

```text
http://localhost:5173
```

Open the URL shown in your terminal.

**Keep both the backend and frontend development servers running while using the local application.**

---

## Environment Configuration

The backend configuration may include the following variables:

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Authentication secret, if required |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port |
| `SMTP_SECURE` | Whether to use a secure SMTP connection |
| `SMTP_USER` | SMTP login username |
| `SMTP_PASS` | SMTP password or provider key |
| `EMAIL_FROM` | Verified sender email address |

The exact variables depend on the backend source code. Keep `server/.env.example` updated when configuration requirements change, using placeholders rather than real credentials.

---

## Running the Application

To run ShopEase locally:

1. Start MongoDB or confirm your Atlas database is accessible.
2. Start the backend from the `server` directory.
3. Start the frontend from the `client` directory in another terminal.
4. Open the local frontend URL provided by Vite.
5. Verify that products load and that the backend can connect to MongoDB.
6. Configure SMTP if you want to test email notifications.

---

## Using ShopEase

1. Open the ShopEase website.
2. Browse products or search by name.
3. Filter products by category.
4. Open product details.
5. Add products to the shopping cart.
6. Adjust quantities and review the subtotal.
7. Complete the demonstration checkout.
8. View order information and track status where available.
9. Check the order confirmation email if email delivery is configured.
10. Use authorized administrative functionality to manage products and update order statuses.
11. Check the status update email after changing an order's status.

Some features require authentication or administrative permissions.

---

## Demo Accounts

Use the following account identifiers for local testing only if the accounts exist in your configured database and are supported by the current authentication implementation.

### Customer Account

| Field | Value |
|---|---|
| Name | AKASH |
| Email | `aka@gmail.com` |
| Password | Configure locally |

### Administrator Account

| Field | Value |
|---|---|
| Email | `admin@shopease.local` |
| Password | Configure locally |

These details do not guarantee that the accounts exist or that login will succeed. Configure or create accounts using the application's supported authentication flow.

**Security:** Do not publish account passwords in a public README. Never share real passwords, authentication secrets, or SMTP credentials.

---

## API Reference

The backend exposes REST API endpoints for supported application operations.

The following is an overview of common endpoint patterns. Check the route files in `server/src/routes/` for the exact paths, HTTP methods, request formats, and authorization requirements.

| Operation | Purpose |
|---|---|
| Product endpoints | Retrieve and manage product data |
| Customer authentication endpoints | Register or log in customers |
| Order endpoints | Create and retrieve supported order information |
| Admin product endpoints | Create, update, and delete products |
| Admin order endpoints | Update order statuses where implemented |

### Example API Request

Retrieve the product catalog from a locally running backend:

```bash
curl http://localhost:5000/api/products
```

The actual response depends on the backend implementation.

Administrative endpoints should enforce server-side authorization. Do not rely on frontend-only restrictions to protect sensitive operations.

---

## Security

Before using the application beyond demonstration purposes:

- Keep database credentials and secrets in environment variables.
- Hash customer passwords securely.
- Enforce authentication and role-based authorization on the server.
- Validate incoming request data.
- Verify order ownership before returning private order information.
- Calculate order totals on the server.
- Configure CORS and rate limiting appropriately.
- Use HTTPS in deployed environments.
- Protect administrative endpoints.
- Review error handling and application logs.
- Test email notification behavior without exposing SMTP credentials.

**ShopEase's demonstration checkout must not be used to accept real payments.** A payment provider and appropriate security measures are needed for real transactions.

---

## Troubleshooting

### Backend Cannot Connect to MongoDB

- Check `MONGODB_URI` in `server/.env`.
- Ensure MongoDB is running or Atlas is accessible.
- Verify the database user's permissions and connection settings.

### Frontend Cannot Load Products

- Confirm that the backend is running.
- Check the API URL configured in the frontend.
- Inspect the browser console and backend terminal for errors.

### Email Notifications Do Not Arrive

- Verify the SMTP host, port, username, and password.
- Confirm that the sender address is verified with your email provider.
- Check backend logs for email errors.
- Check the recipient's spam or junk folder.

### `npm run dev` Does Not Work

- Run `npm install` in the relevant `client` or `server` directory.
- Check the `scripts` section in that directory's `package.json`.
- Confirm that Node.js and npm are installed.

### Demo Login Fails

- Confirm that the account exists in the database.
- Verify the configured authentication settings.
- Use the correct login flow supported by the application.
- Never share passwords or secret values when asking for help.

---

## Future Improvements

- Payment gateway integration.
- Improved inventory management.
- Persistent wishlist and shopping cart.
- Enhanced customer order history.
- Automated unit and integration tests.
- Improved logging and error handling.
- Additional security improvements.

---

## License

No license is specified in this README. Add a `LICENSE` file if you want to grant others permission to use, modify, or redistribute the project.

---

## Developer

**Developed by ARUL JEBARAJ M**

ShopEase — MERN Stack E-commerce Web Application.

---

Built with MongoDB, Express.js, React, and Node.js.
