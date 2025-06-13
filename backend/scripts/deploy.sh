#!/bin/bash

# Go to root dir
cd $(dirname $0)/..

# Variables
export PORT=8080
export PROJECT_ID=ccinsights3
export CLOUDRUN_SERVICE_NAME=hdfc-ergo-backend
export CLOUDRUN_SERVICE_IMAGE_NAME=us-central1-docker.pkg.dev/$PROJECT_ID/$CLOUDRUN_SERVICE_NAME/$CLOUDRUN_SERVICE_NAME:latest

# Setup
gcloud config set project $PROJECT_ID
gcloud auth application-default set-quota-project $PROJECT_ID

# Build image
gcloud builds submit --tag $CLOUDRUN_SERVICE_IMAGE_NAME .

# Deploy image
gcloud run deploy $CLOUDRUN_SERVICE_NAME \
    --image $CLOUDRUN_SERVICE_IMAGE_NAME \
    --region us-central1 \
    --port $PORT \
    --allow-unauthenticated \
    --min-instances 1 \
    --no-cpu-throttling \
    --set-env-vars=PROJECT_ID=$PROJECT_ID \
    --set-env-vars=TIMEOUT=3600 \
    --set-env-vars=GRACEFUL_TIMEOUT=300 \
    --set-env-vars=WEB_CONCURRENCY=4 \
    --set-env-vars=TMPDIR=/app/tmp
