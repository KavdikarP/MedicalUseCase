#!/bin/bash
cd $(dirname $0)/..

# Set project and environment variables
gcloud config set project vital-octagon-19612
export PROJECT_ID=vital-octagon-19612
export REGION=us-central1
export CLUSTER_NAME=underwriting-cluster-v5

# Dynamically create a unique image name with a timestamp for frontend
export TIMESTAMP=$(date +%Y%m%d%H%M)
export FRONTEND_IMAGE_NAME=gcr.io/$PROJECT_ID/frontend-app-$TIMESTAMP

# Build and push the frontend image
export REPO_FULL_NAME=$FRONTEND_IMAGE_NAME
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=REPO_FULL_NAME=$REPO_FULL_NAME .

# Configure kubectl to communicate with your cluster
gcloud container clusters get-credentials ${CLUSTER_NAME} --region=${REGION}

# Apply the Kubernetes YAML configurations for the frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Update Kubernetes deployment with the new frontend image
kubectl set image deployment/frontend-app frontend-container=${FRONTEND_IMAGE_NAME}

# Post-deployment checks for the frontend
echo "Verify the status of the frontend deployment:"
kubectl get deploy frontend-app
echo "View the logs from the running frontend deployment:"
kubectl logs -l app=frontend-app --tail=20
