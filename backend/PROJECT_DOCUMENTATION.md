# How to Run the Backend Application 🏃‍♂️

## 1. System Requirements 💻

You need to have **Docker Engine** installed on your machine.
- **Mac/Windows**: Docker Desktop or Rancher Desktop
- **Linux**: Install docker engine from command line

> **Note for Windows Users**: You also need to have WSL 2 (Windows Subsystem for Linux) installed.

## 2. Environment Variables Description 🔐

All variables should be included in the `.env` file, which must be located in the root folder of the application.

Variables should be defined in the following format: `variable_name=value`

### Core & Configuration

- **`NODE_ENV`**
  Specifies the application running mode. Use `development` for testing and `production` for production.

- **`PRC_DOMAIN`**
  Specifies the admin application domain.

- **`PRC_SENIOR_DOMAIN`**
  Specifies the user application domain.

- **`PRC_RESET_LINK_ID_TTL`**
  Specifies in seconds how long the password reset link should be valid (use default: `3600`).

- **`PRC_SECURE_COOKIE`**
  Enables the secure flag for cookies, ensuring they are only transmitted over HTTPS connections (use default: `true`).

- **`PRC_LANDING_PAGE_URL`**
  Specifies the download link for the senior application (e.g., `your_domain/download`).

- **`BE_HOSTNAME`**
  Specifies the backend service host (use default: `http://backend:3000`).

- **`PRC_SYNCHRONIZE_SCHEMA`**
  Enables or disables schema synchronization in the NestJS app (use default: `false`).

### Database (PostgreSQL)

- **`PRC_DB_HOST`**
  PostgreSQL database host (use default: `db`).

- **`PRC_DB_PORT`**
  PostgreSQL database port (use default: `5432`).

- **`PRC_DB_DATABASE`**
  PostgreSQL database name.

- **`PRC_DB_USERNAME`**
  PostgreSQL database username.

- **`PRC_DB_PASSWORD`**
  PostgreSQL database password.

### Caching (Redis)

- **`PRC_REDIS_HOST`**
  Specifies the Redis host used for caching data (use default: `redis`).

### Storage (MinIO)

- **`PRC_MINIO_ENDPOINT`**
  Specifies the bucket endpoint for storing data such as videos and images (use default: `http://minio:9000`).

- **`PRC_MINIO_ACCESSKEY`**
  Access key for MinIO storage.

- **`PRC_MINIO_SECRETKEY`**
  Secret key for MinIO storage.

- **`PRC_MINIO_REGION`**
  Specifies the data storage region (use default: `us-east-1`).

- **`PRC_MINIO_BUCKET_NAME`**
  Specifies the storage bucket name for user data such as images (use default: `bucket-prc`).

- **`PRC_MINIO_BUCKET_NAME_NOTES`**
  Specifies the storage bucket name for notes (use default: `bucket-prc-notes`).

- **`PRC_MINIO_BUCKET_NAME_DOCUMENT`**
  Specifies the storage bucket name for documents (use default: `bucket-prc-documents`).

- **`PRC_MINIO_BUCKET_NAME_ASSESSMENT_REPORT`**
  Specifies the storage bucket name for assessment reports (use default: `bucket-prc-assessment-report`).

- **`PRC_MINIO_BUCKET_NAME_VIDEOS`**
  Specifies the storage bucket name for videos (use default: `bucket-prc-videos`).

### Machine Learning

- **`PRC_ML_DOMAIN`**
  Specifies the machine learning service host (use default: `http://ml:8000`).

- **`PRC_API_KEY`**
  API key for communication with the machine learning service (generate and use your own key).

- **`PRC_REPORT_API_KEY`**
  API key for secure report generation endpoint (generate and use your own key).

### Email Service

- **`PRC_EMAIL_SERVICE`**
  Communication protocol for the mailer service (use default: `SMTP`).

- **`PRC_EMAIL_HOST`**
  Email host address.

- **`PRC_EMAIL_PORT`**
  Email port.

- **`PRC_EMAIL_SECURE`**
  Enables secure email connection (`true` for SSL/TLS).

- **`PRC_EMAIL_USER`**
  Email account username.

- **`PRC_EMAIL_PASSWORD`**
  Email account password.

- **`PRC_EMAIL_FROM`**
  Sender address for outgoing emails.

## 3. How to Run Application 🚀

Once Docker Engine is installed on your machine, navigate to the application’s root folder and run the following command in a terminal (either your system terminal or your IDE's terminal). The application will start building and will launch automatically once the build is complete.

```bash
docker compose -f docker-compose.yml up -d
```

## 4. Insert Initial Data into the Database 💾

The initial database dump file is included with this instruction as `initial_data.dump`.

> **Note**: The included exercise videos should be uploaded to the `PRC_MINIO_BUCKET_NAME_VIDEOS` bucket, which is defined in the environment variables.

### Using pgAdmin
If you are using the **pgAdmin** application, you need to configure the connection according to the environment variables and use the Restore option to insert the initial data.
[Tutorial: How to backup and restore PostgreSQL databases using pgAdmin](https://www.commandprompt.com/education/how-to-backup-and-restore-postgresql-databases-using-pgadmin)

### Using Command Line
If you want to insert initial data via command line, refer to the documentation below:
[PostgreSQL Documentation: Backup, Dump, and Restore](https://www.postgresql.org/docs/current/backup-dump.html#BACKUP-DUMP-RESTORE)

## 5. Create Super Admin 👨‍💼

Once the application is running and the initial data has been inserted into the database, you need to create a super admin account. You can do this either by executing the SQL insert via pgAdmin or in the terminal connected to the database.

### Country IDs Reference
- **1**: EN (English)
- **2**: DE (German)
- **3**: PL (Polish)
- **4**: IT (Italian)
- **5**: HU (Hungarian)
- **6**: HR (Croatian)
- **7**: SI (Slovenian)

### SQL Commands to Execute

1. **Insert Admin User**
   ```sql
   INSERT INTO admins (first_name, last_name, phone_number, email_address, country_id, status_id, password)
   VALUES ('admin_first_name', 'admin_last_name', 'admin_phone_number', 'admin_email', 1, 1, '$2a$10$0URI0A5xTpSc7GNis/BGT.cdzBrZfQgAMFwy.ChxVn/952YH0tswi');
   ```
   > **Default Password**: `123456789B`

2. **Assign Head Admin Role**
   ```sql
   INSERT INTO admins_roles_roles (admin_id, role_id) VALUES (1, 1);
   ```

> **⚠️ IMPORTANT**: After logging in to the admin application, remember to **change the default password** immediately!

## 6. Minimum System Requirements ⚙️

- **CPU**: 4–8 threads
- **RAM**: 8–16 GB
- **Free Disk Space**: 20GB

## 7. Technology Stack 🛠️

- **Backend Service**: Typescript, Nest.js
- **Database Services**: PostgreSQL
- **Machine Learning Services**: Python
