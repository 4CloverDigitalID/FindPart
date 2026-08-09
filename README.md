# FindPart

FindPart adalah aplikasi web dengan arsitektur **Laravel (backend) + React/Vite (frontend)**, dilengkapi **MySQL**, **Laravel Reverb** untuk realtime/websocket, queue worker, dan **phpMyAdmin** — semuanya dijalankan lewat Docker Compose.

> Catatan: nama internal service di `docker-compose.yml` masih memakai prefix `startupmatch-*`, kemungkinan sisa dari nama project sebelumnya.

## 🧱 Tech Stack

- **Backend:** Laravel (PHP), Composer
- **Frontend:** React + Vite
- **Database:** MySQL 8.4
- **Realtime:** Laravel Reverb (WebSocket)
- **Queue:** Laravel Queue (database driver)
- **DB Admin:** phpMyAdmin
- **Container:** Docker & Docker Compose

## 📁 Struktur Folder

```
FindPart/
├── backend-find-part/     # Laravel backend
├── frontend/               # React + Vite frontend
├── docker-compose.yml
├── DOCKER.md
└── .gitignore
```

## 🚀 Menjalankan Project (Docker)

### Prasyarat
- Docker & Docker Compose sudah terinstall

### Langkah

1. Clone repository:
   ```bash
   git clone https://github.com/4CloverDigitalID/FindPart.git
   cd FindPart
   ```

2. Jalankan seluruh service:
   ```bash
   docker compose up -d
   ```

   Compose akan otomatis:
   - Install dependency Composer (backend) & npm (frontend)
   - Copy `.env.example` → `.env` jika belum ada
   - Generate `APP_KEY`
   - Menjalankan migrasi database
   - Menjalankan `storage:link`

3. Akses aplikasi:

   | Service | URL | Keterangan |
   |---|---|---|
   | Frontend | http://localhost:5173 | React + Vite dev server |
   | Backend API | http://localhost:8000 | Laravel API |
   | Reverb (WebSocket) | ws://localhost:8080 | Realtime broadcasting |
   | phpMyAdmin | http://localhost:8081 | Login: `root` / `root` |
   | MySQL | localhost:3306 | DB: `startupmatch`, user/pass: `startupmatch` |

### Untuk info lebih detail seputar Docker
Lihat [`DOCKER.md`](./DOCKER.md).

## ⚙️ Service yang Berjalan

- `backend_init` — inisialisasi (composer install, siapkan `.env`)
- `backend` — Laravel API server (port 8000)
- `frontend` — React/Vite dev server (port 5173)
- `reverb` — WebSocket server untuk broadcasting realtime (port 8080)
- `queue` — worker untuk memproses job antrian
- `mysql` — database (port 3306)
- `phpmyadmin` — GUI database (port 8081)

## 🔧 Environment Variables (default dari compose)

**Backend / Reverb / Queue:**
```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=startupmatch
DB_USERNAME=startupmatch
DB_PASSWORD=startupmatch
BROADCAST_CONNECTION=reverb
QUEUE_CONNECTION=database
REVERB_APP_ID=startupmatch
REVERB_APP_KEY=startupmatch-key
REVERB_APP_SECRET=startupmatch-secret
```

**Frontend:**
```
VITE_API_URL=http://localhost:8000/api
VITE_REVERB_APP_KEY=startupmatch-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## 🛠️ Perintah Berguna

```bash
# Stop semua service
docker compose down

# Lihat log salah satu service
docker compose logs -f backend

# Masuk ke container backend
docker compose exec backend sh

# Jalankan artisan command
docker compose exec backend php artisan migrate:fresh --seed
```

## 📄 Lisensi

Belum ditentukan.
