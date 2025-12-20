import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors({
//     origin: ,
//     credentials: true
// }))

app.use(express.json({limit: "100mb"}))

app.use(express.urlencoded({extended:true, limit: "100mb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin:[ "http://localhost:5173","https://devconnect-24.netlify.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials:true,
}));

import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import notificationRouter from "./routes/notification.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/notifications", notificationRouter);
app.get('/', (req,res)=>{
    res.send({
        activeStatus:true,
        error:false,
    })
})
export { app }