# UrbanKinetic — Transit Companion

A responsive public transit dashboard concept with four views for planning and managing city journeys. The frontend is built with React and Vite, and uses Leaflet with OpenStreetMap tiles for maps.

## Features

- **Live Trip:** See an active journey, upcoming stops, service status, and commute impact.
- **Plan:** Enter or swap a starting point and destination, then compare sample transit, bus, and bike routes.
- **Nearby:** Browse sample departures and filter them by train, bus, or bike.
- **Wallet:** View a sample transit pass, ticket QR-style display, balance, perks, and recent activity.
- **GPS:** Use the browser’s geolocation to center the map on your current location. Location access requires your permission and a secure browser context (HTTPS or localhost).
- **Responsive layout:** Desktop navigation and a compact mobile bottom bar.

## Project structure

```text
backend/   FastAPI service and accident-detection models
frontend/  React transit dashboard
```

The transit routes, departure times, and wallet information are currently sample frontend data. The backend remains a separate RoadGuard AI accident-detection API; it is not currently connected to the transit screens.

## Run the frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Map tiles are loaded from OpenStreetMap, so the map needs an internet connection. OpenStreetMap attribution is displayed on the map.

To create a production build:

```bash
npm run build
```

## Run the backend (optional)

From the `backend` directory, create and activate a Python virtual environment, then install the requirements:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

macOS/Linux:

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API health check is available at `http://127.0.0.1:8000/api/health`. Interactive API documentation is at `http://127.0.0.1:8000/docs`.
