# Final Project Documentation Summary

**Objective:**

The objective of this project is to design, build, and deploy a two-tier web application consisting of a backend API and a frontend client, both containerized with Docker. The project integrates a continuous integration and continuous deployment (CI/CD) pipeline using GitHub Actions, and the final deployment is hosted on a Linux Virtual Machine (VM) on Microsoft Azure.

**Executive summary**

Built a two-tier MERN app, containerized frontend + backend with Docker, orchestrated locally with docker-compose, published images to Docker Hub, deployed to an Azure Linux VM, and automated build → push → deploy using GitHub Actions. MongoDB Atlas used for persistence. All steps tested and verified.

**Team:** Cloud Computing Group 4  
**Completion Date:** October 31, 2025  
**Live Deployment URL:** http://51.132.176.217  
**GitHub Repository:** https://github.com/ifebtech/groupcapstoneproject  
**Status:** ✅ COMPLETE & DEPLOYED  

### Key Goals:

- Containerize both frontend and backend services with separate Dockerfiles.

- Use Docker Compose to orchestrate both containers.

- Push Docker images to Docker Hub using tagged versions.

- Deploy both containers on an Azure Linux VM and make the app publicly accessible via port 80.

- Automate the build, push, and deploy process using GitHub Actions CI/CD pipeline.

**Preliminaries**

**Tools used:**
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

## Step 1: Creating Dockerfiles for Backend and Frontend

**🎯 Objective**

To containerize both the backend (Node.js + Express) and frontend (React) applications by writing separate Dockerfiles. This ensures that each service runs in its own isolated environment, making deployment consistent and independent of local setup.

**A. Backend Dockerization**

**Objective:**

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

**Command to Build Backend Image:**

`docker build -t yourdockerhubusername/backend:v1 .`

**Output:**

 ![backend Docker image built successfully](./screenshots/02_backend_docker_build_success.png)
         *CLI showing backend Docker image built successfully*


**B. Frontend Dockerization**

**Objective:**

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

- Uses multi-stage build to optimize final image size.

- First stage builds React app using Node.js.

- Second stage uses Nginx to serve static files for production.

- EXPOSE 80 → ensures the container listens on HTTP port.

- The CMD command runs Nginx in the foreground.


**Command to Build Frontend Image:**

`docker build -t yourdockerhubusername/frontend:v1 .`

**Output:**

![frontend Docker image built successfully](./screenshots/04_frontend_docker_build_success.png)
               *CLI showing frontend Docker image built successfully*


**Confirm Built Images:**

To list built images use:

 `docker images`

**Output:**

![list of image built successfully](./screenshots/05_docker_images_with_frontend.png)
        *CLI showing list of Docker images built successfully*


 ✅ Result:

Both frontend and backend images built successfully and visible in local Docker registry.

**STEP 2: Orchestrating Containers with Docker Compose**

**Objective:**

Run both containers together locally to test integration before deployment.

File: `docker-compose.yml`

(placed in project root, same level as /backend and /frontend)
  `docker-compose.yml .`

![Docker compose file](./screenshots/docker-compose.yml.file.PNG)
 *Docker compose file*
                
Run Both Containers Together

**Command:**

From your project root, run:

`docker-compose up --build`

This will:

- Build and start both containers.

- Display logs from both backend and frontend.

- Make your app accessible via browser at:
👉 http://localhost

**Output:**
![localhost running on port3000.](./screenshots/localhost.running.on.port3000.png)
                *Browser view showing localhost running successfully*

 
![the containers started successfully ](./screenshots/07_containers_started.png)
      *CLI view showing backend and frontend containers started successfully*


⚠️ Warning and Error Observed

When the command below was ran, i got an error message:

`docker-compose up -d`

**Output appeared:**

`env file C:\Users\USER\dockerized-2tier-app-demo\backend\.env not found: CreateFile C:\Users\USER\dockerized-2tier-app-demo\backend\.env: The system cannot find the file specified.`

“env file not found: backend/.env”

### MongoDB Atlas Setup and Integration

**Why MongoDB Atlas Was Needed**

During container orchestration with Docker Compose, the backend failed to start and displayed this warning:
  `env file C:\Users\USER\dockerized-2tier-app\backend\.env not found`

