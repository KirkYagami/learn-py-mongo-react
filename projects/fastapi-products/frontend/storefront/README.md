# Storefront — FastAPI Products Frontend

React + TypeScript + Vite frontend for the FastAPI Products API.

## Stack
- **Vite** + **React 19** + **TypeScript**
- **Zustand** — auth + theme state management
- **Axios** — API client with JWT interceptor
- **React Router v7** — client-side routing
- **Lucide React** — icons

## Setup

**Requirements:** Node 18+ (tested on Node 22)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Configuration

Edit `.env` to point at your backend:

```
VITE_API_URL=http://localhost:8000
```

## Features
- **Auth** — Login / Register with JWT (stored in localStorage + Zustand)
- **Dashboard** — stats overview: product count, stock status, categories, sellers
- **Products** — search, filter by category & stock, create (auth required), delete (auth required)
- **Sellers** — view all registered sellers
- **Theme toggle** — light (default) / dark, persisted across sessions
- **Rate limit awareness** — shows a friendly banner when hitting the 3 req/min limit on products
- **Toast notifications** — success/error feedback on all actions

## Routing
| Path | Access | Description |
|------|--------|-------------|
| `/` | Auth required | Dashboard |
| `/products` | Public | Browse + manage products |
| `/sellers` | Public | View sellers |
| `/login` | Guest only | Sign in |
| `/register` | Guest only | Create seller account |

## Notes
- The `update_product` endpoint (`PATCH /products/:id`) is a stub in the backend — the edit feature will activate once you implement it.
- Prices are stored in paise/cents (integers). The UI converts: `₹9.99` → `999`.
- The products list has a backend rate limit of 3 req/60s. The frontend debounces search by 300ms to minimize hits.
