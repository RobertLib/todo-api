# Todo API

Modern REST API built with Express.js, TypeScript, PostgreSQL, and JWT authentication.

## Features

- ✅ User registration and authentication with JWT
- ✅ CRUD operations for todos
- ✅ User isolation - users can only access their own todos
- ✅ Policy-based authorization system
- ✅ PostgreSQL database with native `pg` driver
- ✅ TypeScript for type safety
- ✅ Clean architecture with separation of concerns
- ✅ Custom validation without external libraries
- ✅ Comprehensive error handling
- ✅ Extensive test coverage with Jest
- ✅ **Rate limiting** - Protection against API abuse
- ✅ **CORS support** - Configurable cross-origin resource sharing
- ✅ **Structured logging** - JSON logging with Pino
- ✅ **API documentation** - Interactive OpenAPI/Swagger documentation

## Project Structure

```
src/
├── __tests__/       # Test files mirroring project structure
│   ├── controllers/      # Unit tests for controllers
│   ├── integration/      # Integration tests for API endpoints
│   ├── policies/         # Unit tests for policies
│   ├── services/         # Unit tests for services
│   └── validators/       # Unit tests for validators
├── config/          # Configuration (database, logger, swagger)
├── controllers/     # Request handlers
├── middleware/      # Authentication, rate limiting, and error handling
├── models/          # Database communication layer
├── policies/        # Authorization policies
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript interfaces
└── validators/      # Input validation
```

## Prerequisites

- Node.js 18+
- PostgreSQL 12+

## Setup

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your values:

   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `PORT`: Server port (default: 3000)
   - `CORS_ORIGIN`: Allowed origins for CORS (default: `*` for all origins)
   - `LOG_LEVEL`: Logging level (default: `info`, options: `debug`, `info`, `warn`, `error`)
   - `NODE_ENV`: Environment (default: `development`)
   - `JWT_EXPIRES_IN`: JWT token expiration (default: `7d`)

4. **Create database**

   ```bash
   createdb todo_api
   ```

5. **Run migrations**

   ```bash
   npm run db:migrate
   ```

6. **Seed database (optional)**

   ```bash
   npm run db:seed
   ```

   This will create a test user and sample todos:

   - Email: `test@example.com`
   - Password: `password123`

7. **Start development server**

   ```bash
   npm run dev
   ```

   The server will start on http://localhost:3000 with the following endpoints:

   - API: http://localhost:3000/api
   - Health Check: http://localhost:3000/health
   - **API Documentation: http://localhost:3000/api-docs** 📚

## API Documentation

Interactive API documentation is available via Swagger UI at `/api-docs` when the server is running.

Visit http://localhost:3000/api-docs to:

- Browse all available endpoints
- View request/response schemas
- Try out API calls directly from the browser
- See authentication requirements
- Check rate limiting information

## API Endpoints

### Authentication

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "created_at": "2025-11-11T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Todos (Authenticated)

All todo endpoints require `Authorization: Bearer <token>` header.

#### Create Todo

```
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

#### Get All Todos

```
GET /api/todos
Authorization: Bearer <token>
```

#### Get Single Todo

```
GET /api/todos/:id
Authorization: Bearer <token>
```

#### Update Todo

```
PATCH /api/todos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Todo

```
DELETE /api/todos/:id
Authorization: Bearer <token>
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with test data
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Deployment on Render

The project includes a `render.yaml` configuration file for easy deployment on [Render](https://render.com).

### Automatic Deployment

1. **Connect your repository to Render**

   - Create a new account or log in to [Render](https://render.com)
   - Click "New +" and select "Blueprint"
   - Connect your GitHub/GitLab repository
   - Render will automatically detect the `render.yaml` file

2. **Configure environment variables**

   The following environment variables will be automatically configured:

   - `DATABASE_URL` - Automatically set from the PostgreSQL database
   - `JWT_SECRET` - Automatically generated
   - `NODE_ENV` - Set to `production`
   - `PORT` - Set to `10000`

   You can customize these in the Render dashboard if needed:

   - `CORS_ORIGIN` - Set to your frontend URL (e.g., `https://your-app.com`)
   - `JWT_EXPIRES_IN` - Token expiration time (default: `7d`)
   - `LOG_LEVEL` - Logging level (default: `info`)

