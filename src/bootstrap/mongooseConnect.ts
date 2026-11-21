import mongoose from "mongoose";
import { env } from "../config/env.js";

export  const registerMongo= async()=>{
    try {
        await mongoose.connect(env.mongoUrl);
console.log("DB connect")
    } catch (error) {
        console.log(error)
    }
}

