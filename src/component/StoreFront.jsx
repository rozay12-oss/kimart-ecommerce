import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Filter, ChevronRight, Search } from 'lucide-react';
import ProductCard from '../component/ProductCard'; 
import ProductSlider from '../component/ProductSlider'; 

const Storefront = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error("Supabase Error:", error);
      else setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* SEARCH BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Updated Name to KIMART */}
          <h2 className="text-xl md:text-2xl font-[1000] text-[#611e02] shrink-0 tracking-tighter italic uppercase">
            Ki<span className="text-slate-900">mart</span>
          </h2>
          
          <div className="flex-1 max-w-2xl">
            {/* Search Bar border changed to Brand Color */}
            <div className="flex border-2 border-[#611e02] rounded-full overflow-hidden bg-white group focus-within:ring-4 focus-within:ring-[#611e02]/10 transition-all">
              <input 
                type="text" 
                placeholder="Search for premium products..." 
                className="w-full px-6 py-2 outline-none text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#611e02] text-white px-6 py-2 flex items-center hover:bg-black transition-colors">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED SLIDER SECTION */}
      {!searchTerm && selectedCategory === 'All' && products.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 mt-6">
           <ProductSlider products={products.slice(0, 6)} /> 
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 lg:sticky lg:top-24">
            <h3 className="font-black mb-4 flex items-center text-slate-800 uppercase text-[10px] tracking-[0.2em]">
              <Filter size={14} className="mr-2 text-[#611e02]"/> Categories
            </h3>
            <ul className="text-sm space-y-1">
              {['All', 'Shoe', 'Watch', 'Shirt', 'Sneaker', 'Bracelet'].map(cat => (
                <li 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex justify-between items-center px-4 py-3 rounded-2xl cursor-pointer transition-all font-bold ${
                    selectedCategory === cat 
                    ? 'bg-[#611e02]/5 text-[#611e02] shadow-sm ring-1 ring-[#611e02]/10' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat} <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-30'} />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* MAIN GRID */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.15em]">
              {selectedCategory} Collection <span className="text-slate-400 ml-1">({filteredProducts.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-white rounded-[2rem] animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-20 text-center rounded-[3rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-bold italic">No products match your search.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                className="mt-6 bg-[#611e02] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#611e02]/20"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Storefront;