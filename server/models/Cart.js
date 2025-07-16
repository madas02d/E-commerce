import { Schema, model} from "mongoose";

const CartSchema = new Schema({
    items: [
        {
          product: { 
            type: Schema.Types.ObjectId, 
            ref: "Product",
            required: true 
          },
          selectedSize: {
            type: String,
            enum: ['xs', 's', 'm', 'l', 'xl'],
            required: true
          },
          quantity: { 
            type: Number, 
            required: true, 
            default: 1
          },
        },
    ],
});

export default model("Cart", CartSchema);


