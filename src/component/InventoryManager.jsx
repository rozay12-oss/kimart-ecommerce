import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AddProductModal from '../component/AddProductModal';
import { calculateInventoryStats } from '../utils/analytics';
import { motion } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Trash2, 
  Save, 
  Plus, 
  RefreshCcw,
  Layers
} from 'lucide-react';

const InventoryManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { 
    totalProducts, 
    totalStockValue, 
    lowStockItems, 
    outOfStockItems 
  } = calculateInventoryStats(products);

  useEffect(() => {
    let isMounted = true;
    const loadInventory = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (isMounted) {
        if (error) console.error(error);
        else setProducts(data || []);
        setLoading(false);
      }
    };
    loadInventory();
    return () => { isMounted = false; };
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleUpdate = async (id, newPrice, newStock) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('products')
      .update({ price: parseFloat(newPrice), stock: parseInt(newStock) })
      .eq('id', id);

    if (error) alert("Update failed!");
    else triggerRefresh();
    setUpdatingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert("Error: " + error.message);
      else triggerRefresh();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Catalog" value={totalProducts} icon={<Layers size={20} className="text-blue-500" />} />
        <StatCard label="Stock Value" value={`GHS ${totalStockValue.toLocaleString()}`} icon={<DollarSign size={20} className="text-emerald-500" />} />
        <StatCard 
          label="Low Stock" 
          value={lowStockItems} 
          icon={<AlertTriangle size={20} className="text-amber-500" />} 
          badge={lowStockItems > 0 ? "Restock" : null} 
        />
        <StatCard label="Out of Stock" value={outOfStockItems} icon={<Trash2 size={20} className="text-rose-500" />} />
      </div>

      {/* 2. TABLE HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Product Inventory</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Stock Tracking</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={triggerRefresh} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <RefreshCcw size={18} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={3} /> New Product
            </button>
          </div>
        </div>

        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onProductAdded={triggerRefresh} 
        />
        
        {/* 3. TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-5">Product Info</th>
                <th className="p-5 text-center w-32">Price (GHS)</th>
                <th className="p-5 text-center w-32">In Stock</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <InventoryRow 
                  key={product.id} 
                  product={product} 
                  onSave={handleUpdate} 
                  onDelete={handleDelete}
                  isUpdating={updatingId === product.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ label, value, icon, badge }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {badge && (
          <span className="text-[9px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-black border border-rose-100 uppercase tracking-tighter">
            {badge}
          </span>
        )}
      </div>
    </div>
    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
      {icon}
    </div>
  </div>
);

const InventoryRow = ({ product, onSave, onDelete, isUpdating }) => {
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock || 0);

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="p-5">
        <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{product.name}</div>
        <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-2">
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{product.category || 'general'}</span>
          <span className="opacity-50">#ID {product.id.slice(0, 6)}</span>
        </div>
      </td>
      <td className="p-5 text-center">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₵</span>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 pl-6 pr-2 py-2 text-sm font-black border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </td>
      <td className="p-5 text-center">
        <input 
          type="number" 
          value={stock} 
          onChange={(e) => setStock(e.target.value)}
          className={`w-16 text-center py-2 text-sm font-black border rounded-xl outline-none transition-all ${
            stock <= 5 
              ? 'border-rose-200 bg-rose-50 text-rose-600 ring-2 ring-rose-50' 
              : 'border-slate-200 focus:ring-2 focus:ring-blue-500'
          }`}
        />
      </td>
      <td className="p-5">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => onSave(product.id, price, stock)}
            disabled={isUpdating}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-blue-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
            SAVE
          </button>
          
          <button 
            onClick={() => onDelete(product.id)}
            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InventoryManager;