⚠️ **Meaning:**
The backend service expected environment variables (like MongoDB connection details) to be loaded from a .env file, but none was found.
Without a valid MongoDB connection string, the backend couldn’t connect to a database or serve data to the frontend.

Hence, it became necessary to:

Create a MongoDB Atlas database, and Configure the .env file to point to it.

**1: Create MongoDB Atlas Account**

- Navigate to https://www.mongodb.com/cloud/atlas

- Sign up for a free account using your email or GitHub/Google account.

- Once logged in, click “Build a Database” → Choose Free (M0) cluster.

     **Screenshot:**
     
     ![Creating free cluster in MongoDB Atlas ](./screenshots/mongodb_cluster.created.png)
     *Creating free cluster in MongoDB Atlas*

**2: Configure Your Cluster**

- Choose a cloud provider (e.g., AZURE) and a region close to you.

- Name the cluster — e.g., appproject.

- Click Create Cluster (takes a few minutes to provision).
  ![Creating free cluster in MongoDB Atlas ](./screenshots/mongodb_create_cluster.png)
  *Cluster created successfully in MongoDB Atlas*

**3: Add Database User**

In the left sidebar, go to Database Access → Add New Database User.

- Choose authentication method: Password.

- Enter:

- Username: admin

- Password: admin123

- Assign Role: Atlas Admin (for full access during testing).

- Click Add User.

**4: Allow IP Access**

- Go to Network Access → Add IP Address.

- Choose “Allow access from anywhere” (0.0.0.0/0).

- Save changes.

**5: Get the Connection String**

- Go back to your Cluster Dashboard.

- Click “Connect” → “Connect your application”.

- Copy the connection string template:
  
    mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=appproject

 ![mongodb conection string](./screenshots/mongodb_connection_string.png)   
*Connection string copied from Atlas* 


- Replace <username> and <password> with your actual credentials.

**✅ Final connection string used:**

   `mongodb+srv://admin:admin123@appproject.fc9xifh.mongodb.net/?appName=appproject`

**6: Create the .env File**

Inside your backend folder (/backend), create a new .env file and add:   
 `PORT=5000`
`MONGODB_URL=mongodb+srv://admin:admin123@appproject.fc9xifh.mongodb.net/?appName=appproject ACCESS_TOKEN_SECRET=Rj2S?RVe9[]8-dCS6A**&b5Tsg$gwbg~Bd{*QTK`

![.env file created with MongoDB credentials”](./screenshots/backend_env_created.png)
*".env file created with MongoDB credentials”*


**7: Re-run Docker Compose**

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

## Step 3: Frontend Customization

**🎯 Objective**

To personalize the frontend UI of the application to improve user experience and presentation before deployment.

 **Description**

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

**Screenshots**

Before Customization: Default React UI on http://localhost

![localhost running on port3000.](./screenshots/localhost.running.on.port3000.png)

After Customization:

 Updated design (colors, layout, branding)

![Customized frontend UI](./screenshots/09_frontend_customized_interface1.png)

**✅ Outcome**

The customized frontend maintained full integration with the backend API while presenting a more professional and modern interface — suitable for demonstration, testing, and deployment.

## Step 4: Pushing Docker Images to Docker Hub

**🎯 Objective**

To publish both the backend and frontend Docker images to Docker Hub, making them accessible for deployment to any remote environment (such as Azure VM or any CI/CD pipeline).

**Explanation**

After successfully building your Docker images locally using docker build and verifying them with docker images, the next step is to push these images to Docker Hub.

Docker Hub is a cloud-based registry that allows developers to store and distribute Docker images publicly or privately.
This makes it easier for others (or yourself on another machine) to pull and run the same images without rebuilding them.

1. **Log in to Docker Hub.**

Before pushing images, log in to your Docker Hub account from the terminal:

`docker login`

You’ll be prompted for your Docker Hub username and password (or access token if 2FA is enabled).

**✅ Expected Output:**

*Login Succeeded*

![Docker hub successful login](./screenshots/11_dockerhub_login_success.png)
*Terminal after a successful Docker Hub login.*

**2 — Tag Your Images Properly**

Now, tag your locally built images with your Docker Hub username.

Replace `*yourdockerhubusername*` with your actual Docker Hub username.

Run the following commands:

`docker push ifeanyi222/backend:v1`

