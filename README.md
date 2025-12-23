# Backend Server

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following:
```
MONGODB_URI=mongodb+srv://shivank24:Shilpank%402414@mydbms.dgew6sb.mongodb.net/
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

**Note:** The `@` symbol in the password must be URL-encoded as `%40` in the connection string.

3. Run the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Create a new user account
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  
- **POST** `/api/auth/login` - Login with email and password
  - Body: `{ "email": "string", "password": "string" }`

- **GET** `/api/health` - Health check endpoint

## Database

The application uses MongoDB and creates a `users` collection automatically when the first user is created.

