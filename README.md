# HTTPServer-TS

A TypeScript-based HTTP server for user authentication, chirp posting, and more.

## Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm**
- **PostgreSQL** (running locally or remotely)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/rockefelm/HTTPServer-TS.git
   cd HTTPServer-TS
   ```
2. **Install Node.js and npm (if not already installed):**
   - On Ubuntu:
     ```bash
     sudo apt update
     sudo apt install nodejs npm
     ```
   - On other platforms, see: https://nodejs.org/en/download/
3. **Install PostgreSQL:**
   - On Ubuntu:
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - On other platforms, see: https://www.postgresql.org/download/
4. **Configure your database:**
   - Create a database named `chirpy` and a user `postgres` with password `postgres` (or adjust your `.env` accordingly).
   - Run migrations if needed:
     ```bash
     npm run generate
     ```
5. **Configure environment variables:**
   - Copy `.env.example` to `.env` and edit as needed (see below).
6. **Run the server:**
   ```bash
   npm run dev
   ```

## Dependencies & Linux Installation
- `express`: Web server framework
  ```bash
  npm install express
  ```
- `drizzle-orm`: Database ORM
  ```bash
  npm install drizzle-orm
  ```
- `postgres`: PostgreSQL client
  ```bash
  npm install postgres
  ```
- `jsonwebtoken`: JWT authentication
  ```bash
  npm install jsonwebtoken
  ```
- `bcrypt`: Password hashing
  ```bash
  npm install bcrypt
  ```
- `typescript`: TypeScript support (dev)
  ```bash
  npm install --save-dev typescript
  ```
- `vitest`: Testing framework (dev)
  ```bash
  npm install --save-dev vitest
  ```
- Other dependencies as listed in `package.json` (install with `npm install`)

## Environment Variables

Create a `.env` file in the project root. Example:
```
DB_URL="postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable"
PLATFORM="dev"
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_LIFETIME_DAYS=60
POLKA_KEY=your_polka_key
```

| Variable                      | Description                                         |
|-------------------------------|-----------------------------------------------------|
| `DB_URL`                      | PostgreSQL connection string.                       |
| `PLATFORM`                    | Deployment platform (e.g., `dev`, `prod`).          |
| `JWT_SECRET`                  | Secret for signing JWT tokens.                      |
| `REFRESH_TOKEN_LIFETIME_DAYS` | Number of days before refresh tokens expire.        |
| `POLKA_KEY`                   | Key for Polka webhook authentication.               |

## API Endpoints

### Health & Metrics
- `GET /api/healthz` — Health/readiness check.
- `GET /admin/metrics` — Server hit statistics.
- `POST /admin/reset` — Reset server state.

### User Endpoints
- `POST /api/users` — Register a new user.
- `PUT /api/users` — Update user profile.
- `POST /api/login` — Authenticate user and return JWT token.
- `POST /api/refresh` — Refresh JWT token.
- `POST /api/revoke` — Revoke a user's token/session.

### Chirp Endpoints
- `GET /api/chirps` — Retrieve all chirps.
- `GET /api/chirps/:chirpId` — Retrieve a specific chirp by ID.
- `POST /api/chirps` — Post a new chirp.
- `DELETE /api/chirps/:chirpId` — Delete a chirp by ID.

### Polka Webhook
- `POST /api/polka/webhooks` — Upgrade user to "Red" via Polka webhook.

## Logging
Server logs are written to `server.log`.

## Database
Database migrations are in `db/migrations/`. Schema is defined in `db/schema.ts`. Queries are in `db/queries/`.

## Frontend
A simple frontend is available in `src/app/`.

---

## 🤝 Contributing

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.
For more details, see the source code in the `src/` directory. Contributions welcome!