`docker push ifeanyi222/frontend:v1`

**Screenshot**

![frontend image pushed to docker repo](./screenshots/13_frontend_image_pushed.png)

![Backend image pushed to docker repo](./screenshots/12_backend_image_pushed.png)

*Pushing both backend and frontend Docker images to Docker Hub successfully*

**3 — Verify Images on Docker Hub**

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

**✅ Final Result**

Both backend and frontend images are now hosted on Docker Hub, making them accessible from any machine via:
`docker pull ifeanyi222/backend:v1`

`docker pull ifeanyi222/frontend:v1`

This means your application images are portable and ready for deployment to remote servers or CI/CD pipelines.

## Step 5: Environment Variables (.env) Management

**🎯 Objective:**

Ensure all sensitive configurations (like MongoDB credentials and JWT secrets) are securely managed using environment variables across local, Docker, and CI/CD environments.

**Overview**

The `.env` file contains key configuration values that the backend service depends on, such as:

`PORT=5000`  
`MONGODB_URL=mongodb+srv://admin:admin123@appproject.fc9xifh.mongodb.net/?appName=appproject  `
`ACCESS_TOKEN_SECRET=Rj2S?RVe9[]8-dCS6A**&b5Tsg$gwbg~Bd{*QTK`

**Usage in Docker Compose**

In the docker-compose.yml, the backend service automatically loads environment variables from this .env file:

```bash
backend:
  build: ./backend
  env_file:
    - ./backend/.env
  ports:
    - "5000:5000"
```

This ensures that sensitive data is not hardcoded in the Compose file, keeping credentials secure and easily configurable.

**Usage in CI/CD (GitHub Actions)**

When deploying via the CI/CD pipeline, these variables are stored as GitHub Secrets instead of committing .env directly to GitHub.
They are then injected into the pipeline runtime as environment variables:

env:
  `MONGODB_URL: ${{ secrets.MONGODB_URL }}`
  `ACCESS_TOKEN_SECRET: ${{ secrets.ACCESS_TOKEN_SECRET }}`

**✅ Result:**

Local development uses `.env.`

Docker Compose references `.env` automatically.

GitHub Actions securely provides the same variables at runtime via secrets.

This approach keeps credentials secure, portable, and consistent across all environments — local, containerized, and deployed. 


## 6: Deploying Containers Using Docker Compose (Production Setup Simulation)

**Objective:**

Deploy the backend and frontend containers to your Azure Linux VM, making the app accessible via its public IP.

**Azure VM Setup** 

**1.Login to Azure CLI:**

Run the following command in your terminal:
   
  `az login`

 ![Succesfully logged into azure using cli](./screenshots/15_azure_login_success.png) 
*Succesfully logged into azure using cli*

**2.Create a Resource Group:**

A resource group logically organizes your Azure resources (VM, disks, network, etc.).

Run:

  `az group create --name <YOUR_ORIGINAL_RESOURCE_GROUP> --location eastus`

![Succesfully created a resources group using cli](./screenshots/16_resource_group_created.png) 
*Succesfully created a resources group using cli*

![Succesfully created a resources group using cli](./screenshots/16b_resource_group_portal.png) 
*Portal view of the created resource group*

**3.Create a Linux VM:**

Next, create your Ubuntu VM.

This command automatically sets up a network, public IP, and SSH keys.

`az vm create --resource-group dockerGroup4RG --name dockerGroup4VM --image UbuntuLTS --admin-username azureuser --generate-ssh-keys`

**✅ Expected Output:**

A public IP address is generated (e.g. 51.132.176.217)

SSH keys are stored in your local ~/.ssh directory

The VM is now active and ready for SSH access.

![Succesfully created VM through Cli](./screenshots/17a_vm_creation_cli.png) 
*Linux VM successfully created via Azure CLI.*


![Portal view of the vm created ](./screenshots/17b_vm_overview_portal.png) 
*Portal view of the vm created*


**4. Open Required Ports (via Azure Portal)**

To make your web application publicly accessible, you must allow HTTP (port 80) and backend API (port 5000) traffic on the Virtual Machine.

Since the VM’s default firewall only allows SSH (port 22), the additional ports were opened manually using the Azure Portal instead of CLI.

**Steps followed:**

- Log in to Azure Portal

