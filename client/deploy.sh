#!/bin/bash
#export GIT_ASKPASS="~/home/ubuntu/.netrc"
git pull

sudo docker image prune -f
sudo docker build -t gettohire_client .
sudo docker-compose up -d
