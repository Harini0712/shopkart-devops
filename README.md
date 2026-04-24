# ShopKart DevOps

A production-grade e-commerce product page built with Node.js + Express, containerized with Docker, and deployed to AWS EC2 via a Jenkins CI/CD pipeline with SonarQube code quality analysis.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JS |
| Backend | Node.js + Express |
| Containerization | Docker |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Cloud | AWS EC2 (Ubuntu 22.04) |

## Project Structure

```
shopkart-devops/
├── src/
│   ├── server.js              # Express entry point
│   ├── routes/products.js     # /api/products route
│   └── data/products.json     # Mock product data
├── public/
│   ├── index.html             # E-commerce UI
│   ├── style.css              # Dark theme styles
│   └── app.js                 # Frontend JS
├── Dockerfile
├── Jenkinsfile
├── sonar-project.properties
└── package.json
```

## Run Locally

```bash
npm install
npm start
# App at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | All products |
| GET | /api/products?category=Audio | Filter by category |
| GET | /api/products?sort=price-asc | Sort products |
| GET | /api/products/:id | Single product |
| GET | /health | Health check |

## Docker

```bash
docker build -t shopkart-devops .
docker run -p 3000:3000 shopkart-devops
```

## CI/CD Pipeline (Jenkins)

1. Checkout from GitHub
2. npm install
3. SonarQube code analysis
4. Quality Gate check
5. Docker build + push to Docker Hub
6. Deploy to AWS EC2

## Author

Harini — DevOps / Cloud Engineering Portfolio Project
