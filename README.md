# Admin Authentication System with JWT

This is a Node.js-based Admin Authentication System that uses **JSON Web Tokens (JWT)** for secure authentication. The app allows admins to sign up, log in, and access protected routes. The app uses **MongoDB Atlas** as the database and **bcryptjs** for secure password hashing.

## Features

- **Admin Signup**: Allows an admin to create a new account by providing an email and password.
- **Admin Login**: Authenticates admins and provides a JWT token for accessing protected routes.
- **JWT Authentication**: Tokens are generated during login and must be provided for accessing protected routes.
- **Password Hashing**: Passwords are hashed using `bcryptjs` before storing in the database.

## Technologies

- **Node.js**
- **Express.js**
- **MongoDB (via Mongoose)**
- **JWT (JSON Web Tokens)**
- **bcryptjs** (for password hashing)
- **dotenv** (for managing environment variables)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed (preferably the latest LTS version)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster created (can use the free tier for testing)
- Basic knowledge of JWT and how it works.

### 1. Clone the Repository

```bash
git https://github.com/Mathew2004/Funding---Backend.git
cd admin-auth-jwt
```

### 2. Install Dependencies

Install the necessary packages by running:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

- Replace `<username>`, `<password>`, and `<dbname>` with your MongoDB Atlas credentials.
- `JWT_SECRET`: A secret key for signing JWT tokens. (You can generate a random string)
- `JWT_EXPIRATION`: The expiration time for JWT tokens (e.g., `1h` for 1 hour).

### 4. Start the Application

Once everything is set up, you can start the server with:

```bash
npm start
```

The server will be running on `http://localhost:5000`.

## API Endpoints

### 1. **Admin Signup**

- **URL**: `/admin/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "msg": "Admin registered successfully"
  }
  ```

### 2. **Admin Login**

- **URL**: `/admin/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "<JWT_TOKEN>"
  }
  ```

### 3. **Protected Route** (Example of a protected route using JWT)

- **URL**: `/admin/protected`
- **Method**: `GET`
- **Authorization**: Bearer Token (JWT token obtained after login)
- **Response**:
  ```json
  {
    "msg": "You have access to this protected route!"
  }
  ```

## Authentication Flow

1. **Signup**: The admin provides an email and password. The password is hashed and stored in the database.
2. **Login**: The admin logs in by providing the email and password. If successful, a JWT token is generated and sent as a response.
3. **Access Protected Routes**: The JWT token must be included in the `Authorization` header to access protected routes (use `Bearer <token>`).

## Security Considerations

- **JWT Expiration**: The JWT token expires based on the duration defined in the `.env` file (`JWT_EXPIRATION`).
- **Password Hashing**: Passwords are securely hashed using `bcryptjs`, ensuring they are never stored in plain text.
- **HTTPS**: Always use HTTPS in production to secure communication, especially when transmitting sensitive information like passwords and tokens.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
