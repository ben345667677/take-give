# 🚀 מדריך Deployment ל-AWS EC2

מדריך פשוט להגדרת deployment אוטומטי לשרת AWS EC2 עם SSH.

---

## 🎯 מה תקבל

- ✅ בדיקות אוטומטיות על כל push
- ✅ בניית Docker images אוטומטית
- ✅ deployment אוטומטי ל-AWS כש-PR נמזג ל-main
- ✅ כל זה ב-5 דקות!

---

## 📋 מה צריך לפני שמתחילים

1. **EC2 Instance רץ** (Amazon Linux או Ubuntu)
2. **קובץ PEM** (SSH key) של ה-EC2
3. **Docker Hub account** (יש לך: `ben1234561423424`)
4. **GitHub repository** (הפרויקט שלך)

---

## ⚡ הגדרה מהירה - 3 שלבים

### שלב 1: הוסף Secrets בגיטהאב

לך ל-GitHub → Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

הוסף 5 secrets:

| Name | Value | איפה למצוא |
|------|-------|-----------|
| `DOCKER_USERNAME` | `ben1234561423424` | שם המשתמש שלך ב-Docker Hub |
| `DOCKER_PASSWORD` | `<טוקן>` | Docker Hub → Settings → Security → New Access Token |
| `EC2_SSH_KEY` | `<תוכן PEM>` | פתח את קובץ ה-PEM והעתק הכל |
| `EC2_HOST` | `54.123.45.67` | Public IP של ה-EC2 (AWS Console) |
| `EC2_USER` | `ec2-user` | `ec2-user` (Amazon Linux) או `ubuntu` (Ubuntu) |

**איך להעתיק PEM:**
```bash
# Windows
notepad "C:\Users\YourName\.ssh\my-key.pem"

# Mac/Linux
cat ~/.ssh/my-key.pem

# העתק הכל כולל:
# -----BEGIN RSA PRIVATE KEY-----
# ... כל השורות ...
# -----END RSA PRIVATE KEY-----
```

