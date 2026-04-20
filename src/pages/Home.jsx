import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ShoppingBag, Sparkles } from 'lucide-react';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Artificial loading effect for the "Boutique Entrance" feel
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white text-black min-h-screen font-sans overflow-x-hidden">
      
      {/* 0. INTRO LOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <motion.h1 
              initial={{ opacity: 0, letterSpacing: "1em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              className="text-[#611e02] text-4xl font-black tracking-[0.4em]"
            >
              KI<span className="text-white text-4xl font-black tracking-[0.4em]">MART</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP PROMO BAR */}
      <div className="bg-black text-white py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-center sticky top-0 z-50">
        Free Global Delivery Over GHS 2000 | Import Duties Included
      </div>

      {/* 2. LUXURY HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[85vh] border-b border-black overflow-hidden">
        {/* Women's Side */}
        <div className="relative group overflow-hidden border-r border-black">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
            alt="Womenswear"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center">
            <motion.h2 variants={fadeInUp} initial="initial" animate="animate" className="text-5xl font-light italic mb-6">Womenswear</motion.h2>
            <Link to="/storefront" className="border-b border-white pb-1 text-sm font-bold tracking-[0.3em] hover:bg-white hover:text-black hover:px-4 transition-all duration-300">
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Men's Side */}
        <div className="relative group overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
            alt="Menswear"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center">
            <motion.h2 variants={fadeInUp} initial="initial" animate="animate" className="text-5xl font-light italic mb-6">Menswear</motion.h2>
            <Link to="/storefront" className="border-b border-white pb-1 text-sm font-bold tracking-[0.3em] hover:bg-white hover:text-black hover:px-4 transition-all duration-300">
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* 3. THE STYLE INDEX (Staggered Animations) */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[1600px] mx-auto px-6 py-28"
      >
        <motion.div variants={fadeInUp} className="flex flex-col items-center mb-20">
          <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase mb-4 text-slate-400">The 2026 Collection</h2>
          <p className="text-4xl font-light italic text-center max-w-2xl leading-snug">
            "A global gateway to the world's most exclusive boutiques."
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'New In', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600' },
            { name: 'Iconic Bags', img: 'https://images.unsplash.com/photo-1584917033904-491a84b2ef9b?w=600' },
            { name: 'Designers', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600' },
            { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523206489230-c012c7449a2e?w=600' }
          ].map((cat) => (
            <motion.div 
              key={cat.name} 
              variants={fadeInUp}
              className="relative aspect-[4/5] overflow-hidden group cursor-pointer border border-slate-100"
            >
              <img src={cat.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={cat.name} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-8 left-8">
                <h4 className="text-white font-black tracking-tighter text-2xl uppercase italic mix-blend-difference">{cat.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 4. EDITORIAL SECTION */}
      <section className="bg-slate-50 py-32 border-y border-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h3 className="text-6xl font-black leading-[0.9] tracking-tighter uppercase italic">
              KIMART <br /> LEGACY.
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed font-light">
              Crafting a new standard for luxury in West Africa. We curate the boldest designs and deliver them with white-glove precision.
            </p>
            <Link to="/storefront" className="group inline-flex items-center gap-6 bg-black text-white px-12 py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-slate-900 transition-all">
              <span>Enter Boutique</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
          <div className="relative group">
            <motion.div 
              animate={{ rotate: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-6 -left-6 w-full h-full border border-black -z-10"
            />
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000" 
              className="w-full shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Editorial"
            />
          </div>
        </div>
      </section>

      {/* 5. MINIMALIST FOOTER */}
      <footer className="bg-white border-t border-black pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">KIMART.</h2>
            <p className="text-[10px] text-slate-400 leading-loose uppercase tracking-[0.2em]">
              The global destination for luxury. <br /> Curated in Ghana.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Services</h4>
            <ul className="text-[10px] space-y-4 text-slate-500 font-bold uppercase tracking-widest">
              <li><Link to="/shipping" className="hover:text-black">Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-black">Returns</Link></li>
              <li><Link to="/help" className="hover:text-black">Concierge</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Company</h4>
            <ul className="text-[10px] space-y-4 text-slate-500 font-bold uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-black">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-black">Careers</Link></li>
              <li><Link to="/legal" className="hover:text-black">Legal</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em]">Newsletter</h4>
            <div className="flex border-b border-black pb-3">
              <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent text-[10px] w-full focus:outline-none uppercase tracking-widest" />
              <button className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-slate-400 transition-colors">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] pt-12 border-t border-slate-100">
          <p>© 2026 KIMART GHANA.</p>
          <div className="flex space-x-8">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}