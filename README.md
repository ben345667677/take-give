# 🚀 Trade & Give Marketplace - Full Stack

מערכת מרקטפלייס (לוח מודעות) מלאה עם Frontend, Backend, Database, בדיקות אוטומטיות ו-CI/CD

[![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/tests.yml)
[![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy-aws.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy-aws.yml)

## 📦 מה כלול?

### 1. Frontend (nginx) - פורט 80
- 📄 דף התחברות והרשמה מעוצב
- 🏪 דף מרקטפלייס מלא (RTL Hebrew)
- 🔍 חיפוש וסינון מתקדם
- 📱 Responsive design
- 🎨 Modern UI/UX

### 2. Backend (Node.js + Express) - פורט 3000
- 🔐 API להתחברות והרשמה
- 📦 Products API (CRUD)
- 🏷️ Categories & Subcategories API
- 🔒 JWT Authentication
- 💾 MySQL connection pooling
- 🛡️ bcrypt password hashing

### 3. Database (MySQL 8.0) - פורט 3306
- 👥 Users table
- 🏷️ Categories (8) + Subcategories (70+)
- 📦 Products with images & favorites
- 🔄 Trade offers system
- ⚡ Indexed queries & FULLTEXT search

### 4. Tests (Jest) - קונטיינר נפרד
- 🧪 18+ integration tests
- ✅ API endpoint testing
- 🤖 Automated test runs
- 📊 Coverage reports

### 5. CI/CD (GitHub Actions)
- 🔄 Auto-run tests on every push
- 🚀 Auto-deploy to AWS on PR merge
- 🐳 Docker image builds
- 📦 Deployment automation

## 🚀 הרצה מהירה

```bash
# הפעל את כל השירותים
docker-compose up -d

# חכה כ-30 שניות להתקנה ראשונית
```

**URLs:**
- 🏠 **Frontend:** http://localhost (Login Page)
- 🏪 **Marketplace:** http://localhost/menuPage/ (after login)
- 🔌 **Backend API:** http://localhost:3000/api
- 💾 **MySQL:** localhost:3306

## 🧪 הרצת בדיקות

```bash
# הרצת כל הבדיקות
docker-compose run --rm tests

# הרצה עם coverage
docker-compose run --rm tests npm run test:coverage

# הרצה עם watch mode
docker-compose run --rm tests npm run test:watch
```

📖 **מדריך מלא:** [TESTING.md](TESTING.md)

## 🧪 בדיקה ידנית

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
├── docker-compose.yml              # 4 services orchestration
├── Dockerfile                      # Frontend nginx
├── TESTING.md                      # מדריך בדיקות
│
├── .github/                        # CI/CD Workflows
│   ├── workflows/
│   │   ├── tests.yml              # Run tests on push
│   │   └── deploy-aws.yml         # Deploy to AWS on PR merge
│   ├── SETUP_SECRETS.md           # GitHub Secrets setup guide
│   └── CI_CD_GUIDE.md             # CI/CD complete guide
│
├── loginPage/                      # Login/Register UI
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── menuPage/                       # Marketplace UI
│   ├── index.html                 # Main marketplace page
│   ├── style.css                  # Modern RTL design
│   └── app.js                     # Products, categories logic
│
├── backend/                        # Backend API
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── database.js
│       ├── middleware/
│       │   └── auth.js            # JWT verification
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── categoryController.js
│       │   └── productController.js
│       └── routes/
│           ├── authRoutes.js
│           ├── categoryRoutes.js
│           └── productRoutes.js
│
├── db/                             # Database initialization
│   └── init/
│       ├── 01-create-database.sql
│       ├── 02-create-users-table.sql
│       ├── 03-insert-test-user.sql
│       ├── 04-create-categories-table.sql
│       ├── 05-create-products-table.sql
│       └── 06-insert-categories.sql
│
└── tests/                          # Integration Tests
    ├── Dockerfile                  # Tests container
    ├── package.json               # Jest configuration
    ├── README.md
    ├── helpers/
    │   └── api.js                 # API helper class
    └── integration/
        └── auth.test.js           # 18+ auth tests
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

## 🚀 CI/CD Pipeline

הפרויקט כולל 2 GitHub Actions workflows אוטומטיים:

### 1. Tests Workflow (`.github/workflows/tests.yml`)
- **טריגר:** כל push לכל branch + כל PR ל-main/develop
- **מה הוא עושה:**
  - ✅ מריץ את כל הבדיקות האוטומטיות
  - ✅ בודק שה-API עובד
  - ✅ מוודא שהקוד תקין
- **זמן ריצה:** ~2-3 דקות

### 2. Deploy Workflow (`.github/workflows/deploy-aws.yml`)
- **טריגר:** merge של PR ל-branch `main`
- **מה הוא עושה:**
  - 🐳 בונה Docker images
  - 📤 מעלה ל-Docker Hub
  - ☁️ מפרס ל-AWS EC2
  - ✅ מוודא שהפריסה הצליחה
- **זמן ריצה:** ~5-10 דקות

### הגדרת CI/CD

1. **Setup Secrets:** קרא את [.github/SETUP_SECRETS.md](.github/SETUP_SECRETS.md)
2. **מדריך CI/CD:** קרא את [.github/CI_CD_GUIDE.md](.github/CI_CD_GUIDE.md)

### דוגמת תהליך עבודה

```bash
# 1. צור feature branch
git checkout -b feature/new-feature

# 2. עשה שינויים
git add .
git commit -m "Add new feature"

# 3. Push (tests ירוצו אוטומטית)
git push origin feature/new-feature

# 4. פתח PR ל-main
gh pr create --base main

# 5. אחרי merge - deployment אוטומטי ל-AWS!
```

---

## 📚 טכנולוגיות

### Core Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Font Awesome
- **Backend:** Node.js 18, Express.js 4
- **Database:** MySQL 8.0
- **Security:** bcrypt, JWT
- **Containers:** Docker, Docker Compose

### Testing & CI/CD
- **Testing:** Jest, Axios
- **CI/CD:** GitHub Actions
- **Deployment:** AWS EC2, S3, Systems Manager

### Infrastructure
- **Web Server:** nginx
- **Process Manager:** Docker
- **Database Backup:** MySQL volumes

---

## 📖 תיעוד נוסף

- 📋 [TESTING.md](TESTING.md) - מדריך בדיקות מלא
- 🚀 [.github/CI_CD_GUIDE.md](.github/CI_CD_GUIDE.md) - מדריך CI/CD
- 🔐 [.github/SETUP_SECRETS.md](.github/SETUP_SECRETS.md) - הגדרת Secrets
- 📦 [backend/README.md](backend/README.md) - תיעוד Backend
- 🧪 [tests/README.md](tests/README.md) - תיעוד בדיקות

---

## 🎯 Features Roadmap

### ✅ מימוש מלא
- [x] מערכת אימות (Register/Login)
- [x] מערכת קטגוריות (8 קטגוריות + 70 תתי קטגוריות)
- [x] CRUD מוצרים
- [x] חיפוש וסינון מתקדם
- [x] מבנה טבלאות למועדפים וטרייד
- [x] בדיקות אוטומטיות
- [x] CI/CD pipeline

### 🔜 לפיתוח עתידי
- [ ] העלאת תמונות (S3/Cloudinary)
- [ ] מערכת מועדפים
- [ ] מערכת טרייד/החלפה
- [ ] התראות (Notifications)
- [ ] צ'אט בין משתמשים
- [ ] דירוגים וחוות דעת
- [ ] מערכת תשלומים

---

## 👥 תרומה לפרויקט

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request (tests will run automatically!)

---

## 📄 License

זהו פרויקט לימודי/דמו. ניתן לשימוש חופשי.

---

## 🙏 Credits

נבנה עם ❤️ בעזרת:
- Node.js & Express
- MySQL
- Docker
- GitHub Actions
- Claude Code AI

---

🎉 **בהצלחה עם הפרויקט!**