**איך ליצור Docker Hub Token:**
1. [Docker Hub](https://hub.docker.com) → Settings → Security
2. **New Access Token**
3. שם: `github-actions`, הרשאות: **Read, Write, Delete**
4. **Generate** → **העתק!**

---

### שלב 2: הכן את ה-EC2

התחבר ל-EC2:
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@54.123.45.67
```

הרץ את הסקריפט הזה (copy-paste):
```bash
# עדכון מערכת
sudo yum update -y

# התקן Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# התקן Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# צור תיקיית פרויקט
sudo mkdir -p /opt/trade-give
sudo chown $USER:$USER /opt/trade-give
cd /opt/trade-give

echo "✅ EC2 מוכן!"
```

צור קבצים בתיקייה `/opt/trade-give`:

**docker-compose.yml** (העתק מהפרויקט שלך):
```bash
nano docker-compose.yml
# העתק את התוכן מ-docker-compose.yml שלך
# Ctrl+X, Y, Enter
```

**קובץ .env** (סיסמאות):
```bash
nano .env
```

הדבק:
```env
# Database
DB_HOST=db
DB_PORT=3306
DB_USER=produser
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD_123
DB_NAME=loginapp

# MySQL
MYSQL_ROOT_PASSWORD=CHANGE_ME_ROOT_PASSWORD_456
MYSQL_DATABASE=loginapp
MYSQL_USER=produser
MYSQL_PASSWORD=CHANGE_ME_STRONG_PASSWORD_123

# Backend
JWT_SECRET=CHANGE_ME_SUPER_SECRET_JWT_KEY_789
PORT=3000
```

**⚠️ חשוב:** שנה את כל ה-`CHANGE_ME` לסיסמאות חזקות!

שמור: `Ctrl+X` → `Y` → `Enter`

בדוק שהכל עובד:
```bash
docker-compose up -d
sleep 30
curl http://localhost:3000/api/health

# אמור לקבל: {"status":"OK",...}
```

צא מ-SSH:
```bash
exit
```

---

### שלב 3: הפעל Security Group

ב-AWS Console:
1. EC2 → **Security Groups** → בחר את ה-SG של ה-instance שלך
2. **Edit inbound rules**
3. **Add rule:**
   - Type: **SSH**, Port: 22, Source: **0.0.0.0/0**
   - Type: **HTTP**, Port: 80, Source: **0.0.0.0/0**
   - Type: **Custom TCP**, Port: 3000, Source: **0.0.0.0/0**
4. **Save**

---

## 🎉 זהו! עכשיו בדוק

### Push לגיטהאב:
```bash
git add .
git commit -m "Setup CI/CD"
git push
```

### מה יקרה:
1. GitHub Actions יתחיל לרוץ (Actions tab)
2. הבדיקות ירוצו (tests.yml)
3. אם הכל עבר - תראה ✅

### כשתעשה Pull Request ל-main ותעשה Merge:
1. GitHub Actions יריץ deployment (deploy.yml)
2. יבנה Docker images
3. יעלה ל-Docker Hub
4. יעשה SSH ל-EC2 ויפרס!
5. תקבל comment על ה-PR עם הסטטוס

---

## 📊 הבן את ה-Workflows

יש לך 2 workflows:

### 1. Tests (`.github/workflows/tests.yml`)
- **רץ:** כל push לכל branch
- **עושה:** מריץ 18+ בדיקות
- **זמן:** ~2-3 דקות

### 2. Deploy (`.github/workflows/deploy.yml`)
- **רץ:** כש-PR נמזג ל-main
- **עושה:**
  1. בונה Frontend + Backend images
  2. מעלה ל-Docker Hub
  3. SSH ל-EC2
  4. Pull images חדשים
  5. Restart containers
  6. בדיקת health
- **זמן:** ~5-7 דקות

---

## 🔍 איך לבדוק שהכל עובד

### בדוק ידנית SSH:
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@54.123.45.67
```
אם נכנסת ללא סיסמה - ✅ מעולה!

### בדוק ידנית Docker על EC2:
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@54.123.45.67
docker ps
# אמור לראות 3 containers רצים: frontend, backend, db
```

### בדוק מהדפדפן:
```
http://54.123.45.67           # Frontend
http://54.123.45.67:3000/api/health  # Backend API
```

---

## 🐛 פתרון בעיות

### "Permission denied (publickey)"
**בעיה:** לא יכול להתחבר ב-SSH

**פתרון:**
```bash
# בדוק שה-PEM נכון:
ssh -i ~/.ssh/my-key.pem ec2-user@54.123.45.67

# אם לא עובד, נסה ubuntu:
ssh -i ~/.ssh/my-key.pem ubuntu@54.123.45.67

# ודא שהקובץ בהרשאות נכונות:
chmod 600 ~/.ssh/my-key.pem
```

### GitHub Actions נכשל ב-"Docker login"
**בעיה:** `DOCKER_PASSWORD` לא נכון

**פתרון:**
1. Docker Hub → צור token חדש
2. GitHub → Secrets → עדכן `DOCKER_PASSWORD`

### Deployment מסתיים אבל האתר לא עובד
**בעיה:** Security Group

**פתרון:**
- ודא שפתחת פורטים 80, 3000, 22
- AWS Console → EC2 → Security Groups

### Backend health check failed
**בעיה:** Database לא עלה

**פתרון:**
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@54.123.45.67
cd /opt/trade-give
docker-compose logs db
docker-compose restart db
```

---

## 📝 תהליך עבודה יומיומי

```bash
# 1. צור feature branch
git checkout -b feature/new-feature

# 2. עבוד על הקוד
# ... code code code ...

# 3. הרץ בדיקות מקומית (אופציונלי)
docker-compose run --rm tests

# 4. Commit & Push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 5. GitHub Actions יריץ בדיקות ✅

# 6. פתח PR ב-GitHub
gh pr create --base main --title "Add new feature"

# 7. Review + Merge

# 8. Deployment אוטומטי ל-EC2! 🚀
```

---

## 🔒 אבטחה

### ✅ עשה:
- שנה סיסמאות ב-`.env` על ה-EC2
- השתמש ב-JWT_SECRET חזק
- שמור PEM key במקום בטוח
- הגבל Security Group רק למה שצריך

### ❌ אל תעשה:
- אל תעלה `.env` לגיט
- אל תשתף PEM key
- אל תשתמש בסיסמאות חלשות
- אל תפתח יותר פורטים מצריך

---

## 💰 עלויות

- **GitHub Actions:** חינם (2,000 דקות/חודש)
- **Docker Hub:** חינם
- **AWS EC2:** **עולה כסף!** (~$10-30/חודש תלוי ב-instance type)

---

## 🎯 Checklist

לפני deployment ראשון:

- [ ] יצרתי 5 Secrets בגיטהאב
- [ ] Docker + Docker Compose מותקנים על EC2
- [ ] `/opt/trade-give` קיים עם `docker-compose.yml` ו-`.env`
- [ ] Security Group פתוח לפורטים 22, 80, 3000
- [ ] בדקתי SSH connection ידנית
- [ ] הרצתי `docker-compose up -d` פעם אחת ידנית על EC2
- [ ] Backend health עובד: `curl http://localhost:3000/api/health`

---

## 📚 עזרה נוספת

- 🧪 [מדריך בדיקות](../TESTING.md)
- 📖 [README ראשי](../README.md)
- 🎓 [Docker Docs](https://docs.docker.com/)
- ☁️ [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)

---

**נוצר:** 2025-01-16
**שם משתמש Docker Hub:** ben1234561423424
**Deployment method:** SSH with PEM key

🎉 **בהצלחה!**
