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

The frontend currently calls the API at `http://localhost:8080/api`.

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

## Deployment notes

No hosting provider has been configured yet. Before deploying publicly, the app needs a production database with persistent storage, a stable secret for signing JWTs, and backend CORS settings that allow the deployed frontend's origin. The frontend API URL must also point to the deployed backend rather than `localhost`.

These deployment settings have not been configured in this repository. Choose a hosting provider and database first; deployment should not use the local in-memory H2 database because its data is temporary.
