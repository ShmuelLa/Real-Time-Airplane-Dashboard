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
