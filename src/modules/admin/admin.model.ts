import {  model, Schema,type InferSchemaType } from "mongoose";





const adminSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true 
    },
    token:{
         type:String,
         default:null
    },
    count:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

export type IAdmin = InferSchemaType<typeof adminSchema>;

const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;

