# GAME-API
## Rest api to create games
-----------------------------------------

#### Start Application in Development Mode:
```sh
cd game-api
npm install
node start:dev
```
This environment requires one mongodb provided by developer in **localhost** and port **27017** see the **Environments** section to change the connection and other variables


#### Run application in docker
```sh
cd game-api
docker-compose down
docker-compose up --build
```
This command requires to have docker installed in local machine, and this command is going to pull the images of node and mongodb
```sh
--build
```
use **--build** only once or when you want to create everything from scratch.


#### Environments
If you don't want to use local database just change the right .env file, example:
```sh
file: src/environment/.local.env
change: localhost to 192.168.0.xx of DATABASE_HOST key
```
to start the application with different env change the NODE_ENV var, example
```sh
export NODE_ENV=myEnv
```
and create the file in **src/environment/.myEnv.env** with all that you need (copy the content from other .env file)

the env var **NODE_ENV** is setted in **package.json** see that file for more references 
```sh
"start:myEnv": "export NODE_ENV=myEnv && nest start"
```

#### Swagger
```sh
http://localhost:3000/api
```
