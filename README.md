# Rain or Shine

Strava activity weather integration monorepo containing both the Express backend API and React frontend application.

## Project Structure

```
rain-or-shine/
├── apps/
│   ├── client/          # React frontend application
│   └── server/          # Express backend API
├── package.json         # Root package.json with workspaces
├── railway.json         # Railway deployment configuration
└── nixpacks.toml       # Nixpacks build configuration
```

## Prerequisites

- Node.js >= 22.11.0
- npm >= 10.0.0
- PostgreSQL database
- Strava API credentials
- OpenWeatherMap API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rain-or-shine.git
cd rain-or-shine
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment example file and configure:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
   - Database URL
   - Strava API credentials
   - OpenWeatherMap API key
   - Session secret (minimum 32 characters)

5. Run database migrations:
```bash
npm run migrate
```

## Development

Start both the server and client in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:server  # Backend on http://localhost:3001
npm run dev:client  # Frontend on http://localhost:5173
```

## Available Scripts

### Root Level
- `npm run dev` - Start both server and client in development mode
- `npm run build` - Build both server and client for production
- `npm run start` - Start the server in production mode
- `npm run lint` - Run linting for both projects
- `npm run typecheck` - Run TypeScript type checking for both projects
- `npm run test` - Run server tests
- `npm run migrate` - Run database migrations

### Client (`@rain-or-shine/client`)
- `npm run dev:client` - Start the frontend development server
- `npm run build:client` - Build the frontend for production
- `npm run preview:client` - Preview the production build locally
- `npm run lint:client` - Run ESLint on frontend code
- `npm run typecheck:client` - Type check frontend code

### Server (`@rain-or-shine/server`)
- `npm run dev:server` - Start the backend development server
- `npm run build:server` - Build the backend for production
- `npm run start:server` - Start the backend in production mode
- `npm run lint:server` - Run ESLint on backend code
- `npm run typecheck:server` - Type check backend code
- `npm run test` - Run backend tests
- `npm run migrate` - Run database migrations

## Deployment to Railway

This monorepo is configured for deployment on Railway:

1. Connect your GitHub repository to Railway
2. Set up environment variables in Railway dashboard
3. Railway will automatically:
   - Install dependencies for both workspaces
   - Build both the server and client
   - Copy the client build to the server's public directory
   - Start the server which serves both the API and static files

### Required Environment Variables for Railway

- `NODE_ENV=production`
- `DATABASE_URL` - PostgreSQL connection string
- `STRAVA_CLIENT_ID` - Your Strava app client ID
- `STRAVA_CLIENT_SECRET` - Your Strava app client secret
- `STRAVA_WEBHOOK_VERIFY_TOKEN` - Random string for webhook verification
- `OPENWEATHERMAP_API_KEY` - Your OpenWeatherMap API key
- `SESSION_SECRET` - Random string (minimum 32 characters)
- `APP_URL` - Your Railway app URL (e.g., https://your-app.up.railway.app)

### Railway Configuration

The deployment is configured via:
- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build process configuration
- Root `package.json` - npm workspaces and scripts

## Architecture

### Backend (`/apps/server`)
- Express.js server with TypeScript
- PostgreSQL database with Kysely ORM
- Session-based authentication
- Strava OAuth integration
- OpenWeatherMap API integration
- RESTful API design

### Frontend (`/apps/client`)
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication

## License

MIT