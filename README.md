# simple-to-do-list-187443-187452

Integration notes:
- Frontend reads REACT_APP_API_BASE (fallback REACT_APP_BACKEND_URL) and calls `${REACT_APP_API_BASE}/api/...`.
- Expected backend defaults: PORT=4000, CORS_ORIGIN=http://localhost:3000, and a GET /health endpoint returning 200 OK.
- Responses should serialize `completed` as boolean and date fields as ISO 8601 strings.
- See to_do_frontend/.env.example for configuration.