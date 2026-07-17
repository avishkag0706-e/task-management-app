# 📝 Task Management Application

A full-stack Task Management Application that allows users to create an account, log in securely, and manage their personal tasks. The application uses JWT authentication to protect user data and stores all tasks in MongoDB.



## 📌 Features

- 👤 User Registration
- 🔐 Secure Login with JWT Authentication
- ➕ Add New Tasks
- 📋 View Personal Tasks
- 🗑️ Delete Tasks
- 💾 MongoDB Database Integration
- 🌐 RESTful API
- 📱 Responsive User Interface

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcryptjs

### Deployment
- Vercel (Frontend)
- Render (Backend)

### Version Control
- Git
- GitHub

---

## 📂 Project Structure

```
task-management-app/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/avishkag0706-e/task-management-app.git
```

### 2. Navigate to the Project

```bash
cd task-management-app
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Create a `.env` File

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the Backend

```bash
node server.js
```

### 6. Open the Frontend

Open the `frontend/index.html` file in your browser or serve it using Live Server.



## 🔮 Future Improvements

- ✏️ Edit Tasks
- ✅ Mark Tasks as Completed
- 📅 Due Dates
- 🔍 Search Tasks
- 🌙 Dark Mode
- ⭐ Task Priority
- 👤 User Profile
- 📱 Better Mobile UI

---

## 👨‍💻 Author

**Avishka Gaikwad
