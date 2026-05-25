# 🚀 Spent.io | Full-Stack Financial Ledger

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)

Spent.io is a modern, responsive personal finance application designed to help users track transactions, manage recurring subscriptions, and visualize amortized debt metrics. Built with a focus on clean code architecture and core software engineering fundamentals, it provides a seamless, secure, and data-driven approach to financial management.

## ✨ Key Features

*   **Secure Authentication:** Robust user registration and login flows utilizing `bcryptjs` for password hashing and JSON Web Tokens (JWT) for stateless session management.
*   **Dynamic Transaction Ledger:** Track inbound (income), outbound (expenses), and internal transfers with real-time filtering, searching, and CSV export capabilities.
*   **Recurring Bills & EMIs:** A dedicated workspace to monitor active subscriptions, automated billing cycles, and loan settlement progress.
*   **Data Visualization:** Interactive dashboards providing immediate insights into monthly fixed outflows and outstanding debt aggregates.
*   **User Customization:** Configurable account settings including multi-currency support (INR, USD, EUR) and budget warning triggers.
*   **Modern UI/UX:** A fully responsive, mobile-first design leveraging Tailwind CSS, featuring glassmorphism elements, dark mode optimization, and fluid animations.

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **Framework:** React.js (Vite)
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS
*   **Icons & Assets:** Lucide React
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **Notifications:** React Toastify

### Backend (Server)
*   **Environment:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Security:** JWT (Authentication), bcryptjs (Cryptography)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
*   Node.js (v16 or higher)
*   MongoDB (Local installation or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone [https://github.com/Parshant-12/spent-io.git]
cd spent-io
```
### 2. Backend Setup
```bash
cd server
npm install
```
### Create a .env file in the server directory and add the following variables:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
### Start the backend server:
```bash
cd client
npm install
```
### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
## 4. Project Structure
spent-io/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Settings, Login, etc.)
│   │   ├── Layouts/        # Wrappers (Modals, Loaders)
│   │   ├── App.jsx         # Main routing
│   │   └── main.jsx        # Entry point
│   └── tailwind.config.js  # Tailwind theme configuration
│
└── server/                 # Express Backend
    ├── Models/             # Mongoose schemas (User, Transaction, Loan)
    ├── routes/             # API endpoints (Auth, Settings, Transactions)
    ├── middleware/         # Custom middleware (fetchUser auth validation)
    └── index.js            # Server entry point

## 💡 Engineering Highlights
* Optimized Payload Management: Implemented conditional backend updates (e.g., optional password changes) to reduce unnecessary database writes and enhance security.

* State Protection: Engineered strict React state handling (e.g., preventing double-submissions and infinite re-render loops via disabled UI states and loading booleans).

* Scalable Component Design: Built isolated, modular React components to ensure code maintainability and readability for future feature expansions.

## 🔮 Future Roadmap
* Deploy backend to Render/AWS and frontend to Vercel.

* Implement hybrid mobile conversion using Capacitor.js for offline-first capabilities.

* Integrate AI-driven expense categorization and forecasting.

* Designed and developed by Parshant :)