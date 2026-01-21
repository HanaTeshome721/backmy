import express from "express";

import  cors  from "cors";
import cookieParser from "cookie-parser";

const app= express()
 
//basic config
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//cors config
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "http:localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
}))

//import the route

import  healthCheck  from "./routes/healthcheck.routes.js";
import authRouther from "./routes/auth.routes.js"



app.use('/api/v1/healthcheck',healthCheck)
app.use('/api/v1/auth',authRouther)


app.get('/',(req,res)=>{
    res.send("home");
});




export default app;
