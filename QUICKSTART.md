# ⚡ Quick Start Guide

מדריך התחלה מהירה לפרויקט Trade & Give Marketplace

## 🚀 התקנה מהירה (5 דקות)

### שלב 1: Clone הפרויקט
```bash
git clone <your-repo-url>
cd trade-give-marketplace
```

### שלב 2: הרץ את הכל
```bash
docker-compose up -d
```

### שלב 3: המתן 30 שניות
הקונטיינרים צריכים זמן להתקנה ראשונית.

### שלב 4: פתח דפדפן
- 🏠 Login: http://localhost
- 🏪 Marketplace: http://localhost/menuPage/

---

## 🧪 בדיקה מהירה

### הרץ בדיקות
```bash
docker-compose run --rm tests
```

### בדוק שהכל עובד
```bash
# Health check
curl http://localhost:3000/api/health

# צפה בקונטיינרים
docker-compose ps
```

---

## 🛠️ פקודות שימושיות

```bash
# עצור הכל
docker-compose down

# עצור + מחק נתונים
docker-compose down -v

# צפה בלוגים
docker-compose logs -f

# בנה מחדש
docker-compose build --no-cache

# הרץ בדיקות עם coverage
docker-compose run --rm tests npm run test:coverage
```

---

## 📝 משתמש לבדיקה

```
Email: test@test.com
Password: 123456
```

---

## 🔧 פתרון בעיות מהיר

### Backend לא עובד?
```bash
docker-compose restart backend
docker-compose logs backend
```

### Database לא עובד?
```bash
docker-compose restart db
docker-compose logs db
```

### הכל לא עובד?
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📚 תיעוד מלא

- 📖 [README.md](README.md) - תיעוד ראשי
- 🧪 [TESTING.md](TESTING.md) - מדריך בדיקות
- 🚀 [.github/CI_CD_GUIDE.md](.github/CI_CD_GUIDE.md) - CI/CD
- 🔐 [.github/SETUP_SECRETS.md](.github/SETUP_SECRETS.md) - Secrets

---

## ✅ Checklist

- [ ] Docker & Docker Compose מותקנים
- [ ] Clone הפרויקט
- [ ] `docker-compose up -d` רץ בהצלחה
- [ ] Frontend נפתח ב-http://localhost
- [ ] Backend עובד ב-http://localhost:3000/api/health
- [ ] בדיקות עברו בהצלחה

---

🎉 **זהו! הפרויקט רץ!**

למידע נוסף קרא את [README.md](README.md)
