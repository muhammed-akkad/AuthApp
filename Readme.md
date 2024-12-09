# Auth App

This project provides a simple authentication flow with a Node.js/Express backend and a React frontend styled with Tailwind CSS.

## Features

- **Registration**: Create a new account.
- **Login**: Obtain a JWT token for authenticated requests.
- **Protected Profile**: Access a profile page with user details after authentication.

## Stack

- **Backend**: Node.js, Express, Sequelize (SQLite), JWT, Bcrypt, CORS
- **Frontend**: React, Tailwind CSS, Vite

## Setup

### Backend

1. Navigate to `backend` folder:
   cd backend
2. npm install
3. npm start

   Server runs at http://localhost:3000

### Endpoints

    POST /auth/register: Register a new user.
    POST /auth/login: Get a JWT token.
    GET /auth/profile: Requires Authorization: Bearer <token>.

### Frontend

1. Navigate to `frontend` folder:
   cd frontend
2. npm install
3. npm run dev

App runs at http://localhost:5173.

## Usage

- Register at http://localhost:5173/register.
- Login at http://localhost:5173 with your new credentials.
- On success, you’ll be redirected to /profile, showing your username.
