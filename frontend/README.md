# Smart Office Automation – Frontend

React 19 + TypeScript + Vite single-page app for the Smart Office Automation API.

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start dev server on http://localhost:5173
npm run build   # type-check and build for production
npm run lint    # run ESLint
```

## Backend

The app expects the API at `http://localhost:5262/api` (set in `src/api/axios.ts`). Start the backend first; see the [root README](../README.md) for setup.

## Main libraries

React Query (server state), axios (HTTP), react-hook-form (forms), Recharts (dashboard charts), xlsx (Excel export), React Router (protected routes by role).
