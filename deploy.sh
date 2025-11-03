#!/bin/bash
set -e

sudo docker pull ifeanyi222/backend:v1
sudo docker pull ifeanyi222/frontend:v1
sudo docker stop backend_container || true
sudo docker rm backend_container || true
sudo docker stop frontend_container || true
sudo docker rm frontend_container || true

sudo docker run -d --name backend_container \
  -e MONGODB_URL="mongodb+srv://admin:admin123@appproject.fc9xifh.mongodb.net/?appName=appproject" \
  -e ACCESS_TOKEN_SECRET="Rj2S?RVe9[]8-dCS6A**&b5Tsg$gwbg~Bd{*QTK" \
  ifeanyi222/backend:v1

sleep 10

sudo docker run -d --name frontend_container \
  --link backend_container \
  -p 80:80 \
  ifeanyi222/frontend:v1