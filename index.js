const express = require("express");

const app = express();

app.get("/" , function(req, res){
    res.send("port 5544");
});

app.listen(5544, function() {
    console.log("port 5544");
});