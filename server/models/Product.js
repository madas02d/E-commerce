import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
    },

    price: { 
        type: Number, 
        required: true,
    },
    
    // brandName: { 
    //     type: String, 
    //     required: true 
    // },

    category: {
        type: String,
        enum: ["Women", "Men", "Unisex", "Kids"], // The only four possible values
        required: true,
  },

    image: { 
    type: String, 
    required: true
  },

   

    size: {
        xs: { quantity: Number },
        s: { quantity: Number },
        m: { quantity: Number },
        l: { quantity: Number },
        xl: { quantity: Number },
  },

    cartId: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
  }
  });

export default model("Product", ProductSchema);