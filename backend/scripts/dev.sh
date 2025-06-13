#!/bin/bash

# Go to root dir
cd $(dirname $0)/..

export PROJECT_ID=prudential-glt-v2-2024
export TIMEOUT=900
export PYTHONTRACEMALLOC=1

# you might need to run the following line to login
# gcloud auth application-default login
gcloud config set project $PROJECT_ID
gcloud auth application-default set-quota-project $PROJECT_ID

uvicorn main:app --reload --port 8081