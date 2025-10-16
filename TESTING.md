# 🧪 מדריך הרצת בדיקות - Testing Guide

## 🚀 הרצה מהירה (Quick Start)

### 1. הפעל את המערכת
```bash
# הפעל את כל השירותים (Frontend, Backend, Database)
docker-compose up -d

# חכה כ-30 שניות שהכל יעלה
```

### 2. הרץ בדיקות
```bash
# הרצת כל הבדיקות
docker-compose run --rm tests

# או עם profile:
docker-compose --profile test run --rm tests
```

### 3. צפה בתוצאות
התוצאות יוצגו בקונסול עם פירוט מלא של כל בדיקה.

---

## 📋 פקודות נפוצות

### הרצת בדיקות בדרכים שונות

```bash
# הרצה רגילה
docker-compose run --rm tests

# הרצה עם coverage (כיסוי קוד)
docker-compose run --rm tests npm run test:coverage

# הרצה עם watch mode (מתעדכן אוטומטית)
docker-compose run --rm tests npm run test:watch

# הרצת קובץ בדיקה ספציפי
docker-compose run --rm tests npm test -- auth.test.js

# הרצה verbose (פלט מפורט)
docker-compose run --rm tests npm test -- --verbose
```

### ניהול קונטיינרים

```bash
# בניית קונטיינר הבדיקות מחדש
docker-compose build tests

# צפייה בלוגים של הבדיקות
docker-compose logs tests

# כניסה לקונטיינר הבדיקות
docker-compose run --rm tests sh

# ניקוי קונטיינרים ישנים
docker-compose down
docker system prune -f
```

---

## 🎯 תרחישי שימוש

### תרחיש 1: הרצה מלאה לפני commit

```bash
# 1. הפעל את המערכת
docker-compose up -d

# 2. חכה שהכל יעלה
sleep 30

# 3. הרץ בדיקות
docker-compose run --rm tests

# 4. אם הכל עבר - עשה commit
git add .
git commit -m "Your message"
```

### תרחיש 2: פיתוח עם watch mode

```bash
# חלון 1: הרץ את המערכת
docker-compose up

# חלון 2: הרץ בדיקות ב-watch mode
docker-compose run --rm tests npm run test:watch
```

### תרחיש 3: בדיקת feature חדש

```bash
# 1. כתוב בדיקה חדשה ב-tests/integration/

# 2. הרץ רק את הבדיקה החדשה
docker-compose run --rm tests npm test -- your-new.test.js

# 3. ברגע שעובר - הרץ את כל הבדיקות
docker-compose run --rm tests
```

---

## 🐛 פתרון בעיות

### בעיה: "Cannot connect to API"

```bash
# בדוק שה-backend רץ
docker-compose ps

# בדוק לוגים
docker-compose logs backend

# הפעל מחדש
docker-compose restart backend

# המתן 10 שניות והרץ שוב
docker-compose run --rm tests
```

### בעיה: "Database connection failed"

```bash
# בדוק שה-database בריא
docker-compose ps

# רסט את ה-database
docker-compose down -v
docker-compose up -d

# חכה 30 שניות והרץ שוב
```

### בעיה: "Tests are failing randomly"

```bash
# נקה הכל והתחל מחדש
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
sleep 30
docker-compose run --rm tests
```

### בעיה: "Port already in use"

```bash
# מצא מי משתמש בפורט
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Mac/Linux

# עצור תהליכים קודמים
docker-compose down

# או שנה את הפורט ב-docker-compose.yml
```

---

## 📊 הבנת התוצאות

### פלט מוצלח
```
 PASS  integration/auth.test.js
  Auth API Integration Tests
    GET /api/health
      ✓ should return 200 and health status (123ms)
    POST /api/auth/register
      ✓ should successfully register a new user (456ms)
      ✓ should fail with missing name (89ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Time:        12.345s
```

### פלט עם כשלון
```
 FAIL  integration/auth.test.js
  Auth API Integration Tests
    POST /api/auth/register
      ✕ should successfully register a new user (1234ms)

  ● Auth API Integration Tests › should successfully register

    expect(received).toBe(expected)

    Expected: 201
    Received: 400

    at Object.<anonymous> (integration/auth.test.js:45:37)
```

---

## 🔍 בדיקת coverage

```bash
# הרץ עם coverage
docker-compose run --rm tests npm run test:coverage

# הפלט יראה כך:
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   95.23 |    89.47 |   100.0 |   95.23 |
 api.js   |   95.23 |    89.47 |   100.0 |   95.23 | 45-47
----------|---------|----------|---------|---------|-------------------
```

---

## 📁 מבנה הבדיקות

```
tests/
├── integration/
│   ├── auth.test.js        ✅ קיים
│   ├── categories.test.js  🔜 עתידי
│   └── products.test.js    🔜 עתידי
├── helpers/
│   └── api.js              ✅ קיים
├── package.json            ✅ קיים
├── Dockerfile              ✅ קיים
└── README.md               ✅ קיים
```

---

## 🎓 הוספת בדיקות חדשות

### צור קובץ בדיקה חדש

```javascript
// tests/integration/products.test.js
const { ApiHelper, generateUserData } = require('../helpers/api');

describe('Products API Tests', () => {
    let api;

    beforeAll(async () => {
        api = new ApiHelper();
        await api.waitForApi();
    });

    test('should get all products', async () => {
        const response = await api.get('/products');
        expect(response.status).toBe(200);
    });
});
```

### הרץ את הבדיקה החדשה

```bash
docker-compose run --rm tests npm test -- products.test.js
```

---

## 💡 טיפים לפיתוח

1. **כתוב בדיקה לפני feature** - TDD approach
2. **הרץ בדיקות לעיתים קרובות** - כל שינוי קטן
3. **שמור על בדיקות מהירות** - פחות מ-30 שניות
4. **נקה נתונים** - השתמש ב-beforeEach/afterEach
5. **תעד בעיות** - הוסף comments לבדיקות מורכבות

---

## 📈 CI/CD Integration (עתידי)

```yaml
# .github/workflows/tests.yml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker-compose up -d
      - run: sleep 30
      - run: docker-compose run --rm tests
```

---

## 🔗 קישורים שימושיים

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Axios API](https://axios-http.com/docs/intro)

---

**זמן הרצה משוער:** 15-30 שניות
**מספר בדיקות:** 18 (נכון לעכשיו)
**כיסוי קוד:** ~95%

🎉 **בהצלחה עם הבדיקות!**
