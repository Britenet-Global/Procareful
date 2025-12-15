# Procareful Backend Technical Documentation

This document provides in-depth technical details about the Procareful Backend project architecture, implementation patterns, and development guidelines.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database & ORM](#database--orm)
3. [API Structure](#api-structure)
4. [Authentication & Authorization](#authentication--authorization)
5. [File Storage](#file-storage)
6. [Internationalization](#internationalization)
7. [Caching & Performance](#caching--performance)
8. [Machine Learning](#machine-learning)
9. [Development Workflow](#development-workflow)

## Architecture Overview

The backend is built using [NestJS](https://nestjs.com/), following a modular architecture.

### Key Modules

- **App Module**: The root module that imports all other feature modules.
- **Admin**: Contains logic specific to the Admin Dashboard (caregivers, institutions management).
- **User**: Handles user-related operations (likely for the senior mobile app).
- **Common**: Shared utilities, decorators, and constants used across the application.
- **MinIO**: Handles interactions with the object storage service.
- **Redis**: Manages Redis connection for caching and session management.
- **Email/Notifications**: Handles communication with users.
- **ML**: Contains Machine Learning related features.

### Directory Structure

```
src/
├── admin/          # Admin-specific modules and business logic
├── user/           # User-specific modules (Senior App)
├── common/         # Shared resources (guards, pipes, interceptors)
├── config/         # Configuration files (TypeORM, etc.)
├── cron-schedule/  # Scheduled tasks/Jobs
├── email/          # Email service implementation
├── i18n/           # Internationalization setup
├── minio/          # S3-compatible storage integration
├── ml/             # Machine Learning service integrations
├── notifications/  # Notification system
├── redis/          # Redis configuration and service
└── main.ts         # Application entry point
```

## Database & ORM

We use **PostgreSQL** as the primary relational database and **TypeORM** for object-relational mapping.

### Entity Configuration
Entities are defined using TypeORM decorators. Relations (OneToOne, OneToMany, ManyToMany) are explicitly defined.

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  // ... relations
}
```

### Migrations & Seeding
Database schema changes should be handled via TypeORM migrations (though in development `synchronize: true` might be used, verify in `config`).
Initial data seeding is available via SQL scripts documented in the README.

## API Structure

The API adheres to RESTful principles and is documented using **Swagger**.

### Controllers & Services
- **Controllers**: Handle HTTP requests, input validation, and send responses.
- **Services**: Contain the business logic and interact with Repositories.

### Validation
Request validation is enforced using `class-validator` and `class-transformer` DTOs (Data Transfer Objects).

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
}
```

### Response Transformation
Responses are standardly formatted. Interceptors may be used to transform outgoing data (e.g., `ClassSerializerInterceptor` to exclude passwords).

## Authentication & Authorization

Authentication is likely handled via **Passport** strategies (Local, JWT).

- **Guards**: `AuthGuard` is used to protect endpoints.
- **Decorators**: Custom decorators like `@CurrentUser()` to extract user from request.
- **Roles**: Role-based access control (RBAC) is implemented (e.g. Roles Guard) to differentiate between Admins, Caregivers, Seniors.

## File Storage

**MinIO** is used as an S3-compatible object storage for handling file uploads (images, documents).

- Files are uploaded via API endpoints (likely using `Multer`).
- The `MinioService` handles the actual interaction with the storage bucket.
- URLs are generated and stored/returned to the client.

## Internationalization

The backend uses `nestjs-i18n` to support multiple languages.

- Translation files are stored in `src/i18n/`.
- The `I18nService` is used to retrieve translated strings for response messages or emails.

## Caching & Performance

**Redis** is used for:
- Caching frequently accessed data.
- Managing user sessions (if applicable).
- Rate limiting (`@nestjs/throttler` is present in dependencies).

## Machine Learning

The `ml` module integrates machine learning capabilities. (Further details needed depending on specific implementation - likely for predictive analysis or anomaly detection).

## Development Workflow

### Coding Standards
- **Linting**: `eslint` is enforced.
- **Formatting**: `prettier` is used.



### Running Locally
Docker Compose is essential for spinning up the infrastructure (Postgres, Redis, MinIO).

```bash
docker-compose -f docker-compose-local.yml up -d
npm run start:dev
```
