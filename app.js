import express from "express";
import bodyParser from "body-parser";
import connectDB from "./database/db.js";
import router from './routes/route.js';

const app = express();
connectDB(); // db connection

app.use(bodyParser.json());

app.use(router);

app.listen(3000,function(){
    console.log("Server is running...");
})