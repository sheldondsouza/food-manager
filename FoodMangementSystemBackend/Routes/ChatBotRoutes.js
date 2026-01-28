const express = require('express');
const router = express.Router();
const ChatBotController = require('../Controllers/ChatBotController');

// Chat message endpoint
router.post('/message', ChatBotController.sendMessage);

// Get all FAQs
router.get('/faqs', ChatBotController.getFAQs);

// Check order status
router.post('/order-status', ChatBotController.checkOrderStatus);

// Make reservation
router.post('/reservation', ChatBotController.makeReservation);

// Submit feedback
router.post('/feedback', ChatBotController.submitFeedback);

module.exports = router;
