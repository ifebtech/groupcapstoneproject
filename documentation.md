# Final Project Documentation Summary

Objective:
The objective of this project is to design, build, and deploy a two-tier web application consisting of a backend API and a frontend client, both containerized with Docker. The project integrates a continuous integration and continuous deployment (CI/CD) pipeline using GitHub Actions, and the final deployment is hosted on a Linux Virtual Machine (VM) on Microsoft Azure.

**Executive summary**

Built a two-tier MERN app, containerized frontend + backend with Docker, orchestrated locally with docker-compose, published images to Docker Hub, deployed to an Azure Linux VM, and automated build → push → deploy using GitHub Actions. MongoDB Atlas used for persistence. All steps tested and verified.

**Team:** Cloud Computing Group 4  
**Completion Date:** October 31, 2025  
**Live Deployment URL:** http://51.132.176.217  
**GitHub Repository:** https://github.com/ifebtech/groupcapstoneproject  
**Status:** ✅ COMPLETE & DEPLOYED  

###Key Goals:

- Containerize both frontend and backend services with separate Dockerfiles.

- Use Docker Compose to orchestrate both containers.

- Push Docker images to Docker Hub using tagged versions.

- Deploy both containers on an Azure Linux VM and make the app publicly accessible via port 80.

- Automate the build, push, and deploy process using GitHub Actions CI/CD pipeline.

**Preliminaries**

Tools used:
- VS Code, 
- Docker Desktop,
- Git, GitHub, 
- Azure CLI, 
-  MongoDB Atlas.

**Files of interest:**
 - backend/Dockerfile, 
 - frontend/Dockerfile, 
 - docker-compose.yml, 
 - .github/workflows/deploy.yml,
- backend/.env

tep 1: Creating Dockerfiles for Backend and Frontend
🎯 Objective

To containerize both the backend (Node.js + Express) and frontend (React) applications by writing separate Dockerfiles. This ensures that each service runs in its own isolated environment, making deployment consistent and independent of local setup.

A. Backend Dockerization

Objective:
Create a Docker image for the Node.js + Express backend server.

Dockerfile (backend/Dockerfile):

```bash
# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
```

Command to Build Backend Image:
`docker build -t yourdockerhubusername/backend:v1 .`

Output:
 ![backend Docker image built successfully](./screenshots/02_backend_docker_build_success.png)
         *CLI showing backend Docker image built successfully*


B. Frontend Dockerization

Objective:
Create a Docker image for React frontend using an optimized multi-stage build.

Dockerfile (frontend/Dockerfile):
```bash
# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```


**Explanation:**

Uses multi-stage build to optimize final image size.

First stage builds React app using Node.js.

Second stage uses Nginx to serve static files for production.

EXPOSE 80 → ensures the container listens on HTTP port.

The CMD command runs Nginx in the foreground.


Command to Build Frontend Image:

`docker build -t yourdockerhubusername/frontend:v1 .`

Output:
![frontend Docker image built successfully](./screenshots/04_backend_docker_build_success.png)
               *CLI showing frontend Docker image built successfully*


**Confirm Built Images:**
To list built images use:
 `docker images`

Output:
![list of image built successfully](./screenshots/05_docker_images_with_frontend.png)
        *CLI showing list of Docker images built successfully*


 ✅ Result:
Both frontend and backend images built successfully and visible in local Docker registry.

**STEP 2: Orchestrating Containers with Docker Compose**

Objective:
Run both containers together locally to test integration before deployment.

File: docker-compose.yml
(placed in project root, same level as /backend and /frontend)
  docker-compose.yml .

![Docker compose file](./screenshots/docker-compose.yml.file.PNG)
 *Docker compose file*
                
Run Both Containers Together

Command:

From your project root, run:

`docker-compose up --build`

This will:

Build and start both containers.

Display logs from both backend and frontend.

Make your app accessible via browser at:
👉 http://localhost

