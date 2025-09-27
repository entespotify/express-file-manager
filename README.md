# Express File Manager Documentation

## Overview

**Express File Manager** is a lightweight, containerized REST API built with Node.js and Express for file management operations. It supports user authentication, file/folder operations (list, upload, move, copy, delete, create directory), and exposes endpoints for both a general file system and a web root directory. The project is Docker-ready and supports ARM builds.

---

## Architecture

### High-Level Architecture Diagram

Simple Architecture Diagram:

```
+---------------------+
|  Client (Browser)   |
+---------------------+
           |
           v
+-----------------------------+
|   Express File Manager API  |
+-----------------------------+
      |        |        |
      v        v        v
  Auth   FileMgr   WebMgr
   |        |        |
   v        v        v
  DB      FS       FS
            |
           ENV
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

The following environment variables are required for the application:

- **File Manager Configuration**:
  - `BASE_DIR`: Root directory for file manager operations (default: `/usr/local/`).
  - `WEB_DIR`: Root directory for web operations (default: `/var/www/html`).

- **Authentication Configuration**:
  - `AUTH_SERVER_ADDRESS`: The base URL of the authentication server.
  - `AUTH_CLIENT_ID`: The client ID for the authentication server.
  - `AUTH_CLIENT_SECRET`: The client secret for the authentication server.

---

## API Documentation

### Authentication

#### `POST /login`
Generates an authorization URL for user login.

**Request Body:**
```json
{
  "redirectUri": "http://localhost:3000/callback",
  "scope": "read write"
}
```

**Response:**
```json
{
  "authUrl": "http://auth-server/o/authorize?client_id=...",
  "state": "random-generated-state"
}
```

#### `POST /callback`
Handles the callback from the authorization server and exchanges the authorization code for tokens.

**Request Body:**
```json
{
  "code": "authorization-code",
  "redirectUri": "http://localhost:3000/callback",
  "state": "random-generated-state"
}
```

**Response:**
```json
{
  "accessToken": "<access_token>",
  "refreshToken": "<refresh_token>",
  "idToken": "<id_token>"
}
```

#### `POST /refresh`
Refresh an access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "<refresh_token>"
}
```

**Response:**
```json
{
  "accessToken": "<new_access_token>",
  "refreshToken": "<new_refresh_token>"
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

#### `GET /download?path=<path>`
Download a file from the specified path.

**Response:**
- Returns the file as a downloadable attachment.

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
- `src/utils/constants.ts`
- `src/utils/commons.ts`
---

