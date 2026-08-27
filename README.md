# Digital Banking System API

A Node.js and Express API for customer registration, authentication, customer profiles, BVN onboarding, and account creation. MongoDB stores local customer and account records, while BVN and account operations are delegated to the configured NIBSS-compatible service.

## Requirements

- Node.js 18 or newer
- MongoDB
- Access to a NIBSS-compatible API for BVN and account operations

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file in the project root. Keep this file private and never commit it:

```env
PORT=<local-port>
MONGO_URL=<private-mongodb-connection-string>
JWT_SECRET=<private-random-signing-secret>
NIBSS_API_BASE_URL=<private-nibss-api-url>
NIBSS_AUTH_BASE_URL=<private-nibss-auth-url>
NIBSS_API_KEY=<private-nibss-api-key>
NIBSS_API_SECRET=<private-nibss-api-secret>
```

The application reads these values at startup. The README intentionally does not contain real connection strings, URLs, tokens, API keys, or secrets. Use your deployment secret manager or local environment file to provide them.

Start the server:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

When `PORT` is not set, the server uses port `5000`.

## Authentication

Register or log in to receive a JWT. Include it on protected requests:

```http
Authorization: Bearer <jwt-token>
```

## API Reference

### Health check

`GET /`

Returns a JSON response confirming that the API is running.

### Customer authentication

`POST /api/register`

```json
{
  "fullName": "Customer Name",
  "email": "customer@example.com",
  "password": "<private-password>",
  "phoneNumber": "<customer-phone-number>"
}
```

`POST /api/login`

```json
{
  "email": "customer@example.com",
  "password": "<private-password>"
}
```

Both endpoints return a JWT in the `token` field when successful.

### Customer profile

`GET /api/me`

Requires authentication and returns the current customer.

### BVN onboarding

`POST /api/bvn`

Requires authentication. Submits BVN details to the configured NIBSS service.

```json
{
  "bvn": "<customer-bvn>",
  "firstName": "Customer First Name",
  "lastName": "Customer Last Name",
  "dob": "YYYY-MM-DD",
  "phone": "<customer-phone-number>"
}
```

`POST /api/bvn/validate`

Requires authentication. A successful validation marks the customer as verified and stores the BVN locally.

```json
{
  "bvn": "<customer-bvn>"
}
```

### Accounts

`POST /api/accounts`

Requires authentication and a verified customer. Creates an account through the NIBSS service, then saves the returned account locally.

```json
{
  "kycID": "<verified-kyc-id>",
  "dob": "YYYY-MM-DD"
}
```

`GET /api/accounts/me`

Requires authentication and returns the customer's local account.

`GET /api/accounts/balance`

Requires authentication and retrieves the customer's latest balance from the NIBSS service. The local account balance is updated when the request succeeds.

`GET /api/accounts/name-enquiry/:accountNumber`

Requires authentication and returns the account name and details for the supplied destination account number.

Example:

```http
GET /api/accounts/name-enquiry/<recipient-account-number>
Authorization: Bearer <jwt-token>
```

The customer's own account number cannot be used for name enquiry. Errors returned by the NIBSS service are passed back with their corresponding HTTP status when available.

`POST /api/accounts/sync`

Requires authentication. Attempts to find the customer's existing NIBSS account and save it locally.

```json
{
  "kycID": "<verified-kyc-id>"
}
```

### NIBSS authentication

`POST /api/nibss/login`

Requests a NIBSS authentication token using the server-side environment configuration. Do not send API credentials in source code or client requests.

### NIN onboarding

`POST /api/nin`

Requires authentication. This route is reserved for future NIN onboarding and is not implemented yet.

## Project Structure

```text
Config/       Database configuration
Controller/   Request handlers
Middleware/   JWT authentication middleware
Model/        Mongoose schemas
Route/        Express route definitions
Services/     NIBSS API integration
utility/      Shared utilities
app.js        Express application setup
server.js     Database connection and server startup
```

## Security Notes

- Add `.env` to `.gitignore` before storing local credentials.
- Never commit database connection strings, JWT secrets, API keys, API secrets, or access tokens.
- Rotate any credential that has been exposed in source control, logs, screenshots, or chat.
- Use different credentials for development, testing, and production.

## Current Limitations

- NIN onboarding is not implemented.
- Automated tests are not currently included.
- Account creation depends on the configured NIBSS-compatible service being available.

## License

ISC
