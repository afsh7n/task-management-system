# Task Management API

This project is a **Task Management API** built with [NestJS](https://nestjs.com/) that includes features for managing users, tasks, roles, and authentication. The project is configured to run in a **Dockerized environment**, allowing seamless deployment and scalability.

---

## **Features**

### **Core Features**
1. **User Management**
    - Register users with **email**, **username**, or **phone number**.
    - Password hashing with [bcrypt](https://www.npmjs.com/package/bcrypt) for security.
    - User activation status management.

2. **Task Management**
    - Create, update, delete, and retrieve tasks.
    - **Role-based Access Control**:
        - **Admin**: Access to all tasks.
        - **User**: Access to their own tasks only.

3. **Authentication**
    - Secure authentication with **JWT**.
    - Bearer token authorization for protected endpoints.

4. **API Documentation**
    - Auto-generated API documentation using **Swagger**.
    - Available at `/api/docs`.

5. **Validation**
    - Request validation using [class-validator](https://www.npmjs.com/package/class-validator).
    - Custom error handling for invalid inputs.

6. **Role Management**
    - Roles defined as:
        - **Admin**
        - **User**

7. **Dockerized Environment**
    - **Docker Compose** setup for running the entire stack:
        - Node.js application
        - MySQL database
        - phpMyAdmin for database management
        - Nginx for serving the application

---

## **Planned Features**

1. **i18n (Internationalization)**
    - Support for multiple languages in API responses.
    - Language preference based on request headers.

2. **Pagination**
    - Add pagination for retrieving large lists of tasks and users.

3. **Real-time Updates**
    - Implement WebSocket for real-time task updates.

4. **Notifications**
    - Send notifications on task status updates.

5. **Admin Panel**
    - A web-based admin panel for managing users and tasks.

6. **Continuous Integration (CI/CD)**
    - Automate tests and deployments with CI/CD pipelines.

---

## **Project Structure**

```
src
├── app.module.ts          # Main application module
├── configs                # Configuration files
├── core                   # Core utilities and shared modules
├── modules                # Feature modules
│   ├── auth               # Authentication module
│   ├── user               # User module
│   └── tasks              # Task module
└── common                 # Common utilities, decorators, and filters
```

---

## **Setup Instructions**

### **Prerequisites**
- [Node.js](https://nodejs.org/) version 16 or higher.
- [Docker](https://www.docker.com/) and Docker Compose installed.

### **Clone the Repository**
```bash
git clone https://github.com/your-repo-url.git
cd your-repo-url
```

### **Configure Environment Variables**
Update the `.env` file as per your configuration. Sample `.env` file:
```env
# General Configuration
PORT=3000
NODE_ENV=development
PREFIX_API=api

# Database Configuration
DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=test

# Swagger Configuration
SWAGGER_TITLE=Task Management API
SWAGGER_DESCRIPTION=API documentation
SWAGGER_VERSION=1.0
SWAGGER_PATH=api/docs
SWAGGER_BEARER_AUTH=true

# JWT Configuration
JWT_SECRET=my_super_secret_key
JWT_EXPIRES_IN=1h
```

### **Run the Application**

#### **Using Docker**
1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
2. Access the API at [http://localhost:3000](http://localhost:3000).
3. Access the Swagger documentation at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).
4. Manage the database using phpMyAdmin at [http://localhost:8081](http://localhost:8081).

---

## **Running Tests**

### **Unit Tests**
```bash
npm run test
```

### **End-to-End Tests**
```bash
npm run test:e2e
```

---

## **Docker Setup**

### **Docker Compose Overview**
The `docker-compose.yml` file sets up the following services:
- **App**: The main Node.js application.
- **MySQL**: The database service.
- **phpMyAdmin**: A web-based database management tool.
- **Nginx**: A reverse proxy for serving the application.

### **Docker Volumes**
A Docker volume is used to persist the MySQL database:
```yaml
volumes:
  mysql-data:
```

---

## **Endpoints**

### **Authentication**
- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in and receive a JWT token.

### **Tasks**
- **POST /tasks**: Create a new task.
- **GET /tasks**: Get tasks (Admin: all tasks, User: own tasks).
- **PATCH /tasks/:id**: Update a task.
- **DELETE /tasks/:id**: Delete a task.

---

## **Database**

The database uses **MySQL** with the following entities:
1. **UserEntity**: Stores user details (username, email, phone, role).
2. **TaskEntity**: Stores task details (title, description, userId).

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## **Author**

**Your Name**
- [GitHub](https://github.com/your-profile)
- [LinkedIn](https://www.linkedin.com/in/your-profile/)

--- 

Enjoy using the **Task Management API**! 🎉