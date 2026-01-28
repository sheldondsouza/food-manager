import React from 'react';
import DashBoard from './Pages/DashBoard';

import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Tables from './Pages/Tables';
import Orders from './Pages/Orders';
import Menu from './Pages/Menu';
import Support from './Pages/Support';
import { useState } from 'react';
import Checkout from './Pages/Checkout';

function App() {
  const [cart, setCart] = useState([]);
  const [screen, setScreen] = useState('menu');

  const goToCheckout = () => {
    console.log('Going to checkout. Cart:', cart);
    setScreen('checkout');
  };
  const goToMenu = () => setScreen('menu');
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path='/Tables' element={<Tables />} />
          <Route path='/Orders' element={<Orders />} />
          <Route path='/Support' element={<Support />} />

          <Route path='*' element={<h1>Page Not Found</h1>} />
          <Route path='/customer/Menu' element={

            <div>
              {screen === 'menu' && (
                <Menu cart={cart} setCart={setCart} goToCheckout={goToCheckout} />
              )}
              {screen === 'checkout' && (
                <Checkout cart={cart} setCart={setCart} goBack={goToMenu} />
              )}
            </div>

          } />
        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
