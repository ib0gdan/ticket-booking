# Ticket Booking App

## Требования

- Node.js (LTS версия)
- npm/yarn package manager

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:

```bash
npm install
# or yarn install
```

## Настройка окружения

Проект использует переменные окружения. Пример файла конфигурации находится в `.env.development`.
Основная переменная:

- `VITE_API_BASE_URL` - URL API сервера (по умолчанию `http://localhost:3022`)

## Запуск

### Режим разработки

Запуск dev-сервера:

```bash
npm run dev
# or yarn dev
```

### Сборка для продакшена

Сборка приложения с проверкой типов:

```bash
npm run build
# or yarn build
```

### Предпросмотр сборки

Запуск локального сервера для проверки собранного приложения:

```bash
npm run preview
# or yarn preview
```

## Стек технологий

- **Vue 3** (Composition API)
- **Vue Router**
- **TypeScript**
- **Vite**
- **Pinia**
- **TanStack Query**
- **Tailwind CSS**
- **Axios**
- **Vue Validate**
