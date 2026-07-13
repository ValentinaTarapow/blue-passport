# The Blue Passport

Headless React frontend for the **International Blue Economy Association** — a premium, maritime-themed website consuming content from WordPress REST API and Directorist professional listings.

## Architecture

- **CMS**: WordPress (content management only — no theme rendering)
- **Directory**: Directorist (`at_biz_dir` custom post type)
- **Frontend**: React + Vite (fully decoupled SPA)

## Tech Stack

- React 19
- Vite
- React Router
- TanStack Query
- Styled Components
- Framer Motion

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

Create a `.env` file:

```env
VITE_WP_API_URL=https://thebluepassport.org/wp-json/wp/v2
```

For local development with a WordPress instance on another port, you can use the Vite proxy:

```env
VITE_WP_API_URL=/wp-json/wp/v2
VITE_WP_PROXY_TARGET=http://localhost:8080
```

## API Endpoints

| Function | Endpoint |
|---|---|
| `getPages()` | `GET /wp-json/wp/v2/pages` |
| `getPage(slug)` | `GET /wp-json/wp/v2/pages?slug={slug}` |
| `getProfessionals()` | `GET /wp-json/wp/v2/at_biz_dir` |
| `getProfessional(id)` | `GET /wp-json/wp/v2/at_biz_dir/{id}` |

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level page components
├── layouts/        # Layout wrappers
├── hooks/          # TanStack Query hooks
├── services/       # WordPress API layer
├── styles/         # Theme, global styles, animations
├── routes/         # React Router configuration
├── utils/          # Helpers and constants
└── assets/         # Static assets
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Pages

- **/** — Home (Hero, Mission, Blue Certificate, Network, Featured Professionals, Categories, CTA)
- **/about** — Organization, Mission, Vision, Blue Economy, International Reach
- **/professionals** — Directorist professional directory with category filters
- **/professionals/:id** — Individual professional profile
