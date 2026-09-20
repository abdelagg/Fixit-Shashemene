# FixIt Shashemene

A local service marketplace connecting customers in Shashemene with nearby verified
tradespeople — plumbers, electricians, mechanics, phone and computer technicians,
and more. Includes automated problem diagnosis, worker matching, job tracking, and
in-app messaging.

## Getting Started

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set `INFERENCE_API_KEY` (used by the diagnostic
   engine's inference client).
3. Run the app in development mode:
   ```
   npm run dev
   ```
4. Build and run for production:
   ```
   npm run build
   npm start
   ```

## Project Structure

- `server.ts` — Express API server (auth, jobs, messaging, diagnostic engine).
- `src/pages` — top-level application routes.
- `src/components` — shared UI components.
- `src/services/api.ts` — typed client for the backend API.
- `src/data/shashemeneData.ts` — seed data for local development.
