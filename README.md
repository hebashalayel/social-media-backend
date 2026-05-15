# 🚀 Social Media RESTful API Backend

This is a RESTful API backend for a social media platform, built with Node.js and Express.js. It provides complete functionality for user management, posts, comments, likes, follows, and real-time notifications.

The project implements advanced Express.js concepts including:
* ✅ Modular Routing (Domain-Driven Design)
* ✅ Custom Middleware (Correlation ID, Structured Logging)
* ✅ Rate Limiting (3 levels: login, posts, likes)
* ✅ Centralized Error Handling (4-parameter middleware)
* ✅ Security Headers (Helmet.js + CORS)
* ✅ Structured Logging (JSON format with Winston)
* ✅ Redis Caching & Rate Limiting

---

## ✨ Features

### 👤 Authentication & Users
* User registration & login with JWT
* Profile management (update, delete)
* Follow / Unfollow users
* View followers & following lists

### 📝 Posts
* Create, read, update, delete posts
* Like / Unlike posts
* Share posts
* Public / Private post visibility

### 💬 Comments
* Add comments on posts
* Edit & delete comments
* Nested replies

### 🔔 Notifications
* Real-time notifications for likes, comments, and follows
* Mark notifications as read

### 🛡️ Security
* Password hashing (bcryptjs)
* JWT authentication
* Rate limiting (prevents brute force & spam)
* Helmet.js security headers
* CORS configuration

### 📊 Logging & Monitoring
* Correlation ID for request tracking
* Ingress/Egress logging (request/response)
* JSON structured logs
* Separate error log file

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **Caching** | Redis Cloud |
| **Authentication** | JWT, bcryptjs |
| **Logging** | Winston (JSON format) |
| **Security** | Helmet.js, CORS, express-rate-limit |
| **Development** | Nodemon, dotenv |

---

## 📚 API Documentation

### 🔐 Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login with email/username & password |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/updatedetails` | Update user details |
| PUT | `/api/auth/changepassword` | Change password |

### 📝 Post Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/posts` | Create new post |
| GET | `/api/posts` | Get all posts (paginated) |
| GET | `/api/posts/:id` | Get single post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like/unlike a post |
| POST | `/api/posts/:id/share` | Share a post |

### 💬 Comment Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/comments/:postId` | Add comment to post |
| PUT | `/api/comments/:id` | Update comment |
| DELETE | `/api/comments/:id` | Delete comment |

### 👥 Follow Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/follow/:userId` | Follow a user |
| DELETE | `/api/follow/:userId` | Unfollow a user |
| GET | `/api/follow/following` | Get users I follow |
| GET | `/api/follow/followers` | Get my followers |

### 🛡️ Rate Limiting Rules
| Endpoint | Limit | Window |
| :--- | :--- | :--- |
| `/api/auth/login` | 5 attempts | 15 minutes |
| `/api/auth/register` | 3 attempts | 1 hour |
| `POST /api/posts` | 50 posts | 1 hour |
| `POST /api/posts/:id/like` | 100 likes | 10 minutes |

---
## 📂 Project Structure

```text
social-media-backend/
├── config/
│   ├── database.js
│   └── validateEnv.js
├── controllers/
│   ├── authController.js
│   ├── commentController.js
│   ├── followController.js
│   ├── notificationController.js
│   └── postController.js
├── logs/
│   ├── combined.log
│   ├── error.log
│   └── errors.log
├── middleware/
│   ├── auth.js
│   ├── correlationId.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   ├── requestLogger.js
│   └── validation.js
├── models/
│   ├── Comment.js
│   ├── Follow.js
│   ├── Like.js
│   ├── Notification.js
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── comments.js
│   ├── follow.js
│   ├── index.js
│   ├── notifications.js
│   └── posts.js
├── tests/
├── .dockerignore
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
└── server.js