3. **Deploy**

   - Click "Apply" to create the services
   - Render will:
     - Create a PostgreSQL database
     - Build your application (`npm install && npm run build`)
     - Run database migrations (`npm run db:migrate`)
     - Start the server (`npm start`)

4. **Access your API**

   Once deployed, your API will be available at:

   - `https://your-app-name.onrender.com/api`
   - API Documentation: `https://your-app-name.onrender.com/api-docs` (disabled in production by default)

### Manual Deployment

If you prefer manual configuration:

1. **Create PostgreSQL Database**

   - In Render dashboard, click "New +" → "PostgreSQL"
   - Choose a name (e.g., `todo-db`)
   - Select region and plan
   - Note the internal database URL

2. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure:
     - **Build Command**: `npm install && npm run build && npm run db:migrate`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       - `DATABASE_URL`: Internal database URL from step 1
       - `JWT_SECRET`: Generate a secure random string
       - `NODE_ENV`: `production`
       - `CORS_ORIGIN`: Your frontend URL

### Post-Deployment

- **Health Check**: Visit `https://your-app-name.onrender.com/health` to verify the service is running
- **Logs**: Check the Render dashboard for application logs
- **Auto-Deploy**: Render will automatically redeploy when you push to your main branch
- **Database Migrations**: Migrations run automatically on each deployment via the build command

### Important Notes

- Free tier databases on Render expire after 90 days
- Free tier web services spin down after 15 minutes of inactivity
- The first request after spin-down may take 30-60 seconds
- Consider upgrading to paid plans for production applications

## Testing

The project includes comprehensive test coverage with unit and integration tests:

- **Unit Tests** - Test individual components in isolation

  - Models - Database operations (create, read, update, delete)
  - Middleware - Authentication and error handling
  - Policies - Authorization logic
  - Validators - Input validation
  - Services - Business logic
  - Controllers - Request handling

- **Integration Tests** - Test complete API flows
  - Authentication endpoints (register, login)
  - Todo CRUD operations
  - Authorization checks
  - Error scenarios

Run `npm run test:coverage` to see current coverage statistics.

## Architecture

The application follows a clean, layered architecture:

### Models

Database communication layer using the `pg` driver. Handle CRUD operations and data persistence.

### Services

Business logic layer. Orchestrate data flow between models and controllers, enforce authorization policies, and transform data.

### Policies

Authorization layer. Centralized logic for determining user permissions and access control.

### Validators

Input validation layer. Validate request data and return detailed error messages.

### Controllers

HTTP request handling layer. Coordinate validation, service calls, and response formatting.

### Middleware

- **Authentication** - JWT token verification
- **Rate Limiting** - Protection against API abuse
  - Auth endpoints: 5 requests per 15 minutes
  - Todo creation: 10 requests per minute
  - General API: 100 requests per 15 minutes
- **CORS** - Configurable cross-origin resource sharing
- **Security Headers** - Helmet middleware for HTTP security (production only)
- **Logging** - Structured JSON logging with Pino
- **Error handling** - Consistent error responses

## Security

- **Password hashing** with bcrypt (10 salt rounds)
- **JWT-based authentication** with configurable expiration
- **Policy-based authorization** for resource access control
- **User data isolation** - users can only access their own todos
- **SQL injection prevention** with parameterized queries
- **Input validation** on all endpoints
- **Rate limiting** to prevent brute force and DDoS attacks
- **CORS configuration** for secure cross-origin requests
- **Security headers** - Helmet middleware in production (CSP, X-Frame-Options, etc.)
- **Request size limiting** - Maximum 10KB payload to prevent DoS
- **Environment validation** - Required variables checked at startup
- **Production security** - API docs hidden in production
- **Structured logging** for security monitoring and auditing

## Performance & Monitoring

- **Connection pooling** with configurable pool size (max 20 connections)
- **Request/response logging** with execution time tracking
- **Structured JSON logs** for easy parsing and monitoring
- **Health check endpoint** for service monitoring
- **Rate limiting** headers for client feedback
- **Request size limits** (10KB) for performance optimization

## License

MIT
