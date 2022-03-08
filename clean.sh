#!/bin/bash
docker-compose down
docker system prune -f
docker volume prune -f
rm -rf */node_modules
