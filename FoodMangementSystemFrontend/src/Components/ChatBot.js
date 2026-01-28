import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: '👋 Hello! Welcome to our Food Management System. How can I assist you today?\n\n• 📖 Ask about FAQs\n• 📦 Check Order Status\n• 📅 Make a Reservation\n• ⭐ Send Feedback',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOrderStatus, setShowOrderStatus] = useState(false);
    const [showReservation, setShowReservation] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const messagesEndRef = useRef(null);

    // Form states
    const [orderStatusForm, setOrderStatusForm] = useState({ phoneNumber: '' });
    const [reservationForm, setReservationForm] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        partySize: ''
    });
    const [feedbackForm, setFeedbackForm] = useState({
        name: '',
        email: '',
        rating: 5,
        message: ''
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (text, sender) => {
        const newMessage = {
            id: messages.length + 1,
            text,
            sender,
            timestamp: new Date()
        };
        setMessages([...messages, newMessage]);
    };

    const sendMessage = async () => {
        if (inputValue.trim() === '') return;

        addMessage(inputValue, 'user');
        setInputValue('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/chatbot/message', {
                message: inputValue
            });

            if (response.data.success) {
                addMessage(response.data.message, 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('⚠️ Sorry, I encountered an error. Please try again.', 'bot');
        } finally {
            setLoading(false);
        }
    };

    const handleOrderStatusSubmit = async (e) => {
        e.preventDefault();
        if (!orderStatusForm.phoneNumber.trim()) {
            alert('Please enter your phone number');
            return;
        }

        addMessage(`Check order status for phone: ${orderStatusForm.phoneNumber}`, 'user');
        setOrderStatusForm({ phoneNumber: '' });
        setShowOrderStatus(false);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/chatbot/order-status', {
                phoneNumber: orderStatusForm.phoneNumber
            });

            if (response.data.success) {
                addMessage(response.data.message, 'bot');
            }
        } catch (error) {
            console.error('Error checking order status:', error);
            addMessage('⚠️ Unable to fetch order status. Please try again.', 'bot');
        } finally {
            setLoading(false);
        }
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
        if (!reservationForm.name || !reservationForm.phone || !reservationForm.date || !reservationForm.time || !reservationForm.partySize) {
            alert('Please fill in all fields');
            return;
        }

        addMessage(
            `Reservation request for ${reservationForm.name} on ${reservationForm.date} at ${reservationForm.time}`,
            'user'
        );
        setReservationForm({ name: '', phone: '', date: '', time: '', partySize: '' });
        setShowReservation(false);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/chatbot/reservation', reservationForm);

            if (response.data.success) {
                addMessage(response.data.message, 'bot');
            }
        } catch (error) {
            console.error('Error making reservation:', error);
            addMessage('⚠️ Unable to process reservation. Please call us.', 'bot');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!feedbackForm.name || !feedbackForm.email || !feedbackForm.message) {
            alert('Please fill in all fields');
            return;
        }

        addMessage(
            `Feedback: ${feedbackForm.rating}⭐ - ${feedbackForm.message}`,
            'user'
        );
        setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
        setShowFeedback(false);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/chatbot/feedback', feedbackForm);

            if (response.data.success) {
                addMessage(response.data.message, 'bot');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            addMessage('⚠️ Unable to submit feedback. Please try again.', 'bot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>🤖 Chat Assistant</h2>
                <p>How can we help you today?</p>
            </div>

            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            {msg.text}
                        </div>
                        <span className="message-time">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {loading && (
                    <div className="message bot">
                        <div className="message-content typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-quick-actions">
                <button
                    className="quick-action-btn"
                    onClick={() => setShowOrderStatus(!showOrderStatus)}
                >
                    📦 Order Status
                </button>
                <button
                    className="quick-action-btn"
                    onClick={() => setShowReservation(!showReservation)}
                >
                    📅 Reserve Table
                </button>
                <button
                    className="quick-action-btn"
                    onClick={() => setShowFeedback(!showFeedback)}
                >
                    ⭐ Feedback
                </button>
            </div>

            {showOrderStatus && (
                <div className="form-modal">
                    <div className="form-content">
                        <h3>Check Order Status</h3>
                        <form onSubmit={handleOrderStatusSubmit}>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                value={orderStatusForm.phoneNumber}
                                onChange={(e) => setOrderStatusForm({ phoneNumber: e.target.value })}
                                required
                            />
                            <div className="form-buttons">
                                <button type="submit">Check Status</button>
                                <button type="button" onClick={() => setShowOrderStatus(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showReservation && (
                <div className="form-modal">
                    <div className="form-content">
                        <h3>Make a Reservation</h3>
                        <form onSubmit={handleReservationSubmit}>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={reservationForm.name}
                                onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={reservationForm.phone}
                                onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                value={reservationForm.date}
                                onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                                required
                            />
                            <input
                                type="time"
                                value={reservationForm.time}
                                onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Party size"
                                min="1"
                                max="20"
                                value={reservationForm.partySize}
                                onChange={(e) => setReservationForm({ ...reservationForm, partySize: e.target.value })}
                                required
                            />
                            <div className="form-buttons">
                                <button type="submit">Reserve</button>
                                <button type="button" onClick={() => setShowReservation(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showFeedback && (
                <div className="form-modal">
                    <div className="form-content">
                        <h3>Send Your Feedback</h3>
                        <form onSubmit={handleFeedbackSubmit}>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={feedbackForm.name}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your email"
                                value={feedbackForm.email}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                required
                            />
                            <div className="rating-selector">
                                <label>Rating:</label>
                                <select
                                    value={feedbackForm.rating}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
                                >
                                    <option value="5">5 ⭐ Excellent</option>
                                    <option value="4">4 ⭐ Good</option>
                                    <option value="3">3 ⭐ Average</option>
                                    <option value="2">2 ⭐ Poor</option>
                                    <option value="1">1 ⭐ Very Poor</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Your feedback..."
                                rows="4"
                                value={feedbackForm.message}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                required
                            />
                            <div className="form-buttons">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => setShowFeedback(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="chatbot-input-area">
                <input
                    type="text"
                    placeholder="Ask me about hours, menu, orders, reservations..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading}>
                    {loading ? '⏳' : '📤 Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
