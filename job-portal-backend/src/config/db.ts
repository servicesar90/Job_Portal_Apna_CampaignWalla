//MongoDB Connection
import mongoose from "mongoose";

//Connection Function
export const connectionToDatabase = async (mongoURI : string) =>{
    try{
        await mongoose.connect(mongoURI,{

        } as mongoose.ConnectOptions);
        console.log('MongoDB connected');

    }
    catch(e){
        console.error('MongoDB connection error:',e)
        process.exit(1);

    }
}