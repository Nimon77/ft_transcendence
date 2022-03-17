#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ECHO=echo
if [[ "$OSTYPE" != "darwin"* ]]
then
  ECHO="echo -e"
fi

if [[ $1 == "bdd" ]]
then
	docker-compose down && \
	docker volume prune -f
	if [ $? -eq 0 ]; then
		${ECHO} "${GREEN}Cleanup success${NC}"
	else
		${ECHO} "${RED}Cleanup failed${NC}"
	fi
elif [[ $1 == "all" ]]
then
	docker-compose down && \
	docker volume prune -f && \
	docker network prune -f && \
	rm -rf */node_modules */*lock*
	if [ $? -eq 0 ]; then
		${ECHO} "${GREEN}Cleanup success${NC}"
	else
		${ECHO} "${RED}Cleanup failed${NC}"
	fi
else
	${ECHO} "Usage: ./clean.sh [bdd|all]"
fi
