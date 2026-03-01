# ICAV Project

This repository is the Sprint 4 starter for the **ICAV** project team in CIS3760.

>  This is a placeholder scaffold.  The sprint activities include setting up the
> project infrastructure, defining epics/userstories, and deploying a simple
> placeholder application via Docker Compose.  Actual functionality will be
> developed in later sprints.

---

## Sprint4 Deliverables

1. **Project description & pitch**  persona, product description, pitch wiki.
2. **Epics**  at least 3 epics defined and prioritised; backlog ordered.
3. **User stories**  breakdown of highest priority epic with acceptance criteria
   and story points on the backlog board.
4. **Infrastructure**  skeleton frontend, backend, and MariaDB containers with
   working `docker-compose` deployment.
5. **CI pipeline**  linters and unit tests configured for all code containers.
6. **Team conventions**  conflict resolution strategy, branch naming, templates,
   approvals, etc. (set using GitLab settings).

All of the above should be documented on the Sprint4 wiki page and linked from
this repository.

---

## Repository structure

```
icav/
 backend/         # Spring Boot project (Gradle)
 frontend/        # Node/Express placeholder
 docker-compose.yml
 .gitlab-ci.yml
 README.md        # this file
```

## Running the placeholder application

Requirements: Docker & DockerCompose installed on your machine.

```powershell
cd C:\Users\CC\Desktop\CIS\icav
docker compose build
docker compose up
```

- Frontend: http://localhost:3000  shows the product pitch splash page.
- Backend:  http://localhost:8080/health  simple "OK" response.
- MariaDB: accessible on port3306 (no initial data required).

You can stop the services with `Ctrl+C` or `docker compose down`.

## Development hints

### Frontend

```powershell
cd frontend
npm install
npm run dev         # starts express on port 3000
```

### Backend

```powershell
cd backend
.\gradlew.bat bootRun   # on Windows
```

## CI configuration

See `.gitlab-ci.yml` in the project root. It defines `lint` and `test` jobs for
both frontend and backend. Adjust them as you add real code.

---

*This README was populated during Sprint4 setup.*
