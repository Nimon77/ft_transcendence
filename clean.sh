#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
NC='\033[0m'

if [[ $1 == "bdd" ]]
then
	echo -e "${ORANGE}Cleaning all containers and volumes${NC}" && \
	docker-compose down && \
	docker volume prune -f
	if [ $? -eq 0 ]; then
		echo -e "${GREEN}Cleanup success${NC}"
	else
		echo -e "${RED}Cleanup failed${NC}"
	fi
elif [[ $1 == "all" ]]
then
	echo -e "${ORANGE}Cleaning all containers and volumes${NC}" && \
	docker-compose down && \
	docker volume prune -f && \
	echo -e "${ORANGE}Cleaning all network${NC}" && \
	docker network prune -f && \

	echo -e "${ORANGE}Deleting node_modules${NC}" && \
	du -sh */node_modules && \
	rm -rf */node_modules */*lock* */dist
	if [ $? -eq 0 ]; then
		echo -e "${GREEN}Cleanup success${NC}"
	else
		echo -e "${RED}Cleanup failed${NC}"
	fi
else
	echo "Usage: ./clean.sh [bdd|all]"
fi
