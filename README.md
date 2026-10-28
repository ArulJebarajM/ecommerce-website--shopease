# ShopEase

### A Modern Full-Stack E-commerce Application Built with the MERN Stack

ShopEase is a full-stack e-commerce web application built with MongoDB, Express.js, React, and Node.js. It provides a shopping experience with product discovery, cart management, customer authentication, order processing, order tracking, email notifications, and administrative product management.

## Live Demo

- **Website:** [Visit ShopEase](https://ecommerce-website-shopease-peach.vercel.app/)
- **Backend API:** [View Backend API](https://shopease-api-bshj.onrender.com/)
- **Project Presentation:** [View ShopEase Presentation](https://1drv.ms/p/c/a9f1ba206d202072/IQCKPveyJ32sQbXoz8Q_xw8pAdDorqU3AJq4U7Q0I3fJ90c?e=aL6bal)
  

The frontend is deployed on Vercel, and the backend API is deployed on Render.

## Features

- **Product Catalog:** Browse products, search by name, filter by category, and view product details.
- **Shopping Cart:** Add or remove products, adjust quantities, and calculate subtotals.
- **Customer Authentication:** Register and log in to access account-related features.
- **Order Management:** Create orders and view order information where supported.
- **Order Tracking:** Track order progress and status updates.
- **Email Notifications:** Send order confirmations and status notifications using Nodemailer and Brevo SMTP.
- **Admin Management:** Manage products and update order statuses through supported administrative functionality.
- **Responsive Interface:** Access the storefront across different screen sizes.

> **Note:** Checkout is a demonstration workflow and does not process real payments.

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
| Git and GitHub | Version control |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## Project Structure

The following is a representative structure. Confirm the actual directory and file names in the repository.

```text
ecommerce-website--shopease/
├── client/
│   ├── public/
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

## Getting Started

### Prerequisites

Install the following:

- [Node.js (LTS)](https://nodejs.org/)
- npm, included with Node.js
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB installation

Verify your installation:

```bash
node --version
npm --version
git --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/ArulJebarajM/ecommerce-website--shopease.git
cd ecommerce-website--shopease
```

### 2. Install Dependencies

Install the backend dependencies:

```bash
cd server
npm install
```

In a separate terminal, install the frontend dependencies:

```bash
cd client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory. If `server/.env.example` is available, use it as your reference.

Configure the database, authentication, and email settings required by the application.

Typical configuration categories include:

- MongoDB connection string
- Backend port
- Authentication secret, if required
- SMTP host, port, username, and password
- Verified sender email address

**Important:** Use the exact variable names expected by the source code. Do not commit `.env` files, passwords, database credentials, or other secrets to GitHub.

### 4. Configure the Database

For MongoDB Atlas, configure your database connection string and ensure that your database user and network access settings allow the connection.

For a local MongoDB installation, make sure the database service is running.

### 5. Run the Application

Start the backend from the `server` directory:

```bash
npm run dev
```

Start the frontend from the `client` directory in a separate terminal:

```bash
npm run dev
```

Open the frontend URL displayed by Vite in your terminal. The default development URL is commonly `http://localhost:5173`.

> Check each directory's `package.json` for the actual scripts. If `dev` is not defined, use the appropriate configured script.

## API

The backend provides REST API functionality for the operations implemented in the application, including product management, authentication, and order processing.

For the exact endpoint paths, HTTP methods, request formats, and authorization requirements, refer to the backend route files in the repository.

**Live backend:** [https://shopease-api-bshj.onrender.com/](https://shopease-api-bshj.onrender.com/)

## Deployment

- **Frontend:** [Vercel deployment](https://ecommerce-website-shopease-peach.vercel.app/)
- **Backend:** [Render deployment](https://shopease-api-bshj.onrender.com/)
  

Ensure that production environment variables, database access, frontend API configuration, and CORS settings match the deployment configuration.

## Future Improvements

- Integrate a secure payment gateway.
- Improve inventory management.
- Add automated unit and integration tests.
- Enhance logging, validation, and error handling.
- Further strengthen authentication and authorization.

## Author

**Arul Jebaraj M**

- [GitHub Profile](https://github.com/ArulJebarajM)
  

---

*Built with MongoDB, Express.js, React, and Node.js.*