Output:
![localhost running on port3000.](./screenshots/localhost.running.on.port3000.png)
                *Browser view showing localhost running successfully*

 
![the containers started successfully ](./screenshots/07_containers_started.png)
      *CLI view showing backend and froonened containers started successfully*


⚠️ Warning and Error Observed

When the command below was ran, i got an error message:

`docker-compose up -d`

output appeared:
`env file C:\Users\USER\dockerized-2tier-app-demo\backend\.env not found: CreateFile C:\Users\USER\dockerized-2tier-app-demo\backend\.env: The system cannot find the file specified.`

“env file not found: backend/.env”

###MongoDB Atlas Setup and Integration

**Why MongoDB Atlas Was Needed**

During container orchestration with Docker Compose, the backend failed to start and displayed this warning:
  `env file C:\Users\USER\dockerized-2tier-app\backend\.env not found`

⚠️ **Meaning:**
The backend service expected environment variables (like MongoDB connection details) to be loaded from a .env file, but none was found.
Without a valid MongoDB connection string, the backend couldn’t connect to a database or serve data to the frontend.

Hence, it became necessary to:

Create a MongoDB Atlas database, and

Configure the .env file to point to it.

Step 1: Create MongoDB Atlas Account

- Navigate to https://www.mongodb.com/cloud/atlas

- Sign up for a free account using your email or GitHub/Google account.

- Once logged in, click “Build a Database” → Choose Free (M0) cluster.

     Screenshot:
     ![Creating free cluster in MongoDB Atlas ](./screenshots/mongodb_cluster.created.png)
     *Creating free cluster in MongoDB Atlas*

**Step 2: Configure Your Cluster**

- Choose a cloud provider (e.g., AZURE) and a region close to you.

- Name the cluster — e.g., appproject.

- Click Create Cluster (takes a few minutes to provision).
  ![Creating free cluster in MongoDB Atlas ](./screenshots/mongodb_create_cluster.png)
  *Cluster created successfully in MongoDB Atlas*

**Step 3: Add Database User**

In the left sidebar, go to Database Access → Add New Database User.

- Choose authentication method: Password.

- Enter:

- Username: admin

- Password: admin123

- Assign Role: Atlas Admin (for full access during testing).

- Click Add User.

**Step 4: Allow IP Access**

- Go to Network Access → Add IP Address.

- Choose “Allow access from anywhere” (0.0.0.0/0).

- Save changes.

**Step 5: Get the Connection String**

- Go back to your Cluster Dashboard.

- Click “Connect” → “Connect your application”.

- Copy the connection string template:
  
    mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=appproject

 ![mongodb conection string](image.png)   
*Connection string copied from Atlas* 


- Replace <username> and <password> with your actual credentials.

✅ Final connection string used:

   `mongodb+srv://admin:admin123@appproject.fc9xifh.mongodb.net/?appName=appproject`

**Step 6: Create the .env File**

Inside your backend folder (/backend), create a new .env file and add:   
 `PORT=5000`
`MONGODB_URL=mongodb+srv://admin:admin123@appproject.fc9xifh.mongodb.net/?appName=appproject ACCESS_TOKEN_SECRET=Rj2S?RVe9[]8-dCS6A**&b5Tsg$gwbg~Bd{*QTK`

![.env file created with MongoDB credentials”](./screenshots/backend_env_created.png)
*".env file created with MongoDB credentials”*

Step 7: Re-run Docker Compose

Now that .env exists, re-run your containers:
 `docker-compose up -d --build`

 Then check backend logs:
 `docker logs backend_container`

![Backend successfully connected to MongoDB Atlas](./screenshots/mongodb_connected_successfully.png)
 *Backend successfully connected to MongoDB Atlas*

✅ MongoDB Integration Summary

- MongoDB Atlas was created and configured to allow external connections.

- A .env file was created to store sensitive credentials securely.

- The backend successfully read these variables and established a live database connection.

- Containers now communicate correctly — backend ↔ MongoDB ↔ frontend.

