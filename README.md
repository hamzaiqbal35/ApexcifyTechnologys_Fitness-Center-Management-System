
<div align="center">
  <img src="./client/public/logo.png" alt="FitTrack Logo" width="120" />
  <h1>FitTrack</h1>
  <h3>The Ultimate Fitness Center Management System</h3>

  <p>
    <b>Manage. Train. Transform.</b> <br />
    A comprehensive, role-based platform designed to streamline gym operations, empower trainers, and engage members.
  </p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge" alt="Version" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/status-active-success.svg?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg?style=for-the-badge" alt="Node" />
  </p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-contributors">Contributors</a>
  </p>
</div>

<br />

---

## 🚀 Overview

**FitTrack** is a state-of-the-art web application engineered to modernize fitness center management. It bridges the gap between administration, training staff, and members through three distinct, intuitive dashboards. Whether it's scheduling a high-intensity interval training class, tracking monthly revenue, or logging a personal best, FitTrack makes it seamless.

## 🌟 Key Features

### 🏛️ **For Administrators**
> *Complete control over your fitness empire.*
- **Dashboard Analytics**: Real-time overview of active members, revenue, and class attendance.
- **User Management**: Onboard and manage Trainers and Members with ease.
- **Financial Hub**: Monitor subscription payments and generate billing reports.
- **Class Scheduling**: Create recurring schedules and manage facility capacity.

### 💪 **For Trainers**
> *Tools to forge champions.*
- **My Classes**: View upcoming schedules and manage class rosters.
- **Member Progress**: Track assignee progress, update stats, and provide feedback.
- **Attendance**: Quick QR-code or manual check-ins for classes.
- **Plan Creator**: Design custom workout routines and diet plans for clients.

### 🏃 **For Members**
> *Your fitness journey, simplified.*
- **Personal Dashboard**: Track daily activities, upcoming classes, and subscription status.
- **Easy Booking**: One-click registration for classes.
- **Workout & Diet**: Access personalized plans assigned by trainers.
- **Progress Tracking**: Visualize weight, BMI, and other metric improvements over time.

---

## 🛠️ Tech Stack

This project leverages the **MERN** stack for a robust, scalable, and full-stack JavaScript experience.

### **Frontend**
| Tech | Description |
| :--- | :--- |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black) | **React.js (Vite)** | Component-based UI library for high performance. |
| ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| ![ContextAPI](https://img.shields.io/badge/-Context_API-blue?style=flat) | **Context API** | Native state management for auth and user data. |

### **Backend**
| Tech | Description |
| :--- | :--- |
| ![Node](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white) | **Node.js** | Scalable Javascript runtime environment. |
| ![Express](https://img.shields.io/badge/-Express.js-000000?style=flat&logo=express&logoColor=white) | **Express.js** | Minimalist web framework for API routing. |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | **MongoDB** | NoSQL database for flexible data storage. |

### **Tools & Services**
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **Payments**: Stripe API Integration
- **File Storage**: Cloudinary / Multer
- **Email**: Nodemailer (SMTP)

---

## 📂 Architecture

A clean, modular structure ensures maintainability and scalability.

```bash
FitTrack/
├── 📁 client/                 # React Frontend Application
│   ├── 📂 public/             # Static assets (favicons, logos)
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable atomic UI components
│   │   ├── 📂 contexts/       # Global State (Auth, Theme)
│   │   ├── 📂 pages/          # Page-level components / Routes
│   │   └── 📂 services/       # API integration helpers
│
├── 📁 server/                 # Node.js Backend API
│   ├── 📂 src/
│   │   ├── 📂 controllers/    # Business logic & request handling
│   │   ├── 📂 models/         # Mongoose Data Schemas
│   │   ├── 📂 routes/         # API Endpoint definitions
│   │   └── 📂 middleware/     # Security & Validation (Auth, RBAC)
│
└── 📄 README.md               # Project Documentation
```

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas URI)
- **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/hamzaiqbal35/ApexcifyTechnologys_Fitness-Center-Management-System.git
    cd FitTrack
    ```

2.  **Server Setup**
    Navigate to the server directory and install dependencies.
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in `server/` with the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    # ... see server/README.md for full list
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Client Setup**
    Navigate to the client directory (open a new terminal).
    ```bash
    cd client
    npm install
    ```
    Create a `.env` file in `client/` with the following:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    Start the frontend:
    ```bash
    npm run dev
    ```

4.  **Launch**
    Visit `http://localhost:5173` in your browser.

---

## 📞 Contact

**Hamza Iqbal**

- 🐙 GitHub: [@hamzaiqbal35](https://github.com/hamzaiqbal35)
- 📧 Email: hamzaiqbalrajpoot35@gmail.com

---

<div align="center">
  <p>Made with ❤️ by Hamza Iqbal</p>
  <sub>&copy; 2025 FitTrack. All rights reserved.</sub>
</div>
