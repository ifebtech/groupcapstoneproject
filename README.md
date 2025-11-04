# Dockerized 2-Tier Web App with GitHub CI/CD

## Project Overview
This project demonstrates a **Dockerized 2-tier MERN application** (frontend + backend) deployed on an **Azure Linux VM** with a **MongoDB Atlas** database. It also includes a **GitHub Actions CI/CD pipeline** for automated building, pushing, and deploying of Docker images.

**Objective:**  
- Containerize both backend and frontend using Docker  
- Deploy containers on Azure VM  
- Connect backend to MongoDB Atlas  
- Automate CI/CD with GitHub Actions

---

## Tools & Technologies
- **Frontend:** React.js, Tailwind CSS, Nginx  
- **Backend:** Node.js, Express.js, Mongoose  
- **Database:** MongoDB Atlas  
- **Containerization:** Docker, Docker Compose  
- **CI/CD:** GitHub Actions  
- **Cloud:** Microsoft Azure (Linux VM)  
- **Other Tools:** Visual Studio Code, Postman  

---
```
## Architecture
dockerized-2tier-app/
│
├── backend/
│   ├── controllers/           # Handles logic for incoming requests and responses
│   ├── models/                # Defines database schemas and ORM models
│   ├── routes/                # Contains route definitions that map URLs to controllers
│   ├── utils/                 # Utility/helper functions
│   ├── middlewares.js         # Middleware functions (e.g., authentication, validation)
│   ├── .env                   # Environment variables for backend (API keys, DB URLs, etc.)
│   ├── app.js                 # Main server file (entry point for the backend)
│   └── package.json           # Backend dependencies and scripts
│
├── frontend/
│   ├── public/                # Static files (index.html, images, etc.)
│   ├── src/                   # React source files (components, pages, hooks, etc.)
│   ├── package.json           # Frontend dependencies and scripts
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.js      # PostCSS setup for processing Tailwind
│
├── .github/workflows/deploy.yml   # GitHub Actions workflow for CI/CD
├── docker-compose.yml             # Orchestrates multi-container setup (frontend + backend)
├── README.md                      # Main project overview and setup instructions
├── documentation.md               # Detailed technical documentation and usage guide
└── screenshots/                   # Contains images or screenshots for documentation

```


---

## Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd dockerized-2tier-app

2. Backend
cd backend
docker build -t <dockerhub-username>/backend:v1 .

3. Frontend
cd frontend
docker build -t <dockerhub-username>/frontend:v1 .

4. Docker Compose

Run both containers together:

docker-compose up -d

5. Azure VM Deployment

Create a Linux VM on Azure

Install Docker:

sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker

Pull images from Docker Hub and run:

docker run -d -p 5000:5000 <dockerhub-username>/backend:v1
docker run -d -p 80:80 <dockerhub-username>/frontend:v1

CI/CD with GitHub Actions

Workflow located at: .github/workflows/deploy.yml

Automatically triggered on push to main branch

Steps include:

Build backend & frontend Docker images

Push images to Docker Hub

SSH into Azure VM and deploy containers

GitHub Secrets used:

DOCKER_USERNAME

DOCKER_PASSWORD

AZURE_HOST

AZURE_USER

AZURE_KEY

Usage

Access the frontend: http://51.132.176.217/

Access the backend API: http://51.132.176.217:5000/api/tasks

Login and use your app through the frontend interface

Screenshots

Screenshots are in /screenshots folder

Example:

frontend_running.png – Frontend live on browser

backend_running.png – Backend logs and API working

ci_cd_success.png – Workflow completed successfully

Challenges & Notes

- MongoDB connection initially failed due to missing .env values (solved by adding correct MongoDB Atlas URI)

- Backend container exited on invalid connection string; fixed by updating .env

- Azure VM firewall blocked ports; solved by creating inbound port rules

- Docker Hub push required correct image tags



