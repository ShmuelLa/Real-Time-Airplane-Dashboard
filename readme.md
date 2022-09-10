# Flight Data Analysis Project

first update nodejs:
https://www.hostingadvice.com/how-to/update-node-js-latest-version/

### How to run nodemon on windows powershell:

```
Get-ExecutionPolicy
    Restricted
    
Set-ExecutionPolicy Unrestricted

Get-ExecutionPolicy
    Unrestricted
```

### Interacting with MongoDB docker:

```
docker run -d -p 2717:27017 -v ~/mongodb:/data/db --name airmongo mongo

docker exec -it airmongo bash

    mongosh
    use <db name>
    show collections
    db.<collection name>.find()
```

```
docker run --name airredis -d redis redis-server --save 60 1 --loglevel warning -p 6379:6379 -v ~/redis:/data
docker run --name airredis -d redis --save 60 1 --loglevel warning -p 6379:6379 -v ~/redis:/data

docker run --name airrepis -d redis redis-server -v /redis:/data --save 60 1 --loglevel warning 


docker run -d  -v ~/redis:/data --name airredis redis

docker run -d -p 6379:6379 -v /redis:/data --name redis dockerfile/redis

```
### BigML Serive

NodeJS API docs:
```
https://github.com/bigmlcom/bigml-node/blob/master/docs/index.md
```
### Kafka
```
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
docker-compose up
```