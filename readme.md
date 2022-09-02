# Flight Data Analysis Project

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
```