import connectDB from "./database.js";
import Order from "../models/Order.js";

const updateOrderTotals = async () => {
  try {
    await connectDB();
    
    // Find all orders that don't have totalAmount
    const orders = await Order.find({ totalAmount: { $exists: false } });
    
    console.log(`Found ${orders.length} orders without totalAmount`);
    
    for (const order of orders) {
      // Calculate total amount from items
      const totalAmount = order.items.reduce((total, item) => {
        return total + (item.price * item.quantity || 0);
      }, 0);
      
      // Update the order with totalAmount
      await Order.findByIdAndUpdate(order._id, { totalAmount });
      console.log(`Updated order ${order._id} with totalAmount: ${totalAmount}`);
    }
    
    console.log('All orders updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating orders:', error);
    process.exit(1);
  }
};

updateOrderTotals(); 