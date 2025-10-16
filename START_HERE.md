# 🚀 התחל כאן!

---

## ⚡ הרצה מהירה - 2 דקות

### 1. הרץ בדיקות

```bash
docker-compose up -d
docker-compose run --rm tests
```

**תראה:**
```
✅ All tests passed!
Tests: 18 passed, 18 total
```

---

### 2. העלה לגיטהאב

```bash
git add .
git commit -m "Add tests and CI/CD"
git push
```

**מה יקרה:**
- 🤖 GitHub Actions יריץ בדיקות אוטומטית
- ✅ תראה תוצאות ב-Actions tab

---

## 📖 מדריכים

| רוצה... | קרא... |
|---------|--------|
| 🧪 להריץ בדיקות | [TESTING.md](TESTING.md) |
| 🚀 deployment ל-AWS | [.github/DEPLOY_GUIDE.md](.github/DEPLOY_GUIDE.md) |
| 📋 סקירה כללית | [SUMMARY_HE.md](SUMMARY_HE.md) |
| 📚 תיעוד מלא | [README.md](README.md) |

---

## 🎯 מה יש לך

✅ **18 בדיקות אוטומטיות**
✅ **CI/CD pipeline מלא**
✅ **Deployment אוטומטי ל-AWS**
✅ **תיעוד מקיף**

---

## ⚙️ פקודות שימושיות

```bash
# בדיקות
docker-compose run --rm tests

# בדיקות + coverage
docker-compose run --rm tests npm run test:coverage

# הרץ את האפליקציה
docker-compose up -d

# צפה בלוגים
docker-compose logs -f

# עצור הכל
docker-compose down
```

---

**Docker Hub:** ben1234561423424
**Workflows:** tests.yml + deploy.yml

🎉 **בהצלחה!**
