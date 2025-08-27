// Tidio Configuration and Analytics Tracking
// This file contains configuration for Tidio chat widget and analytics tracking

// Tidio Configuration
export const TIDIO_CONFIG = {
  // Public ID for Tidio widget (you'll need to replace this with your actual Tidio public ID)
  PUBLIC_ID: import.meta.env.VITE_TIDIO_KEY,

  
  // Event types for analytics tracking
  EVENTS: {
    PAGE_VIEW: 'page_view',
    PRODUCT_VIEW: 'product_view',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    WISHLIST_ADD: 'wishlist_add',
    WISHLIST_REMOVE: 'wishlist_remove',
    SEARCH: 'search',
    PURCHASE: 'purchase',
    LOGIN: 'login',
    REGISTER: 'register',
    CHECKOUT_START: 'checkout_start',
    CHECKOUT_COMPLETE: 'checkout_complete'
  },
  
  // User properties that can be tracked
  USER_PROPERTIES: {
    USER_ID: 'user_id',
    EMAIL: 'email',
    NAME: 'name',
    TOTAL_ORDERS: 'total_orders',
    TOTAL_SPENT: 'total_spent',
    LAST_PURCHASE_DATE: 'last_purchase_date'
  }
};

/**
 * Track custom events in Tidio
 * @param {string} eventName - Name of the event to track
 * @param {Object} eventData - Additional data for the event
 */
export const trackTidioEvent = (eventName, eventData = {}) => {
  try {
    // Check if Tidio is available
    if (window.tidioChatApi && window.tidioChatApi.track) {
      window.tidioChatApi.track(eventName, eventData);
      console.log(`Tidio event tracked: ${eventName}`, eventData);
    } else {
      console.warn('Tidio API not available for tracking:', eventName);
    }
  } catch (error) {
    console.error('Error tracking Tidio event:', error);
  }
};

/**
 * Update user information in Tidio
 * @param {Object} user - User object containing user data
 */
export const updateTidioUser = (user) => {
  try {
    if (window.tidioChatApi && window.tidioChatApi.visitor) {
      // Set visitor information
      window.tidioChatApi.visitor.data({
        email: user.email,
        name: user.name || user.username,
        userId: user._id,
        // Add any other user properties you want to track
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent || 0
      });
      
      console.log('Tidio user updated:', user.email);
    } else {
      console.warn('Tidio API not available for user update');
    }
  } catch (error) {
    console.error('Error updating Tidio user:', error);
  }
};

/**
 * Initialize Tidio widget
 * This function should be called when the app loads
 */
export const initializeTidio = () => {
  try {
    // Check if Tidio script is already loaded
    if (window.tidioChatApi) {
      console.log('Tidio already initialized');
      return;
    }

    // Load Tidio script if not already loaded
    const script = document.createElement('script');
    script.src = `//code.tidio.co/${TIDIO_CONFIG.PUBLIC_ID}.js`;
    script.async = true;
    script.onload = () => {
      console.log('Tidio script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Tidio script');
    };
    
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error initializing Tidio:', error);
  }
};

/**
 * Hide Tidio widget
 */
export const hideTidio = () => {
  try {
    if (window.tidioChatApi && window.tidioChatApi.hide) {
      window.tidioChatApi.hide();
    }
  } catch (error) {
    console.error('Error hiding Tidio:', error);
  }
};

/**
 * Show Tidio widget
 */
export const showTidio = () => {
  try {
    if (window.tidioChatApi && window.tidioChatApi.show) {
      window.tidioChatApi.show();
    }
  } catch (error) {
    console.error('Error showing Tidio:', error);
  }
};

/**
 * Open Tidio chat
 */
export const openTidioChat = () => {
  try {
    if (window.tidioChatApi && window.tidioChatApi.open) {
      window.tidioChatApi.open();
    }
  } catch (error) {
    console.error('Error opening Tidio chat:', error);
  }
};

/**
 * Close Tidio chat
 */
export const closeTidioChat = () => {
  try {
    if (window.tidioChatApi && window.tidioChatApi.close) {
      window.tidioChatApi.close();
    }
  } catch (error) {
    console.error('Error closing Tidio chat:', error);
  }
}; 