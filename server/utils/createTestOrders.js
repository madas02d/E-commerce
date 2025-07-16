import connectDB from "./database.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const createTestOrders = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Creating test orders...\n');
    
    // Get the first user (or you can specify an email)
    const user = await User.findOne({});
    if (!user) {
      console.log('❌ No users found. Please register a user first.');
      process.exit(1);
    }
    
    console.log(`👤 Using user: ${user.fullName} (${user.email})`);
    
    // Get some products (or create test products)
    let products = await Product.find({}).limit(3);
    
    if (products.length === 0) {
      console.log('📦 No products found. Creating test products...');
      
      // Create some test products
      const testProducts = [
        {
          title: "Test Dress 1",
          price: 29.99,
          category: "women's clothing",
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
        },
        {
          title: "Test Shirt 2", 
          price: 19.99,
          category: "men's clothing",
          image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
        },
        {
          title: "Test Jacket 3",
          price: 49.99,
          category: "men's clothing", 
          image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
        }
      ];
      
      products = await Product.insertMany(testProducts);
      console.log(`✅ Created ${products.length} test products`);
    }
    
    // Create test orders
    const testOrders = [
      {
        userId: user._id,
        items: [
          { product: products[0]._id, quantity: 2 },
          { product: products[1]._id, quantity: 1 }
        ],
        address: "123 Test Street, Test City, 12345",
        phone: "+1234567890",
        totalAmount: (products[0].price * 2) + products[1].price,
        status: "delivered"
      },
      {
        userId: user._id,
        items: [
          { product: products[2]._id, quantity: 1 }
        ],
        address: "456 Another Street, Another City, 67890",
        phone: "+1234567890",
        totalAmount: products[2].price,
        status: "shipped"
      }
    ];
    
    const createdOrders = await Order.insertMany(testOrders);
    
    console.log(`✅ Created ${createdOrders.length} test orders:`);
    createdOrders.forEach(order => {
      console.log(`  - Order ${order._id.slice(-8)}: €${order.totalAmount} (${order.items.length} items) - Status: ${order.status}`);
    });
    
    // Calculate total spent
    const allUserOrders = await Order.find({ userId: user._id });
    const totalSpent = allUserOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
    
    console.log(`\n💰 Total spent for ${user.fullName}: €${totalSpent.toFixed(2)}`);
    console.log('\n✅ Test orders created successfully!');
    console.log('🔄 Now refresh your dashboard to see the total spent update.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test orders:', error);
    process.exit(1);
  }
};

createTestOrders(); 