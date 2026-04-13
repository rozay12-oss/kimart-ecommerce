import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import InventoryManager from '../component/InventoryManager';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  Search, 
  TrendingUp, 
  Calendar,
  MoreHorizontal
} from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('orders');

  // Define professional colors for different statuses
  const statusStyles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
    completed: "bg-blue-50 text-blue-700 border-blue-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    failed: "bg-rose-50 text-rose-700 border-rose-100",
    shipped: "bg-violet-50 text-violet-700 border-violet-100",
  };

  const loadData = useCallback(async (isMounted) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (isMounted) {
        if (error) console.error(error);
        else setOrders(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadData(isMounted);
    return () => { isMounted = false; };
  }, [loadData]);

  const totalRevenue = orders.reduce((acc, curr) => acc + Number(curr.total_price), 0);
  
  const filteredOrders = orders.filter(order => 
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1 }}
        className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Console</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your marketplace operations</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setCurrentView('orders')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                currentView === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag size={18} /> Orders
            </button>
            <button 
              onClick={() => setCurrentView('inventory')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                currentView === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Package size={18} /> Inventory
            </button>
          </div>
        </header>

        {/* STATS OVERVIEW - Only visible in Orders view */}
        {currentView === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <StatCard title="Total Revenue" value={`GHS ${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="text-emerald-500" />} trend="+12.5%" />
            <StatCard title="Total Orders" value={orders.length} icon={<ShoppingBag className="text-blue-500" />} trend="+5 new today" />
            <StatCard title="Active Customers" value={[...new Set(orders.map(o => o.customer_email))].length} icon={<Users className="text-violet-500" />} trend="Stable" />
          </motion.div>
        )}

        {/* DYNAMIC CONTENT */}
        <AnimatePresence mode="wait">
          {currentView === 'orders' ? (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* SEARCH */}
              <div className="relative w-full max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search by email or Order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              {/* ORDERS TABLE */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Date</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Amount</th>
                      <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                      <th className="p-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                      <tr key={order.id} className="group hover:bg-slate-50/80 transition-colors">
                        <td className="p-5">
                          <p className="text-sm font-bold text-slate-900">{order.customer_email}</p>
                          <p className="text-[10px] font-medium text-slate-400">ID: {order.id.substring(0, 8)}...</p>
                        </td>
                        <td className="p-5 text-center">
                          <p className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1">
                            <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-sm font-black text-slate-900">GHS {Number(order.total_price).toFixed(2)}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                            statusStyles[order.status?.toLowerCase()] || "bg-slate-50 text-slate-600 border-slate-100"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="p-20 text-center text-slate-400 text-sm italic">No matching orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <InventoryManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      <p className="text-[10px] font-bold text-slate-400 mt-1 italic uppercase">{trend}</p>
    </div>
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
  </div>
);

export default AdminDashboard;