import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import ItemCard from './ItemCard';
import './Menu.css';
import axios from 'axios';

// const mockItems = [
// { id: 1, name: 'Classic Burger', category: 'Burger', price: 120, image: 'classicburger.png' },
// { id: 2, name: 'Cheese Burger', category: 'Burger', price: 140, image: 'cheeseburger.png' },
// { id: 3, name: 'Capricciosa', category: 'Pizza', price: 200, image: 'capricciosa.png' },
// { id: 4, name: 'Sicilian', category: 'Pizza', price: 150, image: 'sicilian.png' },
// { id: 5, name: 'Cola', category: 'Drink', price: 60, image: 'cola.png' },
// { id: 6, name: 'French Fries', category: 'French_fries', price: 80, image: 'fries.png' },
// { id: 7, name: 'Green Salad', category: 'Veggies', price: 100, image: 'salad.png' },
// { id: 9, name: 'Veggie Pizza', category: 'Pizza', price: 170, image: 'veggiepizza.png' },
// { id: 10, name: 'Pepperoni Pizza', category: 'Pizza', price: 220, image: 'pepperoni_pizza.png' },
// { id: 11, name: 'Iced Tea', category: 'Drink', price: 50, image: 'iced_tea.png' },
// { id: 12, name: 'Garlic Bread', category: 'French_fries', price: 90, image: 'garlic_bread.png' },
// { id: 13, name: 'Caesar Salad', category: 'Veggies', price: 110, image: 'caesar_salad.png' },
// { id: 14, name: 'Spicy Chicken Burger', category: 'Burger', price: 160, image: 'spicy_chicken_burger.png' },
// { id: 15, name: 'Veggie Delight Pizza', category: 'Pizza', price: 180, image: 'veggie_delight_pizza.png' },
// { id: 16, name: 'Lemonade', category: 'Drink', price: 70, image: 'lemonade.png' },
// { id: 17, name: 'Onion Rings', category: 'French_fries', price: 85, image: 'onion_rings.png' },
// { id: 18, name: 'Greek Salad', category: 'Veggies', price: 120, image: 'greek_salad.png' },
// { id: 19, name: 'Chicken Fajita', category: 'Burger', price: 170, image: 'chicken_fajita.png' },
// { id: 20, name: 'Chicken Pizza', category: 'Pizza', price: 210, image: 'chicken_pizza.png' },
// { id: 21, name: 'Mango Smoothie', category: 'Drink', price: 80, image: 'mango_smoothie.png' },
// { id: 22, name: 'Sweet Potato Fries', category: 'French_fries', price: 95, image: 'sweet_potato_fries.png' },
// { id: 23, name: 'Avocado Salad', category: 'Veggies', price: 130, image: 'avocado_salad.png' },
// { id: 24, name: 'Double Cheese Burger', category: 'Burger', price: 180, image: 'double_cheese_burger.png' },
// { id: 25, name: 'BBQ Chicken Pizza', category: 'Pizza', price: 230, image: 'bbq_chicken_pizza.png' },
// { id: 26, name: 'Fruit Punch', category: 'Drink', price: 75, image: 'fruit_punch.png' },
// { id: 27, name: 'Loaded Nachos', category: 'French_fries', price: 110, image: 'loaded_nachos.png' },
// { id: 28, name: 'Cobb Salad', category: 'Veggies', price: 140, image: 'cobb_salad.png' },
// { id: 29, name: 'Chicken Tikka Burger', category: 'Burger', price: 190, image: 'chicken_tikka_burger.png' },
// { id: 30, name: 'Veg Supreme Pizza', category: 'Pizza', price: 200, image: 'veg_supreme_pizza.png' },
// { id: 31, name: 'Iced Coffee', category: 'Drink', price: 65, image: 'iced_coffee.png' },
// { id: 32, name: 'Curly Fries', category: 'French_fries', price: 100, image: 'curly_fries.png' },
// { id: 33, name: 'Caprese Salad', category: 'Veggies', price: 115, image: 'caprese_salad.png' },
// { id: 34, name: 'Fish Burger', category: 'Burger', price: 200, image: 'fish_burger.png' },
// { id: 35, name: 'Hawaiian Pizza', category: 'Pizza', price: 220, image: 'hawaiian_pizza.png' },
// { id: 36, name: 'Sparkling Water', category: 'Drink', price: 55, image: 'sparkling_water.png' },
// { id: 37, name: 'Cheesy Fries', category: 'French_fries', price: 120, image: 'cheesy_fries.png' },
// { id: 38, name: 'Spinach Salad', category: 'Veggies', price: 125, image: 'spinach_salad.png' },
// { id: 39, name: 'BBQ Burger', category: 'Burger', price: 210, image: 'bbq_burger.png' },
// { id: 40, name: 'Meat Lovers Pizza', category: 'Pizza', price: 240, image: 'meat_lovers_pizza.png' },
// { id: 41, name: 'Herbal Tea', category: 'Drink', price: 60, image: 'herbal_tea.png' },
// { id: 42, name: 'Truffle Fries', category: 'French_fries', price: 130, image: 'truffle_fries.png' },
// { id: 43, name: 'Roasted Veggie Salad', category: 'Veggies', price: 135, image: 'roasted_veggie_salad.png' },
// ];

