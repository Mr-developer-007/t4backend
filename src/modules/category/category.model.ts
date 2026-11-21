import { model, Schema } from "mongoose";



const categorySchema = new Schema({
 name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

     slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

     image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },


},{timestamps:true})



const Category = model("Category",categorySchema);

export default Category;
