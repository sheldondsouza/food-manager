const Order = require('../Models/Orders');
const Customer = require('../Models/Customer');

// FAQ Database
const FAQ_DATA = {
    hours: {
        keywords: ['hours', 'opening', 'closing', 'when', 'time', 'open'],
        response: '🕐 We are open Monday to Sunday from 11:00 AM to 11:00 PM.\nFor special occasions, we may extend hours. Call us at +1-800-FOOD-123 for details!'
    },
    menu: {
        keywords: ['menu', 'food', 'items', 'what do you serve', 'options'],
        response: '🍽️ Our menu includes:\n• Pizzas (Margherita, Pepperoni)\n• Burgers & Sandwiches\n• Salads & Veggies\n• Drinks (Soft drinks, Juices)\n• Sides (French Fries)\n\nVisit our Menu page to see all items with prices!'
    },
    delivery: {
        keywords: ['delivery', 'how long', 'delivery time', 'when will i get', 'arrives'],
        response: '🚚 Delivery times depend on your order:\n• Dine-In: 15-25 minutes\n• Take Away: 10-20 minutes\n\nYou can track your order status in our system!'
    },
    payment: {
        keywords: ['payment', 'pay', 'card', 'cash', 'methods', 'rupees', 'currency'],
        response: '💳 We accept:\n• Cash on Delivery/Table\n• Credit/Debit Cards\n• Digital Wallets\n\nAll payments are secure and encrypted!'
    },
    reservation: {
        keywords: ['reservation', 'book', 'table', 'reserve', 'booking'],
        response: '📅 Dine-In customers get automatic table assignments when they place an order!\n\nFor group reservations (8+ people), please call +1-800-FOOD-123 to book in advance.'
    },
    allergens: {
        keywords: ['allergen', 'allergy', 'gluten', 'dairy', 'vegetarian', 'vegan'],
        response: '⚠️ We have options for most dietary preferences!\nPlease mention any allergies in the special instructions when ordering.\nFor detailed allergen info, call us at +1-800-FOOD-123.'
    },
    contact: {
        keywords: ['contact', 'call', 'phone', 'email', 'address', 'location'],
        response: '📞 Contact us:\n• Phone: +1-800-FOOD-123\n• Email: support@foodmanagementsystem.com\n• Address: 123 Restaurant Lane, Food City, FC 12345\n• Hours: 11 AM - 11 PM Daily'
    },
    discount: {
        keywords: ['discount', 'coupon', 'offer', 'promo', 'deal', 'save'],
        response: '🎉 Current Offers:\n• Subscribe to our newsletter for 10% off your first order!\n• Group orders (4+ items) get 5% discount\n• Download our app for exclusive mobile-only deals!\n\nCheck our Menu page for current promotions!'
    }
};

// Helper function to find matching FAQ
const findMatchingFAQ = (userMessage) => {
    const message = userMessage.toLowerCase();

    for (const [key, faq] of Object.entries(FAQ_DATA)) {
        if (faq.keywords.some(keyword => message.includes(keyword))) {
            return faq.response;
        }
    }
    return null;
};

// Get order status
const getOrderStatus = async (orderData) => {
    try {
        const { phoneNumber, orderType } = orderData;

        // Find order by phone number and order type
        const orders = await Order.find({
            'customerDetails.customerPhone': phoneNumber
        }).sort({ orderDate: -1 }).limit(5);

        if (orders.length === 0) {
            return '❌ No orders found with this phone number. Please check and try again.';
        }

        let response = '📦 Your Recent Orders:\n\n';
        orders.forEach((order, index) => {
            response += `${index + 1}. ${order.orderType} - ${order.orderStatus}\n`;
            response += `   Date: ${new Date(order.orderDate).toLocaleDateString()}\n`;
            response += `   Amount: ₹${order.totalAmount}\n\n`;
        });

        return response;
    } catch (error) {
        console.error('Error fetching order status:', error);
        return '⚠️ Unable to fetch your order status. Please try again or call us.';
    }
};

