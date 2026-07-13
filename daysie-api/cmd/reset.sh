#!/bin/bash

# Print a header
echo "Docker Down Containers:"

# Use the 'docker ps' command to list all running containers
docker-compose down
