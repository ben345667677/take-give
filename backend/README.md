# Backend API

## Structure

```
src/
├── server.js              # Main server
├── config/
│   └── database.js        # MySQL connection pool
├── controllers/
│   └── authController.js  # Login/Register logic
└── routes/
    └── authRoutes.js      # API routes
```

## Environment Variables

Create `.env` file:
```
DB_HOST=db
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=apppassword
DB_NAME=loginapp
JWT_SECRET=your-secret-key
PORT=3000
```

## Run Locally (without Docker)

```bash
npm install
npm start
```

## API Endpoints

- `GET  /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
