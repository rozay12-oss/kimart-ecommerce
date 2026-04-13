import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabaseClient'

// ... existing imports
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart(); 
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function getProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      setProduct(data);
    }
    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <p className="p-20 text-center font-bold animate-bounce text-blue-600">Loading Product Details...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-12">
      <Link to="/storefront" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        BACK TO COLLECTION
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative group">
           <img src={product.image_url} alt={product.name} className="w-full rounded-[2.5rem] shadow-2xl object-cover h-[500px]" />
           <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-slate-900/10"></div>
        </div>
        
        <div className="space-y-6">
          <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            {product.category}
          </span>
          <h1 className="text-5xl font-black text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-3xl font-black text-blue-600">GHS {Number(product.price).toFixed(2)}</p>
          
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Description</h4>
            <p className="text-slate-600 leading-relaxed text-lg">{product.description || "Premium quality item handpicked for our collection."}</p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-xl ${
              added ? 'bg-green-500 text-white shadow-green-200' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
            }`}
          >
            {added ? '✓ ITEM ADDED' : 'ADD TO SHOPPING BAG'}
          </button>
        </div>
      </div>
    </div>
  );
}