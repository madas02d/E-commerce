import mongoose from "mongoose";
import data from "./products.js";
import Product from "../models/Product.js";
import "dotenv/config";

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    const products = data.map((item) => new Product(item));

    await Product.deleteMany();
    console.log("Data Deleted successfully");

    await Product.insertMany(products);
    console.log("Data Seeded successfully");
  } catch (error) {
    console.log(`Error While seeding data: ${error}`);
  } finally {
    mongoose.connection.close();
    console.log("Connection to the database was closed");
  }
})();
