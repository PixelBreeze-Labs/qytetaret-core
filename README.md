# Qytetaret Core API

> Backend service for Qytetaret, a community reporting platform built with NestJS. This project provides the core API services for both PWA and mobile applications.

## Development Setup

### Prerequisites

- Node.js (v18+)
- MongoDB
- Cursor IDE (recommended) or VS Code
- yarn (recommended) or npm

```bash
# 1. Install dependencies
yarn

# 2. Create Environment variables file
cp .env.example .env

# 3. Run development server
yarn start:dev

# 4. API will be available at http://localhost:3000
```

## IDE Setup

### Cursor IDE (Recommended)
- Project comes with predefined `.cursorrules` for AI-assisted development
- Follows project's code style and conventions
- Integrated with project's TypeScript configuration

### VS Code
Project includes preconfigured VS Code settings:
- settings.json: Editor configurations
- tasks.json: Build tasks (maybe not included in git)
- launch.json: Debug configurations  (maybe not included in git)
- extensions.json: Recommended extensions  (maybe not included in git)

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  
- **API Features**
  - User management
  - Post creation and management
  - Media upload (AWS S3)
  - Community reporting
  
- **Technical Features**
  - TypeScript support
  - MongoDB with Mongoose
  - OpenAPI documentation (Swagger)
  - Environment configuration
  - Error handling
  - Request validation
  - Testing setup

## Development

```bash
# Development
yarn start:dev

# Build
yarn build:prod

# Run tests
yarn test

# Run e2e tests
yarn test:e2e

# Lint code
yarn lint

# Format code
yarn format
```

## API Documentation

- Development: http://localhost:3000/documentation
- Swagger UI with all available endpoints
- Authentication details
- Request/Response examples

## Project Structure

```
src/
  ├── auth/         # Authentication & authorization
  ├── users/        # User management
  ├── posts/        # Post management
  ├── media/        # Media handling
  ├── common/       # Shared resources
  └── config/       # Configuration
```

## Environment Variables

Copy `.env.example` to `.env` and adjust values:
- `PORT`: API port (default: 3000)
- `MONGODB_URL`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `AWS_*`: AWS credentials for S3

## Testing

```bash
# Unit tests
yarn test

# e2e tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## Documentation

See the `docs` folder for detailed documentation on:
1. Architecture
2. API Specifications
3. Database Schema
4. Security Implementation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.