FROM        node

LABEL       author="Alex Wilson"

# SET ENVIRONMENT VARS
ENV         NODE_ENV=production
ENV         API_PORT=3001

# CREATE APP DIRECTORY
RUN         mkdir -p /app
WORKDIR     /app

## INSTALL DEPENDENCIES
COPY        ./package*.json /app
RUN         npm install

# GET SOURCE
COPY        . /app
RUN         npm run build

# RUN THE API
EXPOSE      $API_PORT
ENTRYPOINT  [ "node", "./build/app.js" ]