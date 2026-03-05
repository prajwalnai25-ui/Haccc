# CivicSense AI (MVP)

CivicSense AI is a Next.js MVP for public issue reporting and AI-assisted triage.

## What this MVP includes

- **Citizen Reporting Interface** (mobile-first): submit image name, location, and description.
- **Simulated Vision AI Triage**: automatically assigns category, severity (1-10), and department.
- **Admin Dashboard**: secured demo view showing issues sorted by severity, with status transitions:
  - Pending -> In Progress -> Resolved
- **In-memory data store** for instant updates during demo sessions.

## Prerequisites

- Node.js **18.18+** (or Node.js 20+ recommended)
- npm 9+

## How to run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app:

   ```text
   http://localhost:3000
   ```

## Demo flow

### Citizen side

1. Fill in:
   - image filename (example: `pothole.jpg`)
   - location (or click **Use geolocation**)
   - description
2. Click **Submit Report**.

### Admin side

1. In the dashboard panel, enter demo PIN: `1234`
2. Click **Unlock**.
3. Review issues sorted by severity (highest first).
4. Update status using the status buttons.

## API endpoints

- `GET /api/issues` -> list all issues sorted by severity
- `POST /api/issues` -> create issue
  - body: `{ "imageName": string, "location": string, "description": string }`
- `PATCH /api/issues/:id/status` -> update status
  - body: `{ "status": "Pending" | "In Progress" | "Resolved" }`

## Notes

- This MVP intentionally uses an **in-memory store** (`lib/issuesStore.ts`). Restarting the server resets issue data.
- The triage engine is currently a keyword-based simulation and is designed to be replaced with a real Vision API integration in later iterations.
