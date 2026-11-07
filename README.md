# Prisma Nest Ecommerce Dashboard

A full-stack e-commerce management dashboard built with **NestJS, Prisma, PostgreSQL, React, and TypeScript**.

The application provides role-based access control (PBAC), secure authentication, and tools for managing essential e-commerce operations.

## 🚀 Tech Stack

### Backend
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** Aiven PostgreSQL
- **Authentication & PBAC:** Better Auth
- **Caching:** Redis

### Frontend
- **Library:** React
- **Language:** TypeScript
- **API Data Fetching & State Management:** RTK Query
- **Routing:** React Router

## ✨ Features

- Secure authentication with Better Auth
- Permission-Based Access Control (PBAC)
- Role-based dashboard access
- Product and category management
- Order management
- Customer management
- Employee management
- Supplier management
- Session management
- Role request and approval workflow
- API caching with Redis

## 👥 User Roles

The application supports the following roles:

- Super Admin
- Admin
- Manager
- Sales
- Accountant
- Inventory Manager
- Viewer

Access to application features is controlled through permissions rather than role names alone.

## 🏗️ Architecture

The application follows a separate frontend and backend architecture:

```text
Frontend (React + TypeScript)
          |
          | RTK Query
          |
          v
Backend (NestJS)
          |
          | Prisma ORM
          |
          v
Aiven PostgreSQL
          |
          v
Redis Cache
```

Better Auth handles authentication and permission-based access control.

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Redis

### Backend Setup

```bash
git clone https://gitlab.com/sudoCodeCloud/prisma-nest-ecommerce-api.git
cd prisma-nest-ecommerce-api

npm install
```

Configure your environment variables in a `.env` file, then run:

```bash
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

### Frontend Setup

```bash
git clone https://gitlab.com/sudoCodeCloud/prisma-nest-ecommerce-dashboard.git
cd prisma-nest-ecommerce-dashboard

npm install
npm run dev
```

Configure the backend API URL in the frontend environment variables.

🌐 Live Demo

Live Application: https://prisma-nest-ecommerce-dashboard.onrender.com/

## 🌐 Deployment

- **Backend:** Render
- **Database:** Aiven PostgreSQL
- **Frontend:** Vercel

## 📌 Project Status

This project is actively under development.

## 📄 License

This project is developed for learning and portfolio purposes.