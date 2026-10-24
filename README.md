# Smart Office Automation

A full-stack HR management system: employees, departments, attendance, leave, payroll and reports, with role-based access for **Admin**, **HR** and **Employee** users.

[![CI](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, React Query, axios, react-hook-form, Recharts, xlsx (Excel export) |
| Backend | ASP.NET Core Web API (.NET 10), C# |
| Data | Entity Framework Core 10, SQL Server, migrations |
| Auth | JWT bearer tokens, BCrypt password hashing, role-based authorization |
| Validation | FluentValidation, global exception middleware |
| Tests | xUnit |

## Architecture

```
SmartOffice.API          Controllers, middleware, DI, auth setup
SmartOffice.Application  Services, DTOs, interfaces, validators, typed exceptions
SmartOffice.Domain       Entities
SmartOffice.Persistence  EF Core DbContext, repositories, migrations
SmartOffice.Infrastructure  (reserved)
SmartOffice.Tests        Unit tests for the service layer
frontend/                React app
```

Controllers call services; services depend on repository interfaces (repository pattern), so business rules can be tested without a database.

### Error handling

Services throw typed exceptions and `ExceptionMiddleware` maps them to HTTP codes:

| Exception | HTTP status |
|-----------|-------------|
| `NotFoundException` | 404 |
| `ConflictException` (e.g. already checked in) | 409 |
| `BusinessRuleException` (e.g. invalid date range) | 400 |
| anything else | 500 with a generic message (details only in logs) |

## Getting started

### Prerequisites
- .NET 10 SDK
- SQL Server (LocalDB or a full instance)
- Node.js 22+

### 1. Configure the backend

`appsettings.json` does not contain secrets. Set them with user-secrets:

```bash
cd SmartOffice.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\MSSQLLocalDB;Database=SmartOffice;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:Key" "<a-random-string-of-at-least-32-characters>"
```

### 2. Create the database and run the API

```bash
dotnet ef database update --project SmartOffice.Persistence --startup-project SmartOffice.API
dotnet run --project SmartOffice.API
```

The API listens on `http://localhost:5262` (the OpenAPI document is served in Development at `/openapi/v1.json`).

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend calls the API at `http://localhost:5262/api` (see `frontend/src/api/axios.ts`); CORS is configured for the Vite dev origin.

## Running the tests

```bash
dotnet test SmartOffice.Tests
```

The tests cover check-in/check-out rules and working-hours calculation, leave creation/status/date validation, and payroll net-salary and input validation. They use in-memory fakes and a fake clock, so they need no database.

## Continuous integration

`.github/workflows/ci.yml` builds the solution and runs the tests on every push to `main` and on pull requests, and builds the frontend.

## Roles

| Role | Can do |
|------|--------|
| Admin | Everything, including deleting payroll |
| HR | Manage employees, attendance, leave approvals, payroll, reports |
| Employee | Own attendance check-in/out, own leave requests, own payroll and dashboard |