Step 6: Frontend Customization
🎯 Objective

To personalize the frontend UI of the application to improve user experience and presentation before deployment.

 Description

After confirming both backend and frontend containers were successfully running via Docker Compose, and verifying that the app was accessible at http://localhost, the frontend interface was customized.

Edits were made to:

- React components (JSX files)

- CSS styling

- Static assets such as logos, headers, and background colors

These customizations aligned the UI design with the project’s visual theme and made the app presentation-ready for deployment.

**Tools Used**

- VS Code — for editing React files

- AI Assistance (Claude.ai) — to generate CSS and layout suggestions

- Browser DevTools — to test and preview UI changes live

 Screenshots

Before Customization: Default React UI on http://localhost
![localhost running on port3000.](./screenshots/localhost.running.on.port3000.png)

After Customization: Updated design (colors, layout, branding)
![Customized frontend UI](./screenshots/09_frontend_customized_interface1.png)

✅ Outcome

The customized frontend maintained full integration with the backend API while presenting a more professional and modern interface — suitable for demonstration, testing, and deployment.

Step 7: Pushing Docker Images to Docker Hub
🎯 Objective

To publish both the backend and frontend Docker images to Docker Hub, making them accessible for deployment to any remote environment (such as Azure VM or any CI/CD pipeline).

Explanation

After successfully building your Docker images locally using docker build and verifying them with docker images, the next step is to push these images to Docker Hub.

Docker Hub is a cloud-based registry that allows developers to store and distribute Docker images publicly or privately.
This makes it easier for others (or yourself on another machine) to pull and run the same images without rebuilding them.

Step 1. **Log in to Docker Hub.**
Before pushing images, log in to your Docker Hub account from the terminal:

`docker login`

You’ll be prompted for your Docker Hub username and password (or access token if 2FA is enabled).

✅ Expected Output:

  Login Succeeded

![Docker hub successful login](./screenshots/11_dockerhub_login_success.png)
*Terminal after a successful Docker Hub login.*

Step 2 — Tag Your Images Properly

Now, tag your locally built images with your Docker Hub username.

Replace *yourdockerhubusername* with your actual Docker Hub username.

Run the following commands:
`docker push ifeanyi222/backend:v1`
`docker push ifeanyi222/frontend:v1`

Screenshot

![frontend image pushed to docker repo](./screenshots/13_frontend_image_pushed.png)

![Backend image pushed to docker repo](./screenshots/12_backend_image_pushed.png)

*Pushing both backend and frontend Docker images to Docker Hub successfully*

**Step 4 — Verify Images on Docker Hub**

Once the push completes successfully:

Visit your Docker Hub account.
Click on Repositories.

You should now see both repositories:

![creation of repos](./screenshots/10_dockerhub_repos_created.png)

`ifeanyi222/backend:v1`

`ifeanyi222/frontend:v1`

![Backend image pushed to docker repo](./screenshots/14_dockerhub_repos.png)
*Verification of backend and frontend repositories successfully uploaded to Docker Hub*

```
| **Challenge**              | **Description**                                                                     | **Solution**                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Image tag mismatch         | Initially, the tags were incorrect (`yourdockerhubusername`) causing push failures. | Retagged images correctly using my actual Docker Hub username (`ifeanyi222`).   |
| Login authentication error | Docker login failed at first attempt due to incorrect credentials.                  | Re-entered correct Docker Hub username and password, verified login success.    |
| Network timeout            | The push was interrupted due to unstable internet.                                  | Waited for stable connection and reran the `docker push` commands successfully. |
```

✅ Final Result

Both backend and frontend images are now hosted on Docker Hub, making them accessible from any machine via:
`docker pull ifeanyi222/backend:v1`
`docker pull ifeanyi222/frontend:v1`

This means your application images are portable and ready for deployment to remote servers or CI/CD pipelines.

Step 8: Deploying Containers Using Docker Compose (Production Setup Simulation)


