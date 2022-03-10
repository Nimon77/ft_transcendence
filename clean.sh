#!/bin/bash
docker-compose down
docker system prune -af
docker volume prune -f
sudo rm -rf */node_modules */*lock*
