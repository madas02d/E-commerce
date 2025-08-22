import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TIDIO_CONFIG, trackTidioEvent, updateTidioUser } from '../config/tidio.js';

const TidioChat = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Wait for Tidio to load
    const initTidio = () => {
      if (window.tidioChatApi) {
        // Set user information if logged in
        if (user) {
          updateTidioUser(user);
        }

        // Set up event listeners for e-commerce tracking
        window.tidioChatApi.on('ready', () => {
          console.log('Tidio chat is ready');
        });

        // Track page views
        trackTidioEvent(TIDIO_CONFIG.EVENTS.PAGE_VIEW, {
          page: window.location.pathname,
          title: document.title
        });

        // Track user actions
        const trackUserAction = (action, data = {}) => {
          trackTidioEvent(action, {
            ...data,
            userId: user?._id
          });
        };

        // Expose tracking function globally for other components
        window.trackTidioEvent = trackUserAction;
      } else {
        // Retry after a short delay if Tidio hasn't loaded yet
        setTimeout(initTidio, 1000);
      }
    };

    // Initialize Tidio
    initTidio();

    // Cleanup function
    return () => {
      if (window.trackTidioEvent) {
        delete window.trackTidioEvent;
      }
    };
  }, [user]);

  // Custom functions for e-commerce events
  const trackProductView = (product) => {
    if (window.trackTidioEvent) {
      window.trackTidioEvent('product_view', {
        productId: product._id,
        productName: product.title,
        productPrice: product.price,
        category: product.category
      });
    }
  };

  const trackAddToCart = (product, quantity = 1) => {
    if (window.trackTidioEvent) {
      window.trackTidioEvent('add_to_cart', {
        productId: product._id,
        productName: product.title,
        productPrice: product.price,
        quantity,
        category: product.category
      });
    }
  };

  const trackPurchase = (order) => {
    if (window.trackTidioEvent) {
      window.trackTidioEvent('purchase', {
        orderId: order._id,
        totalAmount: order.totalAmount,
        itemsCount: order.items.length,
        currency: 'EUR'
      });
    }
  };

  const trackSearch = (query) => {
    if (window.trackTidioEvent) {
      window.trackTidioEvent('search', {
        query,
        resultsCount: 0 // You can update this based on search results
      });
    }
  };

  // Expose tracking functions globally
  useEffect(() => {
    window.tidioTracking = {
      trackProductView,
      trackAddToCart,
      trackPurchase,
      trackSearch
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TidioChat; 