const Menu = ({ cart, setCart, goToCheckout }) => {
  const [category, setCategory] = useState('Pizza');
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockItems = [
    { id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 250, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop', description: 'Classic pizza' },
    { id: '2', name: 'Pepperoni Pizza', category: 'Pizza', price: 280, image: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=400&fit=crop', description: 'Pepperoni pizza' },
    { id: '3', name: 'Classic Burger', category: 'Burger', price: 150, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', description: 'Tasty burger' },
    { id: '4', name: 'Cheese Burger', category: 'Burger', price: 180, image: 'https://images.unsplash.com/photo-1550547990-24649f5f8bcf?w=400&h=400&fit=crop', description: 'Cheese burger' },
    { id: '5', name: 'French Fries', category: 'French Fries', price: 80, image: 'https://images.unsplash.com/photo-1365739417892-b2ddb9bc1d2e?w=400&h=400&fit=crop', description: 'Crispy fries' },
    { id: '6', name: 'Caesar Salad', category: 'Salad', price: 120, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', description: 'Fresh salad' },
  ];

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/custommers/getAllFoodItemsForConsumers');

      if (response.data && response.data.length > 0) {
        const items = response.data.map(item => ({
          id: item._id,
          name: item.FoodItemName,
          category: item.FoodItemCategory,
          price: item.FoodItemPrice,
          image: item.FoodItemImageUrl,
          description: item.FoodItemDescription,
          quantity: 0
        }));
        console.log('✅ Fetched from API:', items);
        setAllItems(items);
      } else {
        console.log('⚠️ No data from API, using mock items');
        setAllItems(mockItems);
      }
    }
    catch (error) {
      console.error('❌ Error fetching food items:', error);
      console.log('Using mock items as fallback');
      setAllItems(mockItems);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // Reload items when component mounts or when coming back from checkout
  React.useEffect(() => {
    console.log('Menu component loaded, allItems:', allItems);
  }, [allItems]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchFoodItems();
    } else {
      handleFoodItemSearch(query);
    }
  };

  const handleFoodItemSearch = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5001/custommers/searchFoodItems?FoodItemName=${query}`);
      const items = (response.data || []).map(item => ({
        id: item._id,
        name: item.FoodItemName,
        category: item.FoodItemCategory,
        price: item.FoodItemPrice,
        image: item.FoodItemImageUrl,
        description: item.FoodItemDescription,
        quantity: 0
      }));
      console.log('Searched food items:', items);
      setAllItems(items);
    } catch (error) {
      console.error('Error searching food items:', error);
      setAllItems([]);
    }
  };
  const handleAdd = (item) => {
    console.log('Adding item:', item);
    console.log('Current cart before:', cart);
    const exists = cart.find(i => i.id === item.id);
    if (exists) {
      const updatedCart = cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      setCart(updatedCart);
      console.log('Updated cart:', updatedCart);
    } else {
      const newCart = [...cart, { ...item, quantity: 1 }];
      setCart(newCart);
      console.log('New cart:', newCart);
    }
  };

  const filteredItems = allItems.filter(item => {
    const itemCategory = (item.category || '').toLowerCase().replace('_', ' ').trim();
    const selectedCategory = category.toLowerCase().trim();
    return itemCategory.includes(selectedCategory) || selectedCategory.includes(itemCategory);
  });

  // Debug logging
  React.useEffect(() => {
    console.log('Category:', category);
    console.log('All items:', allItems);
    console.log('Filtered items:', filteredItems);
  }, [category, allItems, filteredItems]);

  const handleRemove = (itemId) => {
    const existing = cart.find(i => i.id === itemId);
    if (existing.quantity === 1) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      setCart(cart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Header with Cart Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>Good Evening</h1>
          <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>Place your order</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={fetchFoodItems}
            style={{
              padding: '10px 15px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🔄 Refresh
          </button>
          <div style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            🛒 {cart.length} items
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {allItems.length === 0 && loading ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '20px', color: '#999', marginBottom: '10px' }}>⏳ Loading items...</p>
          <p style={{ fontSize: '14px', color: '#bbb' }}>Please wait while we fetch the menu</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {allItems.map(item => {
            const inCart = cart.find(i => i.id === item.id);
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                {/* Item Image */}
                <div style={{
                  width: '100%',
                  height: '160px',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  position: 'relative'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Item Details */}
                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{
                    fontSize: '17px',
                    marginBottom: '5px',
                    marginTop: '0',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    minHeight: '40px'
                  }}>
                    {item.name}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    color: '#7f8c8d',
                    marginBottom: '10px',
                    marginTop: '0',
                    flex: 1
                  }}>
                    ₹ <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60' }}>{item.price}</span>
                  </p>

                  {/* Add Button or Counter */}
                  {inCart ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f0f8ff',
                      padding: '8px',
                      borderRadius: '6px'
                    }}>
                      <button
                        onClick={() => handleRemove(item.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          fontSize: '18px',
                          border: '2px solid #e74c3c',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          fontWeight: 'bold',
                          color: '#e74c3c',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e74c3c';
                          e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.color = '#e74c3c';
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        minWidth: '40px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#2c3e50'
                      }}>
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => handleAdd(item)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          fontSize: '18px',
                          border: '2px solid #27ae60',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          fontWeight: 'bold',
                          color: '#27ae60',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#27ae60';
                          e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.color = '#27ae60';
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#2980b9';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#3498db';
                      }}
                    >
                      + Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Button - Fixed at Bottom */}
      <div style={{
        position: 'sticky',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: '#f9f9f9',
        padding: '15px 20px',
        borderTop: '1px solid #eee',
        marginTop: '30px'
      }}>
        <button
          onClick={goToCheckout}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: cart.length > 0 ? '#27ae60' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}
          disabled={cart.length === 0}
          onMouseEnter={(e) => {
            if (cart.length > 0) {
              e.target.style.backgroundColor = '#229954';
            }
          }}
          onMouseLeave={(e) => {
            if (cart.length > 0) {
              e.target.style.backgroundColor = '#27ae60';
            }
          }}
        >
          {cart.length > 0 ? `🛒 Proceed to Checkout (${cart.length} items)` : '❌ Add items to continue'}
        </button>
      </div>
    </div>
  );
};

export default Menu;
