# Express File Manager Documentation

## Overview

**Express File Manager** is a lightweight, containerized REST API built with Node.js and Express for file management operations. It supports user authentication, file/folder operations (list, upload, move, copy, delete, create directory), and exposes endpoints for both a general file system and a web root directory. The project is Docker-ready and supports ARM builds.

---

## Architecture

### High-Level Architecture Diagram

```mermaid
graph TD
    Client[Client (Browser/Postman)]
    API[Express File Manager API]
    Auth[Authentication Controller]
    FileMgr[File Manager Controller]
    WebMgr[Web Controller]
    DB[Static In-Memory DB]
    FS[File System]
    ENV[Environment Variables]

    Client -->|HTTP Requests| API
    API -->|/login, /signup| Auth
    API -->|/files, /upload, etc.| FileMgr
    API -->|/web/files, /web/upload, etc.| WebMgr
    Auth --> DB
    FileMgr --> FS
    WebMgr --> FS
    API --> ENV
```

### Main Components

- **Controllers**: Route HTTP requests to services.
  - `src/controllers/authentication.controller.ts`
  - `src/controllers/fileManager.controller.ts`
  - `src/controllers/web.controller.ts`
- **Services**: Business logic for authentication, user, and file operations.
  - `src/services/authentication.service.ts`
  - `src/services/user.ts`
  - `src/services/file.service.ts`
- **Middlewares**: Logging and authentication.
  - `src/middlewares/logger.ts`
  - `src/middlewares/authentication.middleware.ts`
- **Database**: In-memory static user DB.
  - `src/db/static-db.ts`
- **Utilities**: Common helpers and constants.
  - `src/utils/commons.ts`
  - `src/utils/constants.ts`
  - `src/utils/types.ts`

---

## Setup & Commands

### Install Dependencies

```sh
npm install
```

### Start the Server

```sh
npm run start
```

### Build the Project

```sh
npm run build
```

### Run with Docker

```sh
docker-compose up
```

---

## Environment Variables

- `BASE_DIR`: Root directory for file manager operations (default: `/usr/local/`)
- `WEB_DIR`: Root directory for web operations (default: `/var/www/html`)

---

## API Documentation

### Authentication

#### `POST /login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "001",
    "email": "user@example.com",
    "token": "<JWT>"
  }
}
```

#### `POST /signup`
Register a new user.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password"
}
```
**Response:**
```json
{
  "id": "generated-uuid",
  "email": "user@example.com",
  "password": "password",
  "name": "User Name"
}
```

---

### File Manager API (Requires Authentication)

#### `GET /files?path=<path>`
List files and folders at the specified path.

**Response:**
```json
{
  "message": "hey from files",
  "files": [
    {
      "id": "file.txt",
      "name": "file.txt",
      "type": "file",
      "size": 1234,
      "createdAt": "2024-06-01T12:00:00.000Z"
    }
  ]
}
```

#### `POST /create/directory`
Create a new directory.

**Request Body:**
```json
{
  "dirname": "new-folder",
  "path": "/parent-folder"
}
```

#### `POST /upload/file`
Upload a file (multipart/form-data, field name: `file`).

#### `POST /copy`
Copy a file or folder.

**Request Body:**
```json
{
  "src": "/source/path",
  "dest": "/destination/path"
}
```

#### `POST /move`
Move a file or folder.

**Request Body:**
```json
{
  "src": "/source/path",
  "dest": "/destination/path"
}
```

#### `POST /delete`
Delete a file or folder.

**Request Body:**
```json
{
  "path": "/path/to/delete"
}
```

---

### Web Root File Manager

All endpoints are prefixed with `/web` and mirror the File Manager API, but operate on the web root directory.

Example: `GET /web/files?path=/`

---

## References

- `src/index.ts`
- `src/controllers/authentication.controller.ts`
- `src/controllers/fileManager.controller.ts`
- `src/controllers/web.controller.ts`
- `src/services/authentication.service.ts`
- `src/services/file.service.ts`
- `src/services/user.ts`
- `src/db/static-db.ts`
- `src/utils/constants.ts`
- `src/utils/commons.ts`
- `src/utils/types.ts`

---

