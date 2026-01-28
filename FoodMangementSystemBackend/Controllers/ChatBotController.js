const chatBotService = require('../Services/ChatBotServices');

exports.sendMessage = async (req, res) => {
    try {
        const { message, additionalData } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message cannot be empty'
            });
        }

        // Detect intent from the message
        const intent = chatBotService.detectIntent(message);

        // Get bot response
        const botResponse = await chatBotService.handleChatMessage(message, intent, additionalData || {});

        res.status(200).json({
            success: true,
            message: botResponse,
            intent: intent
        });
    } catch (error) {
        console.error('Error in chatbot:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing your request. Please try again.'
        });
    }
};

exports.getFAQs = async (req, res) => {
    try {
        const faqs = chatBotService.getAllFAQs();
        res.status(200).json({
            success: true,
            data: faqs
        });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching FAQs'
        });
    }
};

exports.checkOrderStatus = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const response = await chatBotService.handleChatMessage(
            'Check my order status',
            'order_status',
            { phoneNumber }
        );

        res.status(200).json({
            success: true,
            message: response
        });
    } catch (error) {
        console.error('Error checking order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking order status'
        });
    }
};

exports.makeReservation = async (req, res) => {
    try {
        const { name, phone, date, time, partySize } = req.body;

        const response = await chatBotService.handleChatMessage(
            'Make a reservation',
            'reservation',
            { name, phone, date, time, partySize }
        );

        res.status(200).json({
            success: true,
            message: response
        });
    } catch (error) {
        console.error('Error making reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error making reservation'
        });
    }
};

exports.submitFeedback = async (req, res) => {
    try {
        const { name, email, rating, message } = req.body;

        const response = await chatBotService.handleChatMessage(
            'Submit feedback',
            'feedback',
            { name, email, rating, message }
        );

        res.status(200).json({
            success: true,
            message: response
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback'
        });
    }
};
