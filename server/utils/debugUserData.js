import connectDB from "./database.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";

const debugUserData = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Checking database for users and orders...\n');
    
    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`  - ${user.fullName} (${user.email}) - ID: ${user._id}`);
    });
    
    console.log('\n📦 Checking orders...');
    const allOrders = await Order.find({});
    console.log(`Found ${allOrders.length} total orders in database`);
    
    if (allOrders.length > 0) {
      console.log('\n📋 Order details:');
      allOrders.forEach(order => {
        console.log(`  - Order ${order._id.slice(-8)}: €${order.totalAmount || 'NO TOTAL'} (${order.items.length} items) - User: ${order.userId}`);
      });
    } else {
      console.log('❌ No orders found in database');
    }
    
    console.log('\n🛒 Checking carts...');
    const carts = await Cart.find({});
    console.log(`Found ${carts.length} carts in database`);
    
    console.log('\n💝 Checking wishlists...');
    const wishlists = await Wishlist.find({});
    console.log(`Found ${wishlists.length} wishlists in database`);
    
    console.log('\n✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
};

debugUserData(); 