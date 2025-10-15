# Flight Logbook Application

A POC full-stack flight logging application for pilots to track flight hours, routes, and statistics.

## Quick Start (Mac)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running


### Running Locally

1. **Clone the repository:**

```bash
git clone <repo-url>
cd flight-logbook
```

2. **Start the application:**

```bash
./start.sh
```

The script will:
  - Start PostgreSQL database
  - Start the backend API
  - Start the frontend
  - Run database migrations
  - Seed sample data
3. **Open in your browser:**
    - **Frontend:** http://localhost:5173
    - **Backend API:** http://localhost:3000/api

### Stopping the Application

```bash
docker-compose down
```


***

## Features

- Log flights with date, departure/arrival airports, aircraft type, and hours
- Track day/night hours and solo flights
- Dashboard with real-time statistics and totals
- Full CRUD operations (Create, Read, Update, Delete)
- Automatic calculation of flight totals

***

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL 15
- **DevOps:** Docker + Docker Compose

***

## TODOs

- [ ] Complete repository layer unit tests (currently skipped - see `backend/tests/TODO.md`)
- [ ] End-to-end integration tests
- [ ] CI/CD pipeline (GitHub Actions)

***

