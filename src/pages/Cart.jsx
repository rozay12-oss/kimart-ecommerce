import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Ensure this path is correct

export default function Cart() {
  const { cart, checkout, removeFromCart, updateQuantity, cartCount } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = async () => {
    const success = await checkout(user);
    if (success) {
      navigate('/orders'); // Redirect to an orders page
    }
  };

  // Calculate the total price of all items
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your bag is empty</h2>
        <p className="text-gray-500 mt-4">Looks like you haven't added anything yet.</p>
        <Link to="/" className="mt-8 inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-black mb-10 tracking-tighter">SHOPPING BAG</h1>
      
      <div className="space-y-8">
        {cart.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-8 gap-6">
            <div className="flex items-center gap-6 w-full">
              <img 
                src={item.image_url} 
                className="w-24 h-24 object-cover rounded-2xl bg-gray-100" 
                alt={item.name} 
              />
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                <p className="text-blue-600 font-medium">${item.price}</p>
                
                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm mt-2 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>

            <button 
    onClick={handleCheckout}
    className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-bold"
  >
    Checkout Now
  </button>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 font-bold"
              > – </button>
              
              <span className="font-bold text-lg w-6 text-center">{item.quantity}</span>
              
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 font-bold"
              > + </button>
            </div>

            <div className="text-right min-w-[100px]">
              <p className="font-black text-xl text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>Items in bag:</span>
          <span>{cartCount}</span>
        </div>
        <div className="flex justify-between items-center text-3xl font-black text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <button className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200">
          Checkout Now
        </button>
      </div>
    </div>
  );
}