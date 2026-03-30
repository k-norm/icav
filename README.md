# ICAV: Infrastructure Condition & Accessibility Visualizations

ICAV is a web-based dashboard that turns large public infrastructure datasets into simple charts and maps. It is designed for managers and planners who need to make data-driven funding and planning decisions without manually parsing spreadsheets.

---

## Product Overview

**Problem:** Misaligned funding and complex datasets prevent clear insights into community needs.

**Solution:** ICAV produces visualizations that highlight trends in facility condition and accessibility to enable evidence-based decision making.

---

## Key Visualizations
- **Scatter Plot:** Accessibility vs Poor Condition by Province
- **Stacked Bar Chart:** Facility Condition Breakdown by Province
- **Canada Heatmap:** Facility Condition Intensity
- **Comparison Graph:** Good Condition vs Accessibility by Province

---

## System Architecture

ICAV follows a **3-tier architecture** deployed via Docker Compose:

| Layer      | Technology                  | Port  | Role |
|-----------|-----------------------------|-------|------|
| Frontend  | Node.js / Express           | 3000  | UI, SVG visualizations |
| Backend   | Spring Boot (Java 17)       | 8080  | REST API, database queries |
| Database  | MariaDB 11                  | 3306  | Stores facility condition & accessibility data |

Data is loaded at container startup via SQL scripts (no live ingestion). The frontend fetches JSON from the backend API to render visualizations dynamically.

### Access
- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend API: [http://localhost:8080](http://localhost:8080)

---

## Getting Started

### Prerequisites
- Docker Desktop  
- Git  

### Quick Start
```bash
git clone https://gitlab.socs.uoguelph.ca/cis3760w26/saffron/icav.git
cd icav
docker compose up --build
```

## Further Reading

- See [Code Review](./wiki/Code%20Review) and [Code Standards](./wiki/Code%20Standards) for project coding conventions.  
- See [Languages and Libraries](./wiki/Languages%20and%20Libraries) and [Development Tools](./wiki/Development%20Tools) for our tech stack.  
- See [Docker Setup Instructions](./wiki/Docker%20Setup%20Instructions) for development environment configuration.