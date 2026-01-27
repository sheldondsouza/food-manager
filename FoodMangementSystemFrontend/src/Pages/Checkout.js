import React, { useState, useRef, useEffect } from 'react';
import './CheckOut.css';
import InstructionModal from '../Components/InstructionModal';
import axios from 'axios';
const Checkout = ({ cart, setCart, goBack }) => {
  const [dineType, setDineType] = useState('Dine-In');
  const [showModal, setShowModal] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const handleQuantity = (index, action) => {
    const newCart = [...cart];
    if (action === 'inc') newCart[index].quantity += 1;
    if (action === 'dec') {
      if (newCart[index].quantity > 1) {
        newCart[index].quantity -= 1;
      } else {
        newCart.splice(index, 1);
      }
    }

    setCart(newCart);
  };
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to your cart before placing an order.');
      return;
    }

    // Validate customer details
    if (!customerDetails.name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!customerDetails.phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    if (dineType === 'Take Away' && !customerDetails.address.trim()) {
      alert('Please enter your address for takeaway orders.');
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

    const orderDetails = {
      orderType: dineType,
      instructions,
      items: cart.map(item => ({
        itemName: item.name,
        itemPrice: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      ItemsCount,
      totalAmount,
      orderStatus: 'Processing',
      customerDetails: {
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerAddress: customerDetails.address,
      },
    };

    try {
      console.log('📤 Order Details Sent:', orderDetails);
      const response = await axios.post('http://localhost:5001/custommers/placeOrder', orderDetails, {
        timeout: 10000 // 10 second timeout
      });
      console.log('✅ Order placed successfully:', response.data);
      alert(response.data.data?.tableData ? `✅ Order placed successfully! Your table number is ${response.data.data.tableData.tableNumber}` : '✅ Order placed successfully! Your order will be ready soon.');
      handleOrderSuccess();
    } catch (error) {
      console.error('❌ Error placing order:', error);

      let errorMessage = 'Failed to place order. ';

      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. Please check if backend is running and try again.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage += 'Network Error. Please check:\n1. Backend server is running\n2. Internet connection is stable\n\nTry clicking Swipe to Order again in a moment.';
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    }
  };
  const swipeStartX = useRef(null);
  const swipeEndX = useRef(null);

  const handleTouchStart = (e) => {
    swipeStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    swipeEndX.current = e.changedTouches[0].clientX;
    const diff = swipeEndX.current - swipeStartX.current;

    const dynamicIsMobile = window.innerWidth <= 768;

    if (diff > 60 && dynamicIsMobile) {
      console.log("Swipe detected! Placing order...");
      placeOrder();
    } else if (diff < 0) {
      console.log("👈 Swiped left – not placing order.");
    } else {
      console.log("👉 Swipe too short");
    }
  };

  const handleClick = () => {
    const dynamicIsMobile = window.innerWidth <= 768;
    if (!dynamicIsMobile) {
      console.log("🖱️ Desktop click detected. Placing order.");
      placeOrder();
    }
  };
  const handleOrderSuccess = () => {
    setCart([]);
    setInstructions('');
    setCustomerDetails({
      name: '',
      phone: '',
      address: '',
    });
    goBack();
  };
  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  useEffect(() => {
    console.log('Checkout component mounted/updated. Cart:', cart);
  }, [cart]);

  const getItemTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryCharge = dineType === 'Take Away' ? 50 : 0;
  const tax = 5;
  const grandTotal = getItemTotal() + deliveryCharge + tax;

  return (
    <div className="checkout">
      <h3>Good evening</h3>
      <p>Place your order here</p>

      <div className="cart-items">
        {cart.map((item, index) => (
          <div className="cart-item" key={index}>
            <img src={`/images/${item.image}`} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>₹ {item.price}</p>
              <div className="qty-controls">
                <button onClick={() => handleQuantity(index, 'dec')}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantity(index, 'inc')}>+</button>
              </div>
              <p onClick={() => setShowModal(true)} className="add-note">Add cooking instructions (optional)</p>
            </div>
            <button className="remove-btn" onClick={() => removeItem(index)}>❌</button>
          </div>
        ))}
      </div>

      <div className="dine-options">
        <button
          className={dineType === 'Dine-In' ? 'active' : ''}
          onClick={() => setDineType('Dine-In')}
        >
          Dine In
        </button>
        <button
          className={dineType === 'Take Away' ? 'active' : ''}
          onClick={() => setDineType('Take Away')}
        >
          Take Away
        </button>
      </div>

      <div className="cost-summary">
        <p>Item Total <span>₹{getItemTotal()}</span></p>
        <p>Delivery Charge <span>₹{deliveryCharge}</span></p>
        <p>Taxes <span>₹{tax}</span></p>
        <h4>Grand Total <span>₹{grandTotal}</span></h4>
      </div>
      <div className='form-header'>
        <h4>Your Details</h4>
      </div>
      <div className="your-details">
        <form>



          <label>

            <input
              type="text"
              value={customerDetails.name}
              placeholder='Enter your name'
              onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
            />
          </label>
          <label>

            <input
              type="text"
              value={customerDetails.phone}
              placeholder='Enter your phone number'
              onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
            />
          </label>



        </form>

        <div className="address-label">
          <img src="/Location.png" alt="Address Icon" />
          <input
            type="text"
            value={dineType === 'Dine-In' ? '' : customerDetails.address}
            placeholder={dineType === 'Dine-In' ? 'Table Will be automatically assigned you only enter your name and phone' : 'Enter your address'}
            onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
            readOnly={dineType === 'Dine-In'}
          />
        </div>
      </div>

      <button
        className="swipe-order-btn"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={
          handleClick
        }
      >
        ➡️ Swipe to Order
      </button>


      {showModal && (
        <InstructionModal
          instructions={instructions}
          setInstructions={setInstructions}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
