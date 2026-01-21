import dotenv from "dotenv";
dotenv.config({
    path:"./.env",
});

import app from"./app.js";
import connectDB from "./db/index.js";



const port=process.env.PORT || 3000; 



connectDB()
    .then(()=>{
        app.listen(port,()=>{
            console.log(`app listen at port http://localhost:${port} ,port is now 27017`)
          })
    })
    .catch((error)=>{
        console.error("MongoDB connection error",err)
        process.exit(1)
    })