# Tidio Integration Setup Guide

## Overview
This guide will help you integrate Tidio live chat into your DressMe e-commerce application.

## Step 1: Get Your Tidio Account

1. Go to [Tidio.com](https://www.tidio.com) and create a free account
2. Complete the setup process
3. Get your **Public Key** from the Tidio dashboard

## Step 2: Update Configuration

### Update HTML Script
In `client/index.html`, replace `YOUR_TIDIO_PUBLIC_KEY` with your actual public key:

```html
<script src="//code.tidio.co/YOUR_ACTUAL_PUBLIC_KEY.js" async></script>
```

### Update Config File
In `client/src/config/tidio.js`, update the public key:

```javascript
export const TIDIO_CONFIG = {
  PUBLIC_KEY: 'YOUR_ACTUAL_PUBLIC_KEY',
  // ... rest of config
};
```

## Step 3: Customize Chat Widget

### Position and Styling
In `client/src/config/tidio.js`, customize the widget settings:

```javascript
WIDGET_SETTINGS: {
  position: 'bottom-right', // Change position as needed
  initiallyHidden: false,
  customStyle: {
    primaryColor: '#000000', // Your brand color
    secondaryColor: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px'
  }
}
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your app
3. You should see the Tidio chat widget in the bottom-right corner
4. Test the chat functionality

## Features Included

### ✅ User Identification
- Automatically identifies logged-in users
- Tracks user email, name, and custom fields
- Updates user data when they log in/out

### ✅ E-commerce Event Tracking
- **Product Views**: Tracks when users view products
- **Add to Cart**: Tracks cart additions with product details
- **Purchases**: Tracks completed orders
- **Search**: Tracks search queries
- **Page Views**: Tracks navigation

### ✅ Custom Events
The following events are automatically tracked:
- `product_view` - When users view products
- `add_to_cart` - When items are added to cart
- `purchase` - When orders are completed
- `search` - When users search for products
- `page_view` - When users navigate pages
- `user_login` - When users log in
- `user_logout` - When users log out

## Usage in Components

### Track Product Views
```javascript
// In your product component
import { trackTidioEvent } from '../config/tidio';

const handleProductView = (product) => {
  trackTidioEvent('product_view', {
    productId: product._id,
    productName: product.title,
    productPrice: product.price,
    category: product.category
  });
};
```

### Track Add to Cart
```javascript
// In your cart component
const handleAddToCart = (product, quantity) => {
  trackTidioEvent('add_to_cart', {
    productId: product._id,
    productName: product.title,
    productPrice: product.price,
    quantity,
    category: product.category
  });
};
```

### Track Purchases
```javascript
// In your checkout component
const handlePurchase = (order) => {
  trackTidioEvent('purchase', {
    orderId: order._id,
    totalAmount: order.totalAmount,
    itemsCount: order.items.length,
    currency: 'EUR'
  });
};
```

## Tidio Dashboard Features

Once integrated, you can use these Tidio features:

### 🎯 Visitor Tracking
- See real-time visitor information
- Track user behavior and preferences
- View user purchase history

### 💬 Live Chat
- Respond to customer inquiries in real-time
- Use chatbots for common questions
- Set up automated responses

### 📊 Analytics
- Track conversion rates
- Monitor chat performance
- Analyze customer interactions

### 🤖 Chatbots
- Create automated responses
- Set up product recommendations
- Handle common customer service queries

## Advanced Configuration

### Custom Chat Triggers
You can trigger the chat widget programmatically:

```javascript
// Show chat widget
if (window.tidioChatApi) {
  window.tidioChatApi.show();
}

// Hide chat widget
if (window.tidioChatApi) {
  window.tidioChatApi.hide();
}
```

### Custom Chat Events
Track custom events for better analytics:

```javascript
// Track custom events
trackTidioEvent('custom_event', {
  eventName: 'special_offer_viewed',
  offerId: 'summer_sale_2024',
  discount: '20%'
});
```

## Troubleshooting

### Chat Widget Not Appearing
1. Check if the Tidio script is loading in browser dev tools
2. Verify your public key is correct
3. Ensure no ad blockers are blocking the script

### Events Not Tracking
1. Check browser console for errors
2. Verify `window.tidioChatApi` is available
3. Ensure events are being called after Tidio loads

### User Data Not Updating
1. Check if user context is properly set
2. Verify user object structure matches expected format
3. Check browser console for any errors

## Support

For Tidio-specific issues:
- [Tidio Documentation](https://help.tidio.co/)
- [Tidio Support](https://www.tidio.com/support/)

For integration issues:
- Check the browser console for errors
- Verify all configuration files are updated
- Test with a fresh browser session

## Next Steps

1. **Set up your Tidio account** and get your public key
2. **Update the configuration** with your actual public key
3. **Test the integration** in development
4. **Customize the chat widget** styling to match your brand
5. **Set up automated responses** in the Tidio dashboard
6. **Train your team** on using the Tidio dashboard

The integration is now ready! Your customers will have access to live chat support, and you'll be able to track their behavior for better customer service. 