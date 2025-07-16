import { Schema, model } from "mongoose";

const WishlistSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            addedAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

export default model("Wishlist", WishlistSchema); 