# Procareful 🧠

Welcome to the **Procareful** repository. This project is a comprehensive solution designed to support care for seniors, consiting of a mobile application for seniors and an administrative dashboard for institutions.

## Project Structure 📂

This repository is organized into two main distinct parts:

### 1. [Backend](./backend) 🔙
The server-side application built with **NestJS**. It handles the API, database operations (PostgreSQL), caching (Redis), and file storage (MinIO).

- **Location**: `/backend`
- [View Backend README](./backend/README.md) for setup and running instructions.

### 2. [Frontend](./frontend) 🖥️
A **NX Monorepo** housing the client-side applications built with **React**, **Vite**, and **Ant Design**.

- **Location**: `/frontend`
- **Applications**:
  - `procareful`: Mobile application for seniors.
  - `procareful-admin`: Admin dashboard for managing care institutions and users.
- [View Frontend README](./frontend/README.md) for development workflows and commands.

## Getting Started 🚀

To get the full system running locally, you generally need to follow these steps:

1.  **Prerequisites**: Ensure you have **Node.js** and **Docker** installed.
2.  **Backend Setup**:
    - Navigate to `backend/`.
    - Setup env variables.
    - Run `docker-compose` to start the database and infrastructure.
    - Start the NestJS server.
3.  **Frontend Setup**:
    - Navigate to `frontend/`.
    - Install dependencies.
    - Start the desired application (`procareful` or `procareful-admin`).

Please refer to the specific README files in each directory for detailed command-line instructions.
