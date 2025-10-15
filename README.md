# 🚀 Login System - Full Stack

מערכת התחברות והרשמה מלאה עם Frontend, Backend ו-Database

## 📦 מה כלול?

### 1. Frontend (nginx) - פורט 8080
- דף התחברות והרשמה
- שליחת בקשות API בפורמט JSON
- שמירת Token ב-localStorage

### 2. Backend (Node.js + Express) - פורט 3000
- API להתחברות והרשמה
- הצפנת סיסמאות עם bcrypt
- יצירת JWT tokens
- חיבור ל-MySQL

### 3. Database (MySQL 8.0) - פורט 3306
- טבלת משתמשים
- אתחול אוטומטי עם סקריפטים

## 🚀 הרצה מהירה

```bash
docker-compose up -d
```

**Frontend:** http://localhost:8080
**Backend API:** http://localhost:3000/api
**MySQL:** localhost:3306

## 🧪 בדיקה

### משתמש לבדיקה:
- Email: `test@test.com`
- Password: `123456`

### בדיקת Backend:
```bash
# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"new@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 🗄️ טבלת users

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
)
```

## 📡 API Endpoints

### POST /api/auth/register
```json
Request:
{
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
}

Response:
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com"
    }
}
```

### POST /api/auth/login
```json
Request:
{
    "email": "user@example.com",
    "password": "password123"
}

Response:
{
    "success": true,
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com"
    }
}
```

## 🔌 חיבור ל-Database

### מהמחשב:
```bash
mysql -h 127.0.0.1 -P 3306 -u appuser -p
# Password: apppassword
```

### מבפנים (Docker network):
```
Host: db
Port: 3306
Database: loginapp
User: appuser
Password: apppassword
```

## 📁 מבנה הפרויקט

```
.
├── docker-compose.yml          # הגדרות 3 קונטיינרים
├── Dockerfile                  # Frontend (nginx)
├── .dockerignore
│
├── loginPage/                  # Frontend
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── app.js                  # API calls
│
├── backend/                    # Backend API
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js           # Main server
│       ├── config/
│       │   └── database.js     # MySQL connection
│       ├── controllers/
│       │   └── authController.js  # Login/Register logic
│       └── routes/
│           └── authRoutes.js   # API routes
│
└── db/                         # Database
    └── init/
        ├── 01-create-database.sql
        ├── 02-create-users-table.sql
        └── 03-insert-test-user.sql
```

## ⚙️ הגדרות

### שינוי פורטים
ערוך `docker-compose.yml`:
```yaml
ports:
  - "8080:80"   # Frontend
  - "3000:3000" # Backend
  - "3306:3306" # MySQL
```

### שינוי סיסמאות MySQL
ערוך `docker-compose.yml` ו-`backend/.env`:
```yaml
MYSQL_ROOT_PASSWORD: your-password
MYSQL_PASSWORD: your-app-password
```

### שינוי JWT Secret
ערוך `backend/.env`:
```
JWT_SECRET=your-super-secret-key-here
```

## 🛑 עצירה

```bash
# עצירה רגילה
docker-compose down

# מחיקה מלאה כולל נתונים
docker-compose down -v
```

## 🔍 Logs

```bash
# כל הקונטיינרים
docker-compose logs -f

# Backend בלבד
docker-compose logs -f backend

# Database בלבד
docker-compose logs -f db
```

## 🐛 פתרון בעיות

### Backend לא מתחבר ל-DB
```bash
# בדוק שה-DB פועל
docker-compose ps

# בדוק logs
docker-compose logs db
```

### Frontend לא מקבל תשובה
1. בדוק שה-Backend פועל: `curl http://localhost:3000/api/health`
2. בדוק CORS ב-Backend
3. פתח Console בדפדפן (F12)

### כניסה ל-Container
```bash
# Backend
docker exec -it login-backend sh

# Database
docker exec -it login-db mysql -u appuser -papppassword loginapp
```

## 🔒 אבטחה

⚠️ **חשוב לפרודקשן:**
- שנה את `JWT_SECRET` בקובץ `.env`
- שנה את סיסמאות MySQL
- השתמש ב-HTTPS
- הוסף rate limiting
- הוסף input validation
- אל תשתמש בסיסמה `123456` אמיתית!

## 📚 טכנולוגיות

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MySQL 8.0
- **Security:** bcrypt, JWT
- **Container:** Docker, Docker Compose

זהו! 🎉