- Go to Resource Groups → your-resource-group → your-VM.

- Under the Settings section, click Networking.

- In the Inbound port rules tab, click Add inbound port rule.

Add two rules:

- Port 80 → Protocol: TCP → Allow → Name: frontend-http

- Port 5000 → Protocol: TCP → Allow → Name: backend-api

Save the changes.

**✅ Outcome:**

Both ports (80 and 5000) are now open, allowing frontend and backend access through the VM’s public IP.

![Portal view of the port setting](./screenshots/portal_ports_opened.png) 
*Inbound port rules (80 and 5000) opened successfully via Azure Portal.*

**Challenges Faced & Solutions Implemented**

**Challenge:**

Port Access Restrictions

Frontend (port 80) and backend (port 5000) were inaccessible from the browser.

**Solution implemented:**

Opened the required inbound ports manually via Azure Portal → Networking → Add inbound port rule.


## Step 7: Connecting to Azure VM via SSH

**🎯 Objective:**

Securely access the Azure Virtual Machine (VM) to install and configure Docker for application deployment.

**Command Used:**

`ssh azureuser@<VM_Public_IP>`

Replace <VM_Public_IP> with your actual VM public IP address (e.g., 51.132.176.210)

![Portal view of the port setting](./screenshots/18_ssh_connection_vm.png) 

**✅ Successful SSH Connection:**

You are now inside the remote VM environment and can begin configuring it for Docker-based deployment.

## Step 8: Installing Docker on the Azure VM

**🎯 Objective:**

Set up Docker on the Azure VM to enable containerized deployment of both backend and frontend applications.

**Procedure:**

1️⃣ Update the package index:

`sudo apt update`

2️⃣ Install Docker:

`sudo apt install docker.io -y`

3️⃣ Start the Docker service:

`sudo systemctl start docker`

4️⃣ Verify Docker installation:

`docker --version`

**Expected Output**

`Docker version 24.x.x, build xxxxxxx`

**Screenshot:**

![Docker was successfully installed and verified on the VM.](./screenshots/19_install_docker_vm.png) 
*Docker successfully installed and verified on the VM.*

## Step 9: Pulling and Running Project Images from Docker Hub

**🎯 Objective:**

Retrieve the pre-built backend and frontend images from Docker Hub and run them on the Azure VM.

**Procedure:**

1️⃣ Log in to Docker Hub:

`sudo docker login`

*Enter your Docker Hub username and password/access token when prompted.*

**Expected Output:**

*Login Succeeded*

![Docker logged in successfuly.](./screenshots/21_dockerhub_login_vm.png) 


**2️⃣ Pull your project images:**

`sudo docker pull <yourdockerhubusername>/backend:v1`

`sudo docker pull <yourdockerhubusername>/frontend:v1`

**3️⃣ Verify that the images were downloaded successfully:**

`sudo docker images`

**Expected Output Example:**
```
REPOSITORY                        TAG       IMAGE ID       SIZE
yourdockerhubusername/frontend     v1        5cfae6a8a4b5   157MB
yourdockerhubusername/backend      v1        34a4fef0e8b9   230MB
```

**4️⃣ Run the containers:**

`sudo docker run -d -p 5000:5000 --name backend_container yourdockerhubusername/backend:v1`
`sudo docker run -d -p 80:80 --name frontend_container yourdockerhubusername/frontend:v1`

**5️⃣ Confirm running containers:**

`sudo docker ps`

**Expected Output:**

```bash
CONTAINER ID   IMAGE                               COMMAND                  STATUS         PORTS
b9f0a4d7c1a1   yourdockerhubusername/frontend:v1   "/docker-entrypoint.…"   Up 2 minutes   0.0.0.0:80->80/tcp
a2d67cf44e3b   yourdockerhubusername/backend:v1    "docker-entrypoint.s…"   Up 2 minutes   0.0.0.0:5000->5000/tcp
```
![Docker containers running succesfully.](./screenshots/23_docker_containers_running.png) 
*Docker containers running succesfully on Vm*

**✅ Deployment Successful:**

The containers are running on the VM.

The application can be accessed at:

Frontend (React app):

http://<VM_Public_IP>/

Backend (API):

http://<VM_Public_IP>:5000/

**Challenges Faced & Solutions Implemented**

