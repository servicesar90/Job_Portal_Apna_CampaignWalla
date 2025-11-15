import express from 'express';
import type  {Request, Response} from "express";
import dotenv from 'dotenv';
import {createServer} from 'http'
import {Server as SocketIoServer} from 'socket.io';

import cors from 'cors';
import morgan from 'morgan';


dotenv.config();


//all routes define here
import { connectionToDatabase } from './config/db';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes'
import applicationRoutes from './routes/applicationRoutes';
import paymentRoutes from './routes/paymentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { errorHandler } from './middleware/errorHandler';





const app =express();
const PORT= process.env.PORT||5001;
const httpServer = createServer(app);
const io = new SocketIoServer(httpServer, {
   cors: {
    origin: "*",   // allow all origins
    methods: ["GET", "POST","PUT","DELETE"]
  }
})




app.set('io',io);



connectionToDatabase(process.env.MONGO_URI as string);


//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));







//routes
app.use('/api/auth',authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications',applicationRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/analytics',analyticsRoutes);


//error handler
app.use(errorHandler);


//socket.io connection
io.on('connection',(socket:any)=>{
    console.log('socket.io connected',socket.id);

    socket.on('joinRoom',(room: string)=>{
        socket.join(room);
    });

    socket.on("jobApplied", (data:any) => {
    console.log("Job applied event:", data);

    // ⭐ notify all employers OR specific employer
    io.emit("notifyEmployer", data);
  });

  socket.on("jobPosted", (data:any) => {
    console.log("Job Posted event:", data);

    // ⭐ notify all employers OR specific employer
    io.emit("notifyCandidate", data);
  });

    socket.on('disconnect',()=>{
        console.log('socket.io disconnected',socket.id);
        
    })
    
})



app.get('/',(req:Request, res:Response)=>{
    res.send('hello from typescript backend');
});

httpServer.listen(PORT, ()=>{
    console.log(`server is runnig on ${PORT}`);
    
});
