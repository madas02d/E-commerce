import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
      },
    
    email: {
        type: String,
        required: true,
        unique: true        
      },
    
    password: {
        type: String,
        required: true
      },
    
    cartId: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      }
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default model("User", UserSchema);