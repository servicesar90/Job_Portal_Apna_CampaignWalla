import express from 'express';
import type  {Request, Response} from "express";
import dotenv from 'dotenv';
import { connectionToDatabase } from './config/db';

dotenv.config();



const app =express();
const PORT= process.env.PORT||5000;

connectionToDatabase(process.env.MONGO_URI as string);

app.use(express.json());

app.get('/',(req:Request, res:Response)=>{
    res.send('hello from typescript backend');
});

app.listen(PORT, ()=>{
    console.log(`server is runnig on ${PORT}`);
    
});
