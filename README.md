A full-stack real-time fraud detection and inventory management system with a beautiful analytics dashboard, built using **Node.js (Express + Prisma + PostgreSQL)** on the backend and **Next.js (TypeScript + Tailwind CSS + Socket.IO)** on the frontend. Inspired by **Clean Code** and **Domain-Driven Design (DDD)**.

---

## 📦 Tech Stack Overview

### 🔧 Backend
- **Node.js**, **Express.js**
- **Prisma ORM** with **PostgreSQL**
- **Domain-Driven Design** structure
- **Fraud Detection Algorithms**
- **Real-time Alerts** via Socket.IO

### 🖥️ Frontend
- **Next.js** with **TypeScript**
- **Tailwind CSS** + **Material UI**
- **React Charts** for sales analytics
- **Socket.IO client** for real-time updates
- **CSV/PDF export**, modals, filtering

---

## ⚙️ Installation & Setup Instructions

### 1. Backend (Express + Prisma + PostgreSQL)

#### 📁 Clone the backend repo

git clone <backend-repo-url>
cd backend
npm install

#### 📁 Create .env file

DATABASE_URL=postgresql://postgres:<password>@localhost:5432/techmart
PORT=5000

#### 🔄 Generate Prisma Client & Run Migrations

npx prisma generate
npx prisma migrate dev --name init

#### 🌱 Seed the database

1. Create a data folder and add your JSON files.
2. Implement prisma/seed.ts to import the data.
   npx prisma db seed
   
#### ▶️ Start the server

npm run dev

#### ▶️ You can access database (UI) via prisma studio as well:

npx prisma studio

### 2. Frontend (Next.js)

### 📁 Clone the frontend repo

git clone <frontend-repo-url>
cd frontend/techmart

### 📦 Install dependencies

npm install

### ⚙️ Configure Environment

Create .env.local and enter:

   NEXT_PUBLIC_API_URL=http://localhost:PORT
   
### ▶️ Start the frontend

npm run dev

Open browser at: http://localhost:PORT
