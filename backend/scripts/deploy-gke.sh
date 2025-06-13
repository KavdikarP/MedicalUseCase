#!/bin/bash

# Go to root dir
cd $(dirname $0)/..

# Variables
export PROJECT_ID=vital-octagon-19612
export GKEPOD_SERVICE_NAME=prudential-uw-backend
export GKEPOD_SERVICE_IMAGE_NAME=gcr.io/$PROJECT_ID/$GKEPOD_SERVICE_NAME-image
export GKE_CLUSTER_NAME=medlm-cluster
export GKE_CLUSTER_ZONE=us-central1
export NAMESPACE=default

# Setup
gcloud config set project $PROJECT_ID
gcloud auth application-default set-quota-project $PROJECT_ID
gcloud auth configure-docker

# Build image
gcloud builds submit --tag $GKEPOD_SERVICE_IMAGE_NAME .

# Get GKE cluster credentials
gcloud container clusters get-credentials $GKE_CLUSTER_NAME --zone $GKE_CLUSTER_ZONE

# Kubernetes Deployment YAML content
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $GKEPOD_SERVICE_NAME
spec:
  replicas: 1
  selector:
    matchLabels:
      app: $GKEPOD_SERVICE_NAME
  template:
    metadata:
      labels:
        app: $GKEPOD_SERVICE_NAME
    spec:
      containers:
      - name: $GKEPOD_SERVICE_NAME
        image: $GKEPOD_SERVICE_IMAGE_NAME
        ports:
        - containerPort: 8080
        env:
        - name: PROJECT_ID
          value: "$PROJECT_ID"
        - name: TIMEOUT
          value: "3600"
        - name: GRACEFUL_TIMEOUT
          value: "300"
        - name: WEB_CONCURRENCY
          value: "2"
        - name: TMPDIR
          value: "/app/tmp"
EOF

# Expose Deployment as a Service
kubectl expose deployment $GKEPOD_SERVICE_NAME --type=LoadBalancer --port 80 --target-port 8080 --name ${GKEPOD_SERVICE_NAME}-service --namespace $NAMESPACE

# Wait for the service to be available and get the external IP
echo "Waiting for the service to become available..."
kubectl get svc --namespace $NAMESPACE -w ${GKEPOD_SERVICE_NAME}-service
