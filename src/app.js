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
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

//import the route

import healthCheck from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import { itemRouter } from "./routes/item.routes.js";
import requestRouter from "./routes/request.routes.js";
import complaintRouter from "./routes/complaint.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import reportRouter from "./routes/report.routes.js";
import needRouter from "./routes/need.routes.js";
import contactRouter from "./routes/contact.routes.js";



app.use("/api/v1/healthcheck", healthCheck);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/requests", requestRouter);
app.use("/api/v1/complaints", complaintRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/admin/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/needs", needRouter);
app.use("/api/v1/contact", contactRouter);


app.get('/',(req,res)=>{
    res.send("home");
});




export default app;
