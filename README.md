# Digital Banking System API

A Node.js and Express API for customer registration, authentication, profile access, and BVN/NIN onboarding. Customer data is stored in MongoDB, and BVN operations are delegated to the NIBSS integration service.

## Requirements

- Node.js 18 or newer
- MongoDB database
- NIBSS API credentials and base URL for BVN operations

## Installation

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/digital-banking-system
JWT_SECRET=replace-with-a-long-random-secret
NIBSS_API_BASE_URL=https://your-nibss-api.example.com
NIBSS_AUTH_BASE_URL=https://your-nibss-auth.example.com
NIBSS_API_KEY=your-nibss-api-key
NIBSS_API_SECRET=your-nibss-api-secret
```

Start the API in production mode:

```bash
npm start
```

Start with automatic restarts during development:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## API Endpoints

All endpoints are prefixed with `/api`, except the health check.

### Health check

`GET /`

Returns:

```json
{
  "message": "Digital Banking Api is running"
}
```

### Register a customer

`POST /api/register`

Request body:

```json
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "secure-password",
  "phoneNumber": "08012345678"
}
```

A successful response includes a JWT in the `token` field.

### Log in

`POST /api/login`

Request body:

```json
{
  "email": "ada@example.com",
  "password": "secure-password"
}
```

### Get the current customer

`GET /api/me`

Requires authentication:

```http
Authorization: Bearer <jwt-token>
```

### Create or submit BVN details

`POST /api/bvn`

Requires authentication.

Request body:

```json
{
  "bvn": "12345678901",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "dob": "1815-12-10",
  "phone": "08012345678"
}
```

### Validate a BVN

`POST /api/bvn/validate`

Requires authentication.

Request body:

```json
{
  "bvn": "12345678901"
}
```

### NIN onboarding

`POST /api/nin`

Requires authentication. This route is currently a placeholder and does not yet process NIN data.

## Authentication

Protected routes require the JWT returned by registration or login. Send it in the `Authorization` header using the Bearer scheme:

```http
Authorization: Bearer <jwt-token>
```

## Project Structure

```text
Config/       Database configuration
Controller/   Request handlers
Middleware/   JWT authentication middleware
Model/        Mongoose schemas
Route/        Express route definitions
Services/     NIBSS API integration
utility/      Shared utilities such as token generation
app.js        Express application setup
server.js     Database connection and server startup
```

## Current Limitations

- NIN onboarding is not implemented yet.
- BVN validation should use the `bvn` request field consistently.
- The project does not currently include automated tests.

## License

ISC
