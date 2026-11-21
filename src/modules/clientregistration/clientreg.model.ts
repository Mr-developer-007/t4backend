import { model, Schema } from "mongoose";


const reqFormSchema = new Schema({

 name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
 businessName: {
      type: String,
      required: [true, "Travel agency name is required"],
      trim: true,
      maxlength: 150,
    },

  description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },
    status:{
        type:Boolean,
        default:false
    }

},{
      timestamps: true,
    versionKey: false,
})


const Regform = model("Regform", reqFormSchema);

export default Regform
