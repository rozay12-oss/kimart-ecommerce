import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight, ChevronLeft, ShoppingCart, Zap, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart'; 

const ProductSlider = ({ products = [] }) => {
  const { addToCart } = useCart();
  
  const [width, setWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedId, setAddedId] = useState(null); // Track which item was just added
  const carousel = useRef();
  const controls = useAnimation();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    addToCart(product);

    // Visual feedback: Change the icon for 1.5 seconds
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [products]);

  useEffect(() => {
    if (width <= 0 || isPaused) return;
    controls.start({
      x: [0, -width],
      transition: {
        duration: products.length * 5,
        ease: "linear",
        repeat: Infinity
      }
    });
    return () => controls.stop();
  }, [width, isPaused, controls, products.length]);

  return (
    <div className="relative py-4 md:py-8 mb-12">
      <div className="px-6 md:px-10 pb-6 bg-transparent">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} className="text-[#611e02] fill-[#611e02]" />
          <span className="text-[10px] font-black text-[#611e02] uppercase tracking-[0.2em]">Featured</span>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">New Arrivals</h2>
        </div>
      </div>

      <motion.div 
        ref={carousel} 
        className="cursor-grab active:cursor-grabbing px-6 md:px-10 overflow-hidden"
        onPointerDown={() => { setIsPaused(true); controls.stop(); }}
        onMouseEnter={() => { setIsPaused(true); controls.stop(); }}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          drag="x" 
          animate={controls}
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-4 md:gap-6"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[240px] md:min-w-[280px] group">
              <div className="h-60 md:h-72 rounded-[2rem] overflow-hidden relative shadow-sm">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none" 
                />
                
                {/* Cart Button with Success State */}
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 z-30 backdrop-blur-sm 
                    ${addedId === product.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/90 text-slate-900 hover:bg-[#611e02] hover:text-white'
                    }`}
                >
                  {addedId === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
                </button>
              </div>

              <div className="mt-4 px-2">
                <h4 className="font-black text-slate-800 text-base md:text-lg truncate">{product.name}</h4>
                <p className="text-[#ff6600] font-black text-lg md:text-xl">
                  ₵{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductSlider;