#!/bin/bash

echo "Starting..."
docker-compose down
docker-compose up --build
