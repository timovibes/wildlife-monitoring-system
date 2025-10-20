# Wildlife & Biodiversity Monitoring System

A **full-stack web-based system** to monitor wildlife and biodiversity, track endangered species, manage incidents, and generate biodiversity health reports. Built using **React** (frontend), **Node.js + Express** (backend), **PostgreSQL** (database), and includes a **simulated IoT module** for live wildlife data.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Running the System](#running-the-system)
6. [Usage](#usage)
7. [IoT Simulation](#iot-simulation)
8. [Database Seeding](#database-seeding)
9. [API Endpoints](#api-endpoints)
10. [License](#license)

---

## Features

* User roles with **JWT-based authentication**: Admin, Ranger, Researcher
* Record **wildlife sightings**, **endangered species**, and **habitat data**
* Manage **incidents** like poaching or human-wildlife conflicts
* Generate **biodiversity health reports** with charts
* Live **map visualization** of IoT sensor data using Leaflet.js
* Clean, futuristic **glassmorphism design** with Tailwind CSS
* REST APIs for CRUD operations on all models

---

## Technologies Used

* **Frontend:** React, React Router, Axios, Tailwind CSS, Chart.js, Leaflet.js
* **Backend:** Node.js, Express, Sequelize ORM, JWT authentication
* **Database:** PostgreSQL
* **IoT Simulation:** Node.js script generating fake wildlife sensor data

---

## Folder Structure

```
wildlife-monitoring-system/
│
├── backend/                  # Express backend
│   ├── controllers/          # Route controllers
│   ├── models/               # Sequelize models
│   ├── routes/               # API routes
│   ├── middleware/           # JWT auth and other middleware
│   ├── utils/                # Helper functions
│   └── server.js             # Entry point
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Dashboard, Species, Sightings, Incidents, Reports
│   │   ├── services/         # Axios API calls
│   │   ├── App.js            # Main app
│   │   └── index.js
│   └── package.json
│
├── iot-simulator/            # Node.js script simulating wildlife sensors
│   └── simulator.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

### Prerequisites

* Node.js (v18+)
* npm or yarn
* PostgreSQL

### Steps

1. Clone the repository:

```bash
git clone https://github.com/timovibes/wildlife-monitoring-system.git
cd wildlife-monitoring-system
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Configure PostgreSQL:

* Create a database (e.g., `wildlife_db`)
* Update `backend/config/config.json` or `.env` with your DB credentials

---

## Running the System

### Backend

```bash
cd backend
node server.js
```

Server runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:3000`

### IoT Simulator

```bash
cd iot-simulator
node simulator.js
```

Simulates live sensor data and sends it to the backend.

---

## Usage

* Login with a role (Admin/Ranger/Researcher)
* Navigate between Dashboard, Species, Sightings, Incidents, and Reports
* Add, edit, and delete records using forms
* View live IoT data on the map and in charts

---

## IoT Simulation

The IoT simulator generates:

* GPS coordinates
* Temperature
* Motion

It sends the data periodically to the backend’s `/api/iot` endpoint. The frontend displays it live on a map and updates charts in real time.

---

## Database Seeding

To seed sample data:

```bash
cd backend
node seed.js
```

This populates:

* Users (Admin, Ranger, Researcher)
* Species
* Sightings
* Incidents

---

## API Endpoints

* **Users:** `/api/users`
* **Species:** `/api/species`
* **Sightings:** `/api/sightings`
* **Incidents:** `/api/incidents`
* **IoT Data:** `/api/iot`

All endpoints support standard **CRUD operations** and require JWT authentication.

---

## License

This project is licensed under the MIT License.
