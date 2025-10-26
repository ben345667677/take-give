# 🧪 הוראות לבדיקת המערכת

## 🚀 איך לבדוק שהכל עובד?

### שלב 1: פתח את האתר
פתח דפדפן וגש ל: **http://localhost**

### שלב 2: פתח את כלי הפיתוח
- **Windows/Linux**: לחץ `F12` או `Ctrl + Shift + I`
- **Mac**: לחץ `Cmd + Option + I`

### שלב 3: עבור לטאב Console
בחר בטאב "Console" (קונסולה) בכלי הפיתוח

### שלב 4: בדוק שאתה רואה את ההודעה הבאה:
```
═══════════════════════════════════════
🚀 Take-Give App Loaded
📍 API Base URL: /api
🌐 Current URL: http://localhost/
═══════════════════════════════════════
```

---

## ✅ תרחישי בדיקה

### בדיקה 1: התחברות מוצלחת

1. **לחץ על "Sign In"** (אם אתה בטופס ההרשמה)

2. **הזן את הפרטים הבאים:**
   - Email: `israel@example.com`
   - Password: `123456`

3. **לחץ על "Sign In"**

4. **בקונסול תראה:**
   ```
   🔄 Attempting login for: israel@example.com
   ✅ Login successful: { email: "israel@example.com", user: {...} }
   ✅ Auth token saved to localStorage
   ✅ User data saved to localStorage
   🔄 Redirecting to menu page...
   ```

5. **על המסך תראה:**
   ```
   ✓ שלום Israel Israeli! מתחבר למערכת...
   ```

6. **המערכת תנסה להפנות אותך ל-** `/menuPage/index.html`
   - (אם הדף לא קיים, תקבל שגיאת 404 - זה תקין)

---

### בדיקה 2: התחברות עם פרטים שגויים

1. **הזן את הפרטים הבאים:**
   - Email: `test@example.com`
   - Password: `wrongpassword`

2. **לחץ על "Sign In"**

3. **בקונסול תראה:**
   ```
   🔄 Attempting login for: test@example.com
   Login error: { status: 401, ... }
   ❌ Login failed: Error: Invalid credentials
   ```

4. **על המסך תראה:**
   ```
   אימייל או סיסמה שגויים
   ```

---

### בדיקה 3: וולידציה של אימייל

1. **הזן אימייל לא תקין:**
   - Email: `notanemail`
   - Password: `123456`

2. **לחץ על "Sign In"**

3. **בקונסול תראה:**
   ```
   ⚠️ Login validation failed: Invalid email format
   ```

4. **על המסך תראה:**
   ```
   נא להזין כתובת אימייל תקינה
   ```

---

### בדיקה 4: וולידציה של שדות ריקים

1. **אל תמלא שום שדה**

2. **לחץ על "Sign In"**

3. **בקונסול תראה:**
   ```
   ⚠️ Login validation failed: Missing fields
   ```

4. **על המסך תראה:**
   ```
   נא למלא את כל השדות
   ```

---

### בדיקה 5: הרשמה חדשה

1. **לחץ על "Sign Up"**

2. **הזן את הפרטים הבאים:**
   - Name: `Test User`
   - Email: `test123@example.com` (אימייל חדש!)
   - Password: `123456`

3. **לחץ על "Sign Up"**

4. **בקונסול תראה:**
   ```
   🔄 Attempting registration for: test123@example.com
   ✅ Registration successful: { email: "test123@example.com", name: "Test User", user: {...} }
   🔄 Switching to login form after successful registration
   ```

5. **על המסך תראה:**
   ```
   ✓ ההרשמה הושלמה בהצלחה! עובר להתחברות...
   ```

6. **המערכת תעבור אוטומטית לטופס התחברות**

---

### בדיקה 6: הרשמה עם אימייל קיים

1. **לחץ על "Sign Up"**

2. **הזן את הפרטים הבאים:**
   - Name: `Test User`
   - Email: `israel@example.com` (אימייל שכבר קיים!)
   - Password: `123456`

3. **לחץ על "Sign Up"**

4. **בקונסול תראה:**
   ```
   🔄 Attempting registration for: israel@example.com
   Registration error: { status: 409, message: "User already exists", ... }
   ❌ Registration failed: Error: User already exists
   🔄 Email exists, switching to login form
   ```

5. **על המסך תראה:**
   ```
   ✓ האימייל כבר רשום במערכת. עובר להתחברות...
   ```

6. **המערכת תעבור אוטומטית לטופס התחברות ותמלא את האימייל**

7. **תראה הודעה:**
   ```
   ברוך שובך! נא להזין את הסיסמה.
   ```

---

### בדיקה 7: וולידציה של סיסמה קצרה

1. **לחץ על "Sign Up"**

2. **הזן את הפרטים הבאים:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `123` (פחות מ-6 תווים!)

3. **לחץ על "Sign Up"**

4. **בקונסול תראה:**
   ```
   ⚠️ Registration validation failed: Password too short
   ```

5. **על המסך תראה:**
   ```
   הסיסמה חייבת להכיל לפחות 6 תווים
   ```

---

## 📊 סיכום ההודעות

### ✅ הודעות הצלחה (ירוק):
- ✓ שלום [שם]! מתחבר למערכת...
- ✓ ההרשמה הושלמה בהצלחה! עובר להתחברות...
- ✓ האימייל כבר רשום במערכת. עובר להתחברות...
- ברוך שובך! נא להזין את הסיסמה.

### ❌ הודעות שגיאה (אדום):
- נא למלא את כל השדות
- נא להזין כתובת אימייל תקינה
- הסיסמה חייבת להכיל לפחות 6 תווים
- אימייל או סיסמה שגויים
- משתמש לא נמצא במערכת
- שגיאת רשת - נא לנסות שוב

---

## 🐛 אם יש בעיה

אם משהו לא עובד:

1. **בדוק שכל הקונטיינרים רצים:**
   ```bash
   docker compose ps
   ```

2. **בדוק לוגים של הבקאנד:**
   ```bash
   docker compose logs backend
   ```

3. **בדוק לוגים של הפרונטנד:**
   ```bash
   docker compose logs frontend
   ```

4. **רענן את הדף (Ctrl+F5)** כדי לנקות את המטמון

---

## 📋 משתמשים לדוגמה במערכת

| שם | אימייל | סיסמה |
|----|--------|-------|
| Israel Israeli | israel@example.com | 123456 |
| Sarah Cohen | sarah@example.com | password123 |
| David Levi | david@example.com | securepass |

כל המשתמשים האלה קיימים במאגר הנתונים ויכולים להתחבר.

---

## ✨ זהו!

עכשיו אתה יכול לבדוק את המערכת ולראות:
- 🔍 **לוגים מפורטים בקונסול** - לדיבאג ומעקב
- 💬 **הודעות ברורות בעברית** - למשתמש
- 🎯 **הפרדה נכונה** - טכני לקונסול, UX למשתמש