// Reserve a table
const reserveTable = async (reservationData) => {
    try {
        const { name, phone, date, time, partySize } = reservationData;

        if (!name || !phone || !date || !time || !partySize) {
            return '⚠️ Please provide all details: Name, Phone, Date, Time, and Party Size.';
        }

        // Check if party size is valid
        if (partySize < 1 || partySize > 20) {
            return '❌ Party size should be between 1-20 people.';
        }

        // Store reservation (in a real system, this would save to database)
        // For now, just confirm it
        return `✅ Reservation Request Received!\n\nDetails:\n• Name: ${name}\n• Phone: ${phone}\n• Date: ${date}\n• Time: ${time}\n• Party Size: ${partySize} people\n\nWe will confirm your reservation shortly. Please check your phone for a confirmation call!`;
    } catch (error) {
        console.error('Error processing reservation:', error);
        return '⚠️ Unable to process reservation. Please call us at +1-800-FOOD-123';
    }
};

// Send feedback
const sendFeedback = async (feedbackData) => {
    try {
        const { name, email, rating, message } = feedbackData;

        if (!name || !email || !rating || !message) {
            return '⚠️ Please provide all fields: Name, Email, Rating (1-5), and Message.';
        }

        if (rating < 1 || rating > 5) {
            return '❌ Rating must be between 1 and 5 stars.';
        }

        // Store feedback (in a real system, this would save to database)
        console.log('Feedback received:', { name, email, rating, message });

        return `✅ Thank you for your feedback, ${name}!\n\nYour ${rating}-star review has been recorded. We appreciate your input and will use it to improve our service!`;
    } catch (error) {
        console.error('Error processing feedback:', error);
        return '⚠️ Unable to submit feedback. Please try again.';
    }
};

// Main chat handler
exports.handleChatMessage = async (userMessage, intent, additionalData = {}) => {
    try {
        console.log('Chat message received:', { userMessage, intent, additionalData });

        switch (intent) {
            case 'faq':
                const faqResponse = findMatchingFAQ(userMessage);
                if (faqResponse) {
                    return faqResponse;
                }
                return '🤔 I didn\'t quite understand that. Here are some things I can help with:\n\n• 🕐 Hours of Operation\n• 🍽️ Menu & Food Items\n• 🚚 Delivery Time\n• 💳 Payment Methods\n• 📅 Reservations\n• ⚠️ Allergen Information\n• 📞 Contact Us\n• 🎉 Discounts & Offers\n\nJust ask me about any of these!';

            case 'order_status':
                return await getOrderStatus(additionalData);

            case 'reservation':
                return await reserveTable(additionalData);

            case 'feedback':
                return await sendFeedback(additionalData);

            case 'greeting':
                return '👋 Hello! Welcome to our Food Management System. How can I assist you today?\n\n• 📖 Ask about FAQs\n• 📦 Check Order Status\n• 📅 Make a Reservation\n• ⭐ Send Feedback';

            default:
                return '😊 I\'m not sure how to help with that. Would you like me to:\n\n• Answer FAQs\n• Check your order status\n• Help with a reservation\n• Collect your feedback';
        }
    } catch (error) {
        console.error('Error handling chat message:', error);
        return '⚠️ Something went wrong. Please try again or contact us at +1-800-FOOD-123';
    }
};

// Get all FAQs
exports.getAllFAQs = () => {
    return Object.entries(FAQ_DATA).map(([key, value]) => ({
        category: key.toUpperCase(),
        response: value.response
    }));
};

// Detect intent from message
exports.detectIntent = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes('order') || msg.includes('status') || msg.includes('track')) {
        return 'order_status';
    }
    if (msg.includes('reserve') || msg.includes('booking') || msg.includes('table')) {
        return 'reservation';
    }
    if (msg.includes('feedback') || msg.includes('review') || msg.includes('rating') || msg.includes('experience')) {
        return 'feedback';
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
        return 'greeting';
    }

    return 'faq';
};
