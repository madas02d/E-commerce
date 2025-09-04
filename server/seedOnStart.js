import mongoose from "mongoose";
import data from "./seed/products.js";
import Product from "./models/Product.js";
import "dotenv/config";

const seedDatabase = async () => {
  try {
    console.log("Checking if database needs seeding...");
    
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      console.log("No products found. Seeding database...");
      const products = data.map((item) => new Product(item));
      await Product.insertMany(products);
      console.log("Database seeded successfully with", products.length, "products");
    } else {
      console.log("Database already has", existingProducts, "products. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase;
