# 🚀 Tidio Integration - Quick Start Guide

## ✅ What's Already Done

Your Tidio integration is now **COMPLETE** and ready to use! Here's what has been set up:

### 1. **Tidio Script Added**
- ✅ Your Tidio script is loaded in `client/index.html`
- ✅ Public key: `ubcevakzgczdgfbdwwm648svvpyxvkap`

### 2. **React Integration**
- ✅ `TidioChat.jsx` component handles user identification
- ✅ Automatic user data tracking (email, name, purchase history)
- ✅ E-commerce event tracking

### 3. **Event Tracking Added**
- ✅ **Product Views**: Tracks when users view products
- ✅ **Add to Cart**: Tracks cart additions with product details
- ✅ **Wishlist**: Tracks wishlist additions/removals
- ✅ **Search**: Tracks search queries
- ✅ **Page Views**: Tracks navigation

### 4. **Test Component**
- ✅ `TidioTest.jsx` component for testing integration
- ✅ Test buttons to verify functionality

## 🧪 How to Test Your Integration

### Step 1: Start Your App
```bash
cd client
npm run dev
```

### Step 2: Open Your App
- Go to `http://localhost:5173` (or the port shown)
- You should see the Tidio chat widget in the bottom-right corner
- You'll also see a test panel in the bottom-right for testing

### Step 3: Test the Integration
1. **Click "Test Events"** - This will send test events to Tidio
2. **Click "Show Widget"** - This will show the chat widget
3. **Click "Hide Widget"** - This will hide the chat widget
4. **Browse your app** - Try adding items to cart, searching, etc.

### Step 4: Check Tidio Dashboard
1. Go to your [Tidio Dashboard](https://app.tidio.com)
2. Check the **Visitors** section to see user data
3. Check the **Analytics** section to see tracked events
4. Check the **Chat** section to see live chat functionality

## 🎯 What You'll See in Tidio Dashboard

### Visitor Information
- User email and name (when logged in)
- User ID and purchase history
- Real-time visitor tracking

### E-commerce Events
- `product_view` - When users view products
- `add_to_cart` - When items are added to cart
- `wishlist_add` - When items are added to wishlist
- `wishlist_remove` - When items are removed from wishlist
- `search` - When users search for products
- `page_view` - When users navigate pages

### Chat Features
- Live chat with customers
- Automated responses
- Chatbot capabilities
- Visitor tracking

## 🔧 Customization Options

### Change Widget Position
In `client/src/config/tidio.js`:
```javascript
WIDGET_SETTINGS: {
  position: 'bottom-right', // Change to: 'bottom-left', 'top-right', 'top-left'
  // ...
}
```

### Change Widget Colors
In `client/src/config/tidio.js`:
```javascript
customStyle: {
  primaryColor: '#000000', // Your brand color
  secondaryColor: '#ffffff',
  borderRadius: '8px',
  fontSize: '14px'
}
```

### Add Custom Events
In any component:
```javascript
import { trackTidioEvent } from '../config/tidio';

// Track custom event
trackTidioEvent('custom_event', {
  eventName: 'special_offer_viewed',
  offerId: 'summer_sale_2024'
});
```

## 🚨 Troubleshooting

### Chat Widget Not Appearing
1. Check browser console for errors
2. Verify no ad blockers are blocking Tidio
3. Check if the script is loading in Network tab

### Events Not Tracking
1. Check browser console for errors
2. Verify `window.tidioChatApi` is available
3. Test with the "Test Events" button

### User Data Not Updating
1. Check if user is logged in
2. Verify user object structure
3. Check browser console for errors

## 🎉 Next Steps

### 1. **Remove Test Component** (Optional)
Once you're satisfied with the integration, remove the test component:
- Remove `import TidioTest from "./components/TidioTest";` from `App.jsx`
- Remove `<TidioTest />` from the JSX

### 2. **Customize Chat Widget**
- Go to your Tidio dashboard
- Customize the chat widget appearance
- Set up automated responses
- Configure chatbot rules

### 3. **Set Up Team**
- Add team members to your Tidio account
- Train them on using the dashboard
- Set up notification preferences

### 4. **Monitor Analytics**
- Check visitor behavior in Tidio dashboard
- Analyze chat performance
- Track conversion rates

## 📞 Support

- **Tidio Documentation**: https://help.tidio.co/
- **Tidio Support**: https://www.tidio.com/support/
- **Integration Issues**: Check browser console and network tab

## 🎯 Success Metrics

Your Tidio integration will help you:
- ✅ **Increase Sales**: Live chat helps convert visitors to customers
- ✅ **Improve Support**: Real-time customer service
- ✅ **Track Behavior**: Understand user preferences
- ✅ **Automate Responses**: Handle common questions
- ✅ **Boost Engagement**: Interactive chat experience

---

**🎉 Congratulations! Your Tidio integration is now live and ready to help grow your e-commerce business!** 