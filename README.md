# Authentication System

A secure Node.js and Express authentication system built with MongoDB. This project demonstrates modern authentication practices using **JWT**, **Access Tokens**, **Refresh Tokens**, **Sessions**, and **Cookies**.

## 🚀 Features

* User Registration
* User Login
* Secure Password Hashing with bcrypt
* JWT Authentication
* Access Token for protected routes
* Refresh Token for renewing sessions
* Token storage using HTTP-only Cookies
* Session Management
* Protected API Routes
* MongoDB Database Integration
* Express Middleware Structure
* Environment Variable Configuration with dotenv

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Cookie Parser
* Express Session
* dotenv

## 📁 Project Structure

```text
Authentication-System/
│── server.js
│── package.json
│── .env
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── app.js
```

## ⚙️ Installation

```bash
git clone <your-repository-url>
cd Authentication-System
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_SECRET=your_refresh_secret
SESSION_SECRET=your_session_secret
```

## ▶️ Run Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## 🔒 Authentication Flow

1. User registers with email and password
2. Password is hashed before saving to database
3. User logs in successfully
4. Server generates:

   * Access Token
   * Refresh Token
5. Tokens are stored securely in cookies/session
6. Access Token is used to access protected routes
7. Refresh Token generates a new Access Token when expired
8. User can logout and clear session/cookies

## 📌 API Endpoints (Example)

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/refresh-token`
* `POST /api/auth/logout`
* `GET /api/user/profile`

## 📈 Future Improvements

* Email Verification
* Forgot Password
* Role Based Authorization
* OTP Login
* Rate Limiting
* Docker Support
* Unit Testing

## 👨‍💻 Author

Brijesh Bhatt

## 📄 License

ISC