**Challenge:**

SSH connection timeout

**Solution Implemented:**

Verified correct VM public IP from Azure portal and ensured ports in the Network Security Group are all okay and opened (NSG).

**Challenge:**

Docker installation failed

**Solution Implemented:**

Ran `sudo apt update && sudo apt upgrade -y` before installing Docker.

**✅ Summary:**

All SSH and Docker-related setup challenges were successfully resolved, ensuring a stable environment for container deployment on the Azure VM.


## Step 10: Deploying Containers Using Docker Compose on Azure VM

**🎯 Objective**

To deploy both the backend and frontend containers together on the Azure Virtual Machine using Docker Compose, ensuring the entire two-tier application runs as a unified production setup accessible via the VM’s public IP address.

**Overview**

After verifying that individual containers can run successfully using docker run, Docker Compose is now used to manage both services in one configuration file.
This simplifies production deployment and allows for easier container lifecycle management (start, stop, rebuild, etc.) on the VM.

**Procedure**

**1️⃣ Create a new docker-compose.yml file on the Azure VM**

After connecting to the VM via SSH, create a new Docker Compose file:

Paste the following content inside:

```bash
version: "3.8"
services:
  backend:
    image: ifeanyi222/backend:v1
    container_name: backend_container
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env
    restart: always

  frontend:
    image: ifeanyi222/frontend:v1
    container_name: frontend_container
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```

Press CTRL + O, then ENTER, and CTRL + X to save and exit the editor.

2️⃣ **Explanation: Why Create a New Compose File?**

In your local environment, the Docker Compose file included build instructions like:

`build: ./backend`

`build: ./frontend`

That meant images were being built directly from source code on your machine.

However, in a production VM environment, the images are already built and stored on Docker Hub, so there’s no need to rebuild them.
Instead, the Compose file here pulls prebuilt images using:

`image: ifeanyi222/backend:v1`

`image: ifeanyi222/frontend:v1`

**✅ Summary of Difference:**
```
| Environment       | Compose Behavior                                     | Purpose                                  |
| ----------------- | ---------------------------------------------------- | ---------------------------------------- |
| **Local Machine** | Builds containers from source using `build:`         | For development and testing              |
| **Azure VM**      | Pulls prebuilt images from Docker Hub using `image:` | For deployment and production simulation |
```

**3️⃣ Start Docker Compose**

Run the following command to pull and start the containers together:

`sudo docker-compose up -d`

**✅ Expected Output:**

Docker Compose automatically pulls both images from Docker Hub (if not already present) and starts the containers in detached mode.

![successfully pulled images](./screenshots/22_pull_images_vm.png) 

**4️⃣ Verify Running Containers**

To confirm both containers are running:

`sudo docker ps`

**✅ Expected Output:**

CONTAINER ID   IMAGE                           COMMAND                  STATUS         PORTS

`a2d67cf44e3b   ifeanyi222/backend:v1           "docker-entrypoint.s…"   Up 2 minutes   0.0.0.0:5000->5000/tcp`
`b9f0a4d7c1a1   ifeanyi222/frontend:v1          "/docker-entrypoint.…"   Up 2 minutes   0.0.0.0:80->80/tcp`

![containers running on vm](./screenshots/container_running_on_vm.png) 

**5️⃣ Test Application in Browser**

Frontend (React App):

👉 http://51.132.176.217/

Backend (API):
👉 http://51.132.176.217:5000/

![interface of the app](./screenshots/09_frontend_customized_interface1.png) 
*Interface showing the app from browser*

![interface of the app](./screenshots/09_frontend_customized_interface2.png) 
*Interface showing the down part of the app from browser*

![successful login into the app](./screenshots/Frontend-login-success-screen.png) 
*Successful login interface of the app*

✅ Both services are now running on the Azure VM and accessible via the public IP address.

**Challenges Faced & Solutions Implemented (Docker Compose on VM)**


**Challenge**

The backend container failed to start initially because the .env file was not found in the VM environment.

**Solution Implemented**

Recreated the .env file inside /backend directory on the VM with correct MongoDB credentials.

**Challenge**

Pulling large images from Docker Hub was slow due to network latency.

**Solution Implemented**

Waited for completion and verified using sudo docker images before proceeding.


**✅ Outcome:**

