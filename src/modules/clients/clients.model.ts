
import { type InferSchemaType } from "mongoose";
import { model, Schema } from "mongoose";






const ClientSchema = new Schema(
  {
    
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    businessName: {
      type: String,
      required: [true, "Travel agency name is required"],
      trim: true,
      maxlength: 150,
    },

    businessDescription: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    // Agency location
    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },



    businessRegistrationNumber: {
      type: String,
      trim: true,
      default: "",
    },


    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export type IClient = InferSchemaType<typeof ClientSchema>;
const Client = model<IClient>("Client", ClientSchema);

export default Client;
