# FitTrack Server

The backend API for the FitTrack application, built with Node.js, Express, and MongoDB.

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
MONGO_URI=mongodb://localhost:27017/fittrack  # Or your MongoDB Atlas URI
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key
QR_TOKEN_EXPIRY_MINUTES=30

# Client URLs (for CORS and Redirects)
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Business Logic
BOOKING_CANCELLATION_HOURS=2
```

## 🚀 Scripts

- `npm run dev`: Starts the server in development mode with Nodemon.
- `npm start`: Starts the server in production mode.
- `npm run seed`: Seeds the database with initial data (Admin, Trainers, Plans).

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Log in and receive a JWT.
- `GET /me`: Get current user profile.

### Users (`/api/users`)
- `GET /`: Get all users (Admin only).
- `GET /:id`: Get user details.
- `PUT /profile`: Update profile.

### Classes (`/api/classes`)
- `GET /`: List all classes.
- `POST /`: Create a class (Admin/Trainer).
- `POST /:id/book`: Book a class.

### Membership Plans (`/api/subscription-plans`)
- `GET /`: List all plans.
- `POST /`: Create a plan (Admin only).

### Payments (`/api/payments`)
- `POST /create-checkout-session`: Initiate Stripe checkout.
- `POST /webhook`: Handle Stripe webhooks.

### Contact (`/api/contact`)
- `POST /`: Submit a contact form (Public).

## 📂 Database Models

- **User**: Stores member, trainer, and admin profiles.
- **Class**: Class schedules, capacity, and assigned trainer.
- **Booking**: Records of user class enrollments.
- **SubscriptionPlan**: Defines membership tiers and pricing.
- **Subscription**: Tracks active user memberships and payment status.
- **Contact**: Stores "Contact Us" form submissions.
- **Notification**: User notifications.

## 🔒 Security

- **JWT Authentication**: Secured routes require a valid Bearer token.
- **Role-Based Middleware**: Specific routes are protected by `authorize('admin')` or `authorize('trainer', 'admin')`.
- **Password Hashing**: Bcrypt is used for password security.
