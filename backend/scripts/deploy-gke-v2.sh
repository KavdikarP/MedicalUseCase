#!/bin/bash
cd $(dirname $0)/..

# Set project and environment variables
gcloud config set project vital-octagon-19612
export PROJECT_ID=vital-octagon-19612
export REGION=us-central1
export CLUSTER_NAME=underwriting-cluster-v5

# Dynamically create a unique image name with a timestamp
export TIMESTAMP=$(date +%Y%m%d%H%M)
export CLOUDRUN_SERVICE_IMAGE_NAME=gcr.io/$PROJECT_ID/prudential-uw-backend-image-$TIMESTAMP

# Build image
export REPO_FULL_NAME=$CLOUDRUN_SERVICE_IMAGE_NAME
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=REPO_FULL_NAME=$REPO_FULL_NAME .

# Check if the cluster exists
CLUSTER_EXISTS=$(gcloud container clusters list --region ${REGION} --filter name=${CLUSTER_NAME} --format "value(name)")
if [ -z "$CLUSTER_EXISTS" ]; then
    gcloud container clusters create ${CLUSTER_NAME} --location ${REGION} \
      --workload-pool ${PROJECT_ID}.svc.id.goog \
      --enable-image-streaming \
      --node-locations=${REGION}-a \
      --machine-type n2d-standard-4 \
      --num-nodes 1 --min-nodes 1 --max-nodes 2 \
      --ephemeral-storage-local-ssd=count=2
else
    echo "Cluster exists, skipping creation..."
fi

echo
echo "Configure kubectl to communicate with your cluster:"
gcloud container clusters get-credentials ${CLUSTER_NAME} --region=${REGION}

echo
echo "Updating deployment with new image..."
kubectl set image deployment/underwriting-backend underwriting-backend=${CLOUDRUN_SERVICE_IMAGE_NAME}

# Post-deployment checks
echo "Verify the status of the model:"
kubectl get deploy
echo "View the logs from the running deployment:"
kubectl logs -l app=underwriting-backend --tail=20