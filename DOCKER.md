# StartupMatch Docker Setup

This project now runs with separate containers for:
- `frontend` (React + Vite)
- `backend` (Laravel API)
- `mysql` (database)
- `phpmyadmin` (database UI)
- `reverb` (Laravel realtime websocket server)
- `queue` (Laravel queue worker)

## 1. Prerequisites

- Docker Desktop installed
- WSL integration enabled (if you use WSL)
- Run commands from project root:
  - `/mnt/c/laragon/www/FindPart`

## 2. Start all services

```bash
docker compose up --build -d
```

## 3. Open services

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- phpMyAdmin: http://localhost:8081
- Reverb websocket: http://localhost:8080

## 4. Database credentials

- Host: `mysql` (inside Docker network) or `127.0.0.1` (from host machine)
- Port: `3306`
- Database: `startupmatch`
- User: `startupmatch`
- Password: `startupmatch`
- Root password: `root`

phpMyAdmin default login:
- Server: `mysql`
- Username: `root`
- Password: `root`

## 5. Useful commands

Show logs:
```bash
docker compose logs -f
```

Restart containers:
```bash
docker compose restart
```

Stop containers:
```bash
docker compose down
```

Stop and remove DB volume:
```bash
docker compose down -v
```

Run backend artisan manually:
```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

## 6. Notes

- Backend and frontend source code are mounted as volumes, so code edits update live.
- `vendor` and `node_modules` are stored in named Docker volumes for better performance.
- Reverb origin check is strict. Use `http://localhost:5173` or `http://127.0.0.1:5173` and keep both in `REVERB_ALLOWED_ORIGINS`.
- On first boot, the backend container will:
  - ensure `.env` exists,
  - install composer dependencies (if missing),
  - generate app key only if missing,
  - run migrations,
  - start Laravel server.
