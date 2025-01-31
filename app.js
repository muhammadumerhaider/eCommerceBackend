const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")


require("./database/db");

app.use(bodyParser.json())
app.use((req,res,next)=>{
    console.log(req.method);
    next()
})
app.use(require('./routes/route'));

app.listen(3000,function(){
    console.log("Server is running...");
})