# Procareful Backend 🧠

This is the backend for the Procareful application, built with [NestJS](https://nestjs.com/). It provides the API for both the mobile app (seniors) and the admin dashboard.

## Technologies Used 🛠️

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL (via [TypeORM](https://typeorm.io/))
- **Cache**: Redis
- **Storage**: MinIO (S3 compatible)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger (OpenAPI)

## Getting Started 🚀

### Prerequisites

1.  **Nodes & NPM**: Ensure you have Node.js installed.
2.  **Docker**: Docker and Docker Compose are required to run the database and other services.

### Installation

```bash
$ npm install
```

### Initial Setup

1.  **Environment Variables**:
    Create a `.env` file (based on `.env.example` if available) and configure your environment variables.

2.  **Start Infrastructure Services**:
    Use Docker Compose to start PostgreSQL, Redis, and MinIO:
    ```bash
    docker-compose -f docker-compose-local.yml up -d
    ```

3.  **Insert Initial Data**:
    If starting fresh, you may need to seed the database. Connect to your PostgreSQL instance and run the following SQL:

    ```sql
    -- Roles
    INSERT INTO roles (role_name) VALUES
      ('headAdmin'), ('superAdminInstitution'), ('adminInstitution'), ('formalCaregiver'), ('informalCaregiver');

    -- Statuses
    INSERT INTO statuses (status_name) VALUES
      ('active'), ('inactive'), ('created');

    -- Countries
    INSERT INTO countries (country_name, country_code) VALUES
      ('Poland', 'PL'), ('Germany', 'DE');

    -- Example Admin User (Update details as needed)
    -- INSERT INTO admins (first_name, last_name, phone_number, email_address, country_id, status_id) VALUES ...
    ```

## Running the App 🏃‍♂️

```bash
# development mode
$ npm run start

# watch mode (recommended for dev)
$ npm run start:dev

# production mode
$ npm run start:prod
```

The server will typically start on port defined in your `.env` (default often 3000).

### API Documentation (Swagger) 📄

- **URL**: [http://localhost:3000/api](http://localhost:3000/api)
- **Availability**: Development mode only (`NODE_ENV=development`).
- **Spec File**: On startup, a `swagger-spec.json` file is automatically generated in the `backend/swagger/` directory.



## Linting & Formatting 🧹

```bash
# lint
$ npm run lint

# format
$ npm run format
```


