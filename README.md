# Expense Tracker Pro

A MERN expense tracker focused on strong project-grade features:

- JWT authentication
- Income and expense management
- Budget planning with alerts
- Smart dashboard with charts
- Recurring expenses
- Custom categories and tags
- Search and advanced filters
- PDF and Excel export
- Logic-based spending insights

## Structure

- `backend` - Express + MongoDB API
- `frontend` - React + Vite dashboard

## Run

1. Install dependencies in both apps.
2. Copy `.env.example` files to `.env`.
3. Start MongoDB.
4. Run backend, then frontend.

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Main Features Included

- Auth with signup, login, JWT, and password hashing
- Add, edit, delete income and expense transactions
- Default and custom categories with tags
- Monthly summary cards and responsive dashboard
- Recharts pie, bar, and line visualizations
- Monthly budget setup with near-limit and exceeded warnings
- Reminder system with optional email support
- Recurring expense automation through a cron job
- Date, category, amount, and keyword filters
- PDF and Excel export endpoints
- Logic-based spending insights for demo-ready AI suggestions

## Suggested Scope

This project intentionally prioritizes clean UI, a working backend, and a small set of advanced features that score well in reviews.
