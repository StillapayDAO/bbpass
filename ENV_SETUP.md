# Environment Setup Guide

## Overview
This application uses Manus OAuth for authentication. You need to configure several environment variables to run the development server.

## Environment Variables

### Required Variables

#### `OAUTH_SERVER_URL`
The URL of your Manus OAuth server.
- **Development**: Usually `http://localhost:8080` if running locally
- **Production**: Your production Manus OAuth server URL

#### `VITE_APP_ID`
Your application ID from Manus OAuth.
- Get this when you register your application with Manus

#### `JWT_SECRET`
Secret key used for signing JWT session tokens.
- In development: Use any random string (minimum 32 characters recommended)
- In production: Use a strong, randomly generated secret

#### `DATABASE_URL`
PostgreSQL database connection string.
- Format: `postgresql://user:password@host:port/database`
- Development example: `postgresql://dev:dev@localhost:5432/bbpass`

### Optional Variables

#### `OWNER_OPEN_ID`
OpenID of the application owner (for admin purposes).

#### `BUILT_IN_FORGE_API_URL`
Forge API endpoint URL (if using Forge integration).

#### `BUILT_IN_FORGE_API_KEY`
API key for Forge integration.

## Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure for Development
Edit `.env.local` with your local development values:

```env
OAUTH_SERVER_URL=http://localhost:8080
VITE_APP_ID=your-dev-app-id
JWT_SECRET=your-dev-secret-key-minimum-32-chars
DATABASE_URL=postgresql://dev:dev@localhost:5432/bbpass
NODE_ENV=development
```

### 3. Set Up PostgreSQL (if not already done)
```bash
# Create database
createdb bbpass

# Run migrations (if applicable)
npm run db:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start and show you which port it's running on.

## Troubleshooting

### Error: "OAUTH_SERVER_URL is not configured"
This means the `.env.local` file is missing or the variable isn't set.
- Solution: Create `.env.local` and set `OAUTH_SERVER_URL`

### Error: "Cannot connect to database"
The DATABASE_URL is incorrect or PostgreSQL is not running.
- Solution: Verify PostgreSQL is running and the connection string is correct

### Error: "VITE_APP_ID not found"
The application ID doesn't exist in your OAuth server.
- Solution: Register your application with Manus and get a valid app ID

## Development vs Production

### Development
- Use `NODE_ENV=development`
- Use local or staging OAuth server
- Use development database
- Use any random JWT secret

### Production
- Use `NODE_ENV=production`
- Use production OAuth server
- Use production database with backups
- Use a strong, randomly generated JWT secret
- Store secrets in secure environment management (e.g., Vercel Secrets)

## Security Best Practices

1. **Never commit `.env.local`**: Add it to `.gitignore` (already done)
2. **Use strong JWT secrets**: Generate with `openssl rand -base64 32`
3. **Rotate secrets periodically**: Especially JWT_SECRET
4. **Use HTTPS in production**: Always use HTTPS for OAuth redirects
5. **Environment-specific configs**: Keep development and production configs separate
