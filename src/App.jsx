import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Navbar from './component/Navbar'; 
import Orders from './pages/Orders';
import CheckoutPage from './component/CheckoutPage';
import PaystackPayment from './component/PaystackPayment';
import OrderSuccess from './component/orderSuccess';
import StoreFront from './component/StoreFront';
import AccountSettings from './component/AccountSettings';
import AiChatbot from './component/AiChatbot';
import Login from './pages/Login';  
import SignUp from './pages/SignUp';
import AdminDashboard from './dashboard/AdminDashboard';
import AdminRoute from './route/AdminRoute';

// Simple Success Component (You can move this to its own file later)


function App() {
  return (
    
      <AuthProvider> 
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar /> 
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/storefront" element={<StoreFront />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/paystack" element={<PaystackPayment />} />
                <Route path="/accountsettings" element={<AccountSettings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                
                {/* ADDED THIS ROUTE SO YOUR REDIRECT WORKS */}
                <Route path="/success" element={<OrderSuccess />} />
              </Routes>
            </main>
            <AiChatbot />
          </div>
        </CartProvider>
      </AuthProvider>
  );
}

export default App;