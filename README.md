# Primăria Pociumbăuți - Digital Portal

Официальный сайт примарии села Покумбауць, разработанный согласно HG 728/2023.

## 🚀 Технологии

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Node.js + Express.js
- **База данных:** MySQL 9.4
- **Контейнеризация:** Docker & Docker Compose

## 📦 Быстрый старт

### Docker Compose (рекомендуется)

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Логи
docker-compose logs -f
```

**Доступ:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MySQL: localhost:3375

### Локальная разработка

1. **Установить зависимости:**
```bash
npm install
```

2. **Настроить базу данных:**
```bash
# Запустить MySQL
docker-compose up -d db

# Применить схему
docker exec -i primaria_pociumbauti_mysql mysql -u pociumbauti_admin -padmin_pociumbauti primaria_db < database/schema.sql
```

3. **Запустить сервисы:**
```bash
# Backend + Frontend вместе
npm run dev:all

# Или отдельно:
# Backend (терминал 1)
npm run dev:server

# Frontend (терминал 2)
npm run dev
```

## 🔐 Админ панель

- **URL:** http://localhost:3000/admin
- **Логин:** `admin`
- **Пароль:** `primaria_pociumbauti2026`

## 📁 Структура проекта

```
├── backend/              # Node.js Backend
│   ├── config/          # Конфигурация БД
│   ├── helpers/         # Вспомогательные функции
│   │   ├── auth.js      # Аутентификация
│   │   ├── csrf.js      # CSRF защита
│   │   ├── upload.js    # Загрузка файлов
│   │   └── admin.js     # Админ функции
│   └── routes/          # API роуты
│       ├── auth.js      # /auth/*
│       ├── api.js       # /api/*
│       └── admin.js     # /admin/*
├── pages/               # React компоненты страниц
├── components/          # React компоненты
├── public/              # Статические файлы
│   └── uploads/         # Загруженные файлы
├── database/            # SQL схемы
├── server.js            # Express сервер
└── docker-compose.yml   # Docker конфигурация
```

## 📡 API Endpoints

### Публичные
- `GET /api/announcements?limit=6&prioritate=1` - Получить объявления

### Авторизация
- `POST /auth/login` - Вход
- `POST /auth/logout` - Выход
- `GET /auth/status` - Статус авторизации
- `GET /auth/csrf` - CSRF токен

### Админ (требует авторизации)
- `GET /admin/dashboard` - Дашборд
- `GET /admin/anunturi` - Список объявлений
- `POST /admin/anunturi/publish` - Создать объявление
- `POST /admin/anunturi/edit` - Редактировать объявление
- `GET /admin/audit` - Лог действий

## 🔧 Переменные окружения

Создайте `.env` файл:

```env
DB_HOST=db
DB_PORT=3306
DB_NAME=primaria_db
DB_USER=pociumbauti_admin
DB_PASSWORD=admin_pociumbauti
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key-here
```

## 📝 Скрипты

- `npm run dev` - Запустить React dev server
- `npm run dev:server` - Запустить Express backend
- `npm run dev:all` - Запустить оба сервиса
- `npm run build` - Собрать production build
- `npm start` - Запустить production server

## 🛑 Остановка

```bash
# Docker
docker-compose down

# Локально
# Нажмите Ctrl+C в терминалах
```

## 📚 Дополнительная документация

- [QUICK_START_JS.md](./QUICK_START_JS.md) - Подробная инструкция по запуску
- [README_BACKEND.md](./README_BACKEND.md) - Документация по Backend API

## 🔒 Безопасность

- CSRF защита для всех форм
- Bcrypt хеширование паролей
- Сессии с httpOnly cookies
- Rate limiting для логина
- SQL injection защита (prepared statements)

## 📄 Лицензия

Проект разработан для Primăria Pociumbăuți согласно HG 728/2023.
