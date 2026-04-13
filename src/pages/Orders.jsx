import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import PaystackPayment from '../component/PaystackPayment';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              quantity,
              price_at_purchase,
              products (
                name,
                image_url
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-10 text-center text-gray-500">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-20 text-center">
        <h2 className="text-2xl font-bold">No orders found</h2>
        <p className="text-gray-500 mt-2">Once you checkout, your orders will appear here.</p>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase">Order History</h1>
      
      <div className="space-y-12">
        {orders.map((order) => (
          <div key={order.id} className="border-t pt-8">
            {/* Order Header */}
            <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Order ID</p>
                <p className="text-sm font-mono text-gray-600">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Date</p>
                <p className="text-sm font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Total</p>
                <p className="text-lg font-black text-gray-900">GHS {Number(order.total_price).toFixed(2)}</p>
              </div>
              <div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                  order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <img 
                    src={item.products?.image_url} 
                    alt={item.products?.name} 
                    className="w-16 h-16 object-cover rounded-lg bg-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 leading-tight">{item.products?.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">GHS {item.price_at_purchase}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Paystack Payment Section - Only shows if status is pending */}
            {order.status === 'pending' && (
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-blue-900">Awaiting Payment</h4>
                  <p className="text-sm text-blue-700">Complete your transaction to process this order.</p>
                </div>
                <div className="w-full md:w-auto">
                  <PaystackPayment 
                    amount={order.total_price} 
                    email={user.email} 
                    userId={user.id} 
                    orderId={order.id} // <--- Add this prop!
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}