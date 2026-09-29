# InvestorApp

InvestorApp is a demo investment portfolio application with a React/Vite frontend and a Spring Boot REST API. Users can register and log in, view sample investment products, deposit or withdraw funds, invest, review their portfolio, and filter/export transaction history.

> **Demo only:** This project is not a real financial service. It uses an in-memory H2 database by default, which loses all data whenever the backend restarts. Do not use it to store real customer or financial data.

## Technology

- Frontend: React 19, Vite 8, Axios
- Backend: Java 17+, Spring Boot 4, Spring Data JDBC
- Local database: H2 in-memory
- Authentication: JWT bearer tokens

## Requirements

- Java 17 or later
- Node.js 20.19+ or 22.12+ and npm
- Git (optional, to clone the repository)

## Run locally

Open two terminals from the repository root.

### 1. Start the backend

```powershell
cd .\investor-app
.\mvnw.cmd spring-boot:run
```

The backend starts at `http://localhost:8080`. The H2 console is available at `http://localhost:8080/h2-console` while the backend is running. The development database is in-memory and resets on restart.

### 2. Start the frontend

```powershell
cd .\frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`. Keep both terminals running.

The frontend defaults to `http://localhost:8080/api`. Set `VITE_API_URL` to the backend base URL (without `/api`) when building for another environment.

## Build and test

Frontend production build:

```powershell
cd .\frontend
npm run build
```

Frontend lint:

```powershell
cd .\frontend
npm run lint
```

Backend tests:

```powershell
cd .\investor-app
.\mvnw.cmd test
```

## Main API routes

All routes are prefixed with `/api`. Routes that act on a user account require an `Authorization: Bearer <token>` header.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | API/database health check (deployment probe) |
| `POST` | `/register` | Create an account |
| `POST` | `/login` | Sign in and obtain a token |
| `GET` | `/products` | List investment products |
| `GET` | `/portfolio` | Get account balance and portfolio |
| `POST` | `/deposit?amount=<amount>` | Deposit funds |
| `POST` | `/withdrawal?amount=<amount>` | Withdraw funds, limited to the available balance |
| `POST` | `/invest?productId=<id>&amount=<amount>` | Invest in a product |
| `GET` | `/transactions` | List and filter transactions |
| `GET` | `/transactions/export` | Download filtered transactions as CSV |

Sample investment products are inserted from `investor-app/src/main/resources/data.sql` during application startup.

## Deploy to Render

The repository includes a Render Blueprint at `render.yaml` that defines the Spring Boot API, React static site, and PostgreSQL database. The API Dockerfile is `investor-app/Dockerfile`.

1. Push this repository to GitHub.
2. Sign in to [Render](https://dashboard.render.com), choose **New > Blueprint**, and connect `Sharon-software/INVESTOR-APP` on the `main` branch.
3. Review the services and create the Blueprint. Render generates the JWT signing secret and connects the API to PostgreSQL. The frontend build gets the deployed API URL automatically.
4. After the services deploy, open the `investor-app-frontend` URL and test account registration, login, deposits, withdrawals, and investments.

The Blueprint uses Render's free plans for a demo deployment. Free web services can sleep when idle, and a free PostgreSQL database expires after 30 days; upgrade the database before that deadline to keep its data. Render's free plans are not intended for production or real financial data.

The app reads deployment configuration from environment variables: `DATABASE_URL`, `APP_JWT_SECRET`, `APP_CORS_ALLOWED_ORIGIN`, `VITE_API_URL`, and `PORT`. The local JWT secret is only a development fallback; always use the generated deployment secret. The schema and sample product seed are safe to initialize repeatedly, so restarts do not recreate or wipe tables.

**Important:** This is an educational demo, not a real financial service. Registration currently returns a demo verification code, and the app has not been security-audited. Do not enter real personal, banking, or investment data.
