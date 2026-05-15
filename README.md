📖 About The Project
This is a RESTful API backend for a social media platform, built with Node.js and Express.js. It provides complete functionality for user management, posts, comments, likes, follows, and real-time notifications.

The project implements advanced Express.js concepts including:

✅ Modular Routing (Domain-Driven Design)

✅ Custom Middleware (Correlation ID, Structured Logging)

✅ Rate Limiting (3 levels: login, posts, likes)

✅ Centralized Error Handling (4-parameter middleware)

✅ Security Headers (Helmet.js + CORS)

✅ Structured Logging (JSON format with Winston)

✅ Redis Caching & Rate Limiting

✨ Features
👤 Authentication & Users
User registration & login with JWT

Profile management (update, delete)

Follow / Unfollow users

View followers & following lists

📝 Posts
Create, read, update, delete posts

Like / Unlike posts

Share posts

Public / Private post visibility

💬 Comments
Add comments on posts

Edit & delete comments

Nested replies

🔔 Notifications
Real-time notifications for likes, comments, and follows

Mark notifications as read

🛡️ Security
Password hashing (bcryptjs)

JWT authentication

Rate limiting (prevents brute force & spam)

Helmet.js security headers

CORS configuration

📊 Logging & Monitoring
Correlation ID for request tracking

Ingress/Egress logging (request/response)

JSON structured logs

Separate error log file

🛠️ Tech Stack
Category	Technologies
Backend	Node.js, Express.js
Database	MongoDB Atlas (Cloud)
Caching	Redis Cloud
Authentication	JWT, bcryptjs
Logging	Winston (JSON format)
Security	Helmet.js, CORS, express-rate-limit
Development	Nodemon, dotenv
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account (free tier)

Redis Cloud account (free tier)

Installation
Clone the repository

bash
git clone https://github.com/hebashalayel/social-media-backend.git
cd social-media-backend
Install dependencies

bash
npm install
Configure environment variables

Create a .env file in the root directory:

env
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/social_db

# Redis Cloud
REDIS_URL=redis://default:<password>@redis-xxxxx.cloud.redislabs.com:xxxxx

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
Start the server

bash
npm run dev
You should see:

text
✅ MongoDB Connected
✅ Redis Connected
🚀 Server running on port 3000
📚 API Documentation
🔐 Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Create new account
POST	/api/auth/login	Login with email/username & password
GET	/api/auth/me	Get current user profile
PUT	/api/auth/updatedetails	Update user details
PUT	/api/auth/changepassword	Change password
📝 Post Endpoints
Method	Endpoint	Description
POST	/api/posts	Create new post
GET	/api/posts	Get all posts (paginated)
GET	/api/posts/:id	Get single post
PUT	/api/posts/:id	Update post
DELETE	/api/posts/:id	Delete post
POST	/api/posts/:id/like	Like/unlike a post
POST	/api/posts/:id/share	Share a post
💬 Comment Endpoints
Method	Endpoint	Description
POST	/api/comments/:postId	Add comment to post
PUT	/api/comments/:id	Update comment
DELETE	/api/comments/:id	Delete comment
👥 Follow Endpoints
Method	Endpoint	Description
POST	/api/follow/:userId	Follow a user
DELETE	/api/follow/:userId	Unfollow a user
GET	/api/follow/following	Get users I follow
GET	/api/follow/followers	Get my followers
🛡️ Rate Limiting
Endpoint	Limit	Window
/api/auth/login	5 attempts	15 minutes
/api/auth/register	3 attempts	1 hour
POST /api/posts	50 posts	1 hour
POST /api/posts/:id/like	100 likes	10 minutes
📂 Project Structure
text
social-media-backend/
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Request validation
│   ├── correlationId.js     # Request tracking
│   ├── requestLogger.js     # Structured logging
│   ├── rateLimiter.js       # Rate limiting
│   └── errorHandler.js      # Centralized error handler
├── routes/
│   ├── auth.js
│   ├── posts.js
│   ├── comments.js
│   ├── follow.js
│   └── notifications.js
├── controllers/
├── models/
├── config/
│   └── database.js
├── logs/                    # Winston log files
├── server.js
└── .env
📊 Logging Example
All logs are stored in JSON format in the logs/ directory:

Ingress Log (Request Entry):

json
{
  "level": "info",
  "type": "INGRESS",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/api/posts",
  "ip": "::ffff:127.0.0.1",
  "timestamp": "2026-05-15T10:00:00Z"
}
Egress Log (Response Exit):

json
{
  "level": "info",
  "type": "EGRESS",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "statusCode": 201,
  "responseTime": "45ms",
  "timestamp": "2026-05-15T10:00:00Z"
}
