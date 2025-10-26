# Database - Take & Give

תיקייה זו מכילה את קבצי ה-SQL של מסד הנתונים.

## מבנה התיקייה

```
db/
├── init/                  # קבצי SQL שירוצו אוטומטית בעת הרצת docker-compose
│   ├── 01-schema.sql     # יצירת הטבלאות
│   └── 02-seed.sql       # הכנסת נתונים לדוגמה
└── README.md             # קובץ זה
```

## איך זה עובד?

כאשר אתה מריץ `docker-compose up`, MySQL יריץ אוטומטית את כל קבצי ה-SQL שנמצאים בתיקיית `init/` **רק בפעם הראשונה** שהקונטיינר נוצר.

הקבצים מתבצעים לפי סדר אלפביתי:
1. **01-schema.sql** - יוצר את כל הטבלאות (users, categories, products, וכו')
2. **02-seed.sql** - מכניס נתונים לדוגמה (משתמשים, קטגוריות, מוצרים)

## איך לאפס את מסד הנתונים?

אם אתה רוצה לאפס את מסד הנתונים (למחוק הכל ולהתחיל מחדש):

```bash
# עצור את הקונטיינרים
docker-compose down

# מחק את ה-volume של MySQL (זה ימחק את כל הנתונים!)
docker volume rm take-give_mysql_data

# הרץ מחדש - MySQL יריץ שוב את כל קבצי ה-init
docker-compose up -d
```

## גישה ל-phpMyAdmin

לאחר הרצת `docker-compose up`, אתה יכול לגשת ל-phpMyAdmin בכתובת:
- **URL**: http://localhost:8080
- **Server**: mysql
- **Username**: root
- **Password**: rootpassword

## הטבלאות במסד הנתונים

1. **users** - משתמשים (עם תמיכה ב-Google/Apple login)
2. **categories** - קטגוריות מוצרים
3. **products** - מוצרים למסירה
4. **product_images** - תמונות של מוצרים
5. **product_transactions** - עסקאות (תיעוד מסירת מוצרים)

## שימוש

כל הלוגיקה של עבודה עם מסד הנתונים (הכנסה, עדכון, מחיקה) תהיה ב-API Server, **לא כאן**.

התיקייה הזו מכילה **רק** את קבצי ה-SQL ליצירת המבנה הראשוני.
