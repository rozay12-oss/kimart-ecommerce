import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();

  const handleContact = (e) => {
    e.preventDefault();
    const message = `Hi, I'm interested in ${product.name}. Is it available?`;
    window.open(`https://wa.me/2330240836488?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-[#611e02] hover:shadow-2xl transition-all flex flex-col h-full group relative"
    >
      {/* Product Image Section */}
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-slate-50">
        <motion.img 
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        {product.category && (
          <div className="absolute top-2 left-2 bg-[#611e02]/80 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest">
            {product.category}
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-[#611e02] h-10 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-baseline space-x-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">GHS</span>
            <span className="text-xl font-black text-slate-900">
              {Number(product.price).toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-2">
            <ShieldCheck size={12} className="mr-1 text-[#611e02]" />
            <span className="text-slate-500">Verified Quality</span>
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="flex-1 bg-[#611e02] text-white text-[10px] py-2.5 rounded-lg font-black uppercase tracking-wider shadow-lg shadow-[#611e02]/10 hover:bg-black transition-colors"
            >
              Add to Cart
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleContact}
              className="border border-slate-200 p-2.5 rounded-lg text-slate-500 hover:text-[#611e02] hover:bg-slate-50 transition-colors"
            >
              <MessageCircle size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;