Both frontend and backend containers deployed successfully using Docker Compose.

The app is live and accessible at http://51.132.176.217


## Step 11: Setting Up GitHub Actions for CI/CD (Automated Deployment to Azure VM)

**🎯 Objective:**

To automate the process of building, testing, and deploying both frontend and backend Docker containers from GitHub to Docker Hub, and then deploying them automatically on the Azure Virtual Machine.

**1️⃣ Create the GitHub Actions Workflow File**

In your project directory, create the following folder structure (if not already existing):

`.github/workflows/deploy.yml`

Open (or create) the file `deploy.yml` and add the following workflow configuration:

![Workflow display ](./screenshots/02_workflow_code_added1.png) 
*Screenshot displaying the Workflow display*

![Workflow display ](./screenshots/02_workflow_code_added2.png) 

**2️⃣ Add GitHub Secrets**

To avoid exposing credentials directly inside your workflow file, store all sensitive values in GitHub Secrets.

Go to your project repository on GitHub →Settings → Secrets and Variables → Actions → New Repository Secret.

**2️⃣ Add GitHub Secrets**

To avoid exposing credentials directly inside your workflow file, store all sensitive values in GitHub Secrets.

Go to your project repository on GitHub →Settings → Secrets and Variables → Actions → New Repository Secret.

**Add the following:**

```
| **Secret Name**   | **Description**                                                 |
| ----------------- | --------------------------------------------------------------- |
| `Docker_username` | Your Docker Hub username                                        |
| `Docker_password` | Docker Hub personal access token or password                    |
| `Vm_Host`         | The public IP address of your Azure VM (e.g., `51.132.176.217`) |
| `Vm_user`         | Azure VM username (e.g., `azureuser`)                           |
| `Vm_ssh_key`      | Private SSH key content used for authentication                 |
```

**3️⃣ Explanation of the Pipeline**
```
| Step                      | Action                                                                     | 
| ------------------------- | --------------------------------------------------------------------------- | 
| `Checkout code`           | Uses the official GitHub Action to pull your repository.                    |             
| `Setup Buildx`            | Enables advanced Docker build functionality for multi-platform support.     |             
| `Login to Docker Hub`     | Authenticates your workflow using credentials stored as GitHub Secrets.     |             
| `Build and Push Backend`  | Builds the backend image from `backend/` folder and pushes to Docker Hub.   |             
| `Build and Push Frontend` | Builds the frontend image from `frontend/` folder and pushes to Docker Hub. |             
```


**4️⃣ Run and Monitor the Pipeline**

- Once you push changes to your main branch:

- Go to your GitHub repo → Actions tab

- Click on CI/CD Pipeline - Build and Deploy Dockerized App

- Monitor each stage (Build → Push → Deploy) in real time

If successful, you’ll see green checkmarks ✅ for each job.

**5️⃣ Verify Deployment**

After the pipeline completes successfully, open your app in the browser:

Frontend → http://51.132.176.217

Backend API → http://51.132.176.217:5000

✅ The app auto-updates each time you push new commits to GitHub.


### Challenges Faced & Solutions Implemented (CI/CD Phase)

**Challenge:**

GitHub Action failed to log in to Docker Hub.

**Solution Implemented:**

Generated a new access token from Docker Hub and updated it under GitHub Secrets.

**Challenge:**

The deploy step took longer when images were large.

**Solution Implemented**

Optimized Dockerfiles and used caching to reduce image size.

**Screenshots Showing Github Secrets Successfully Added**
![Secrets Added ](./screenshots/github_secrets.png) 

![Secrets Added ](./screenshots/github_actions_pipeline_success.png) 

![ci-cd workflow success ](./screenshots/workflows_on_github.png) 



**✅ Final Outcome:**

- Full CI/CD pipeline successfully implemented.

- Every code push automatically rebuilds and redeploys the app on Azure VM.

- Zero manual intervention needed for deployment.

- Application remains live at http://51.132.176.217


## Step 12: Triggering CI/CD Redeployment & Final Validation

**🎯 Objective:**

Automatically deploy the latest Docker images from GitHub to the Azure VM using the CI/CD pipeline (GitHub Actions).

This step ensures that every new push to the main branch triggers an automated build → push → deploy sequence, eliminating manual redeployment.

