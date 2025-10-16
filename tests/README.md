# 🧪 API Integration Tests

מערכת בדיקות אוטומטיות ל-API של Trade & Give Marketplace

## 📁 מבנה

```
tests/
├── integration/          # בדיקות אינטגרציה
│   └── auth.test.js     # בדיקות אימות (Register/Login)
├── helpers/             # פונקציות עזר
│   └── api.js          # API helper class
├── package.json
├── Dockerfile
└── README.md
```

## 🚀 הרצת בדיקות

### באמצעות Docker Compose (מומלץ)

```bash
# הרצת כל הבדיקות
docker-compose run --rm tests

# הרצה עם watch mode
docker-compose run --rm tests npm run test:watch

# הרצה עם coverage
docker-compose run --rm tests npm run test:coverage
```

### הרצה ידנית (ללא Docker)

```bash
cd tests
npm install
npm test
```

## 📝 בדיקות קיימות

### Auth API Tests (`auth.test.js`)

#### Health Check
- ✅ GET /api/health

#### Registration
- ✅ Register new user successfully
- ✅ Fail with missing name
- ✅ Fail with missing email
- ✅ Fail with missing password
- ✅ Fail with invalid email format
- ✅ Fail with short password (< 6 chars)
- ✅ Fail with duplicate email

#### Login
- ✅ Login successfully with valid credentials
- ✅ Fail with wrong password
- ✅ Fail with non-existent email
- ✅ Fail with missing email
- ✅ Fail with missing password
- ✅ Fail with invalid email format

#### Complete Lifecycle
- ✅ Register → Login → Use Token → Cleanup

#### Edge Cases
- ✅ Handle uppercase emails
- ✅ Trim whitespace from inputs
- ✅ Reject empty strings

## 🔧 הגדרות

### Environment Variables

```env
API_BASE_URL=http://backend:3000/api  # Backend URL
NODE_ENV=test                          # Environment
```

## 📊 דוגמת פלט

```
Auth API Integration Tests
  GET /api/health
    ✓ should return 200 and health status (123ms)

  POST /api/auth/register
    ✓ should successfully register a new user (456ms)
    ✓ should fail with missing name (89ms)
    ✓ should fail with invalid email format (91ms)
    ...

  POST /api/auth/login
    ✓ should successfully login with valid credentials (234ms)
    ✓ should fail with wrong password (187ms)
    ...

  Complete User Lifecycle
    ✓ should complete full user lifecycle (1234ms)

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
```

## ➕ הוספת בדיקות חדשות

### יצירת קובץ בדיקה חדש

```javascript
const { ApiHelper, generateUserData } = require('../helpers/api');

describe('My New Test Suite', () => {
    let api;

    beforeAll(async () => {
        api = new ApiHelper();
        await api.waitForApi();
    });

    test('should do something', async () => {
        const response = await api.get('/endpoint');
        expect(response.status).toBe(200);
    });
});
```

### שימוש ב-API Helper

```javascript
const api = new ApiHelper();

// GET request
const response = await api.get('/products');

// POST request
const response = await api.post('/auth/register', userData);

// With authentication
api.setToken('your-jwt-token');
const response = await api.post('/products', productData);

// Clear token
api.clearToken();
```

## 🎯 Best Practices

1. **חכה ל-API** - השתמש ב-`api.waitForApi()` ב-beforeAll
2. **ניקוי בין בדיקות** - השתמש ב-beforeEach לאיפוס
3. **Sleep בין בקשות** - השתמש ב-`sleep()` כשצריך
4. **אימיילים ייחודיים** - השתמש ב-`generateUserData()`
5. **נקה Tokens** - תמיד `clearToken()` בסוף

## 🐛 Debug

### הפעלת בדיקה אחת

```bash
docker-compose run --rm tests npm test -- auth.test.js
```

### הפעלת בדיקה ספציפית

```javascript
test.only('should do something', async () => {
    // This test will run alone
});
```

### דילוג על בדיקה

```javascript
test.skip('should do something', async () => {
    // This test will be skipped
});
```

## 📈 Coverage

```bash
docker-compose run --rm tests npm run test:coverage
```

פלט מפורט יופיע ב-`coverage/` directory

## 🔜 בדיקות עתידיות

- [ ] Categories API tests
- [ ] Products API tests
- [ ] Protected routes tests
- [ ] Product images tests
- [ ] Trade offers tests
- [ ] Favorites tests
- [ ] Pagination tests
- [ ] Search & filters tests

## 💡 טיפים

### ניקוי Database בין הרצות
אם הבדיקות מתנגשות, אפשר לרסט את ה-DB:

```bash
docker-compose down -v
docker-compose up -d
```

### בדיקת לוגים
```bash
docker-compose logs -f tests
docker-compose logs -f backend
```

---

**נוצר עבור:** Trade & Give Marketplace
**Framework:** Jest
**Node Version:** 18+