**1️⃣ CI/CD Pipeline Trigger**

Once the .github/workflows/deploy.yml file was configured and GitHub Secrets were securely added (Docker_username, Docker_password, Vm_Host, Vm_User, Vm_ssh_key), a new commit was pushed to the main branch, triggering the pipeline automatically.

Alternatively, the workflow can also be triggered manually from:

GitHub → Actions → Select “Deploy Workflow” → Run Workflow

**✅ Expected CI/CD Flow:**

- Build backend and frontend Docker images.

- Push both images to Docker Hub.

- Connect to the Azure VM via SSH.

- Pull the latest images.

- Restart the containers using Docker Compose.

**2️⃣ Verification on Azure VM**

After the workflow completed successfully, an SSH connection was made to the Azure VM to confirm deployment status:

`ssh azureuser@<VM_Public_IP>`
`docker ps`

**✅ Expected Output:**

`CONTAINER ID   IMAGE                         STATUS         PORTS`
`a1b2c3d4e5f6   ifeanyi222/backend:v1         Up 2 minutes   0.0.0.0:5000->5000/tcp`
`b2c3d4e5f6g7   ifeanyi222/frontend:v1        Up 2 minutes   0.0.0.0:80->80/tcp`

**✅ Application Access:**

Frontend (React App): http://51.132.176.217

Backend (API): http://51.132.176.217:5000

The application was fully deployed, accessible via browser, and serving live API data from MongoDB Atlas.

**3️⃣ Challenges Faced & Solutions Implemented (CI/CD Phase)**

**Challenge:**

VM returned “docker-compose: command not found” during workflow execution.

**Solution Implemented:**

Installed Docker Compose manually on VM using `sudo apt install docker-compose -y.`

**Challenge:**

Error: "Cannot link to a non running container"

**Solution Implemented:**

Added sleep 10 delay between backend and frontend container startup to allow backend initialization

**Final Outcome**

✅ Frontend and backend services successfully deployed and running on Azure VM.

✅ Automated pipeline functioning — updates from GitHub trigger full redeployment.

✅ MongoDB Atlas integration stable and connected to the backend API.

✅ Docker Hub hosting verified — images available publicly.

✅ Azure VM firewall configured — ports 22, 80, and 5000 open for SSH, HTTP, and API access.

**Final Project Conclusion**

This project demonstrates the complete lifecycle of a modern DevOps deployment from development to continuous delivery , using industry-standard cloud and containerization tools.

**Key Achievements:**

- Built a two-tier MERN web application (frontend + backend).

- Containerized both services using Docker.

- Integrated MongoDB Atlas for persistent cloud storage.

- Orchestrated services with Docker Compose for unified management.

- Published images to Docker Hub for portability.

- Deployed to Azure Linux VM for real-world hosting.

- Automated deployment via GitHub Actions CI/CD pipeline.

- Documented and resolved real-time errors encountered during setup and deployment.

**✅ Final Result:**

LIVE APPLICATION URL: http://51.132.176.217

REPOSITORY: https://github.com/ifebtech/groupcapstoneproject

STATUS: ✅ Fully Deployed, Tested, and Operational

**Lessons Learned**

Throughout the development and deployment of this two-tier Dockerized web application, several key lessons were learned that strengthened both technical and operational understanding:

Containerization Simplifies Deployment
Docker made it possible to package all dependencies and configurations into isolated containers, ensuring consistent behavior across local, test, and production environments.

Environment Variables Are Essential for Security
Using a .env file and GitHub Secrets emphasized the importance of never hardcoding sensitive data like database credentials or API keys directly into source code.

CI/CD Pipelines Save Time and Reduce Errors
Automating builds and deployments with GitHub Actions removed repetitive manual tasks, ensuring fast and reliable releases with every commit.

Cloud Integration Requires Network Awareness
Opening ports, managing firewalls, and configuring public IPs on Azure highlighted the importance of understanding cloud networking for successful deployments.

Troubleshooting Builds Problem-Solving Skills
Encountering errors (e.g., missing .env, tag mismatches, and SSH key issues) provided hands-on experience in debugging real-world DevOps challenges.

Documentation Is as Important as Implementation
Systematically recording each step, command, and challenge ensured transparency, reproducibility, and ease of collaboration within the team.




