import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen font-sans">
      
      {/* 1. TOP PROMO BAR (Thin, Minimal) */}
      <div className="bg-black text-white py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
        Free Global Delivery Over GHS 2000 | Import Duties Included
      </div>

      {/* 2. LUXURY HERO (Split Screen Style) */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] border-b border-black">
        {/* Women's Side */}
        <div className="relative group overflow-hidden border-r border-black">
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000" 
            className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-1000"
            alt="Womenswear"
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-light italic mb-4">Womenswear</h2>
            <Link to="/storefront" className="border-b border-white pb-1 text-sm font-bold tracking-widest hover:text-slate-300 transition-colors">
              SHOP NOW
            </Link>
          </div>
        </div>
        {/* Men's Side */}
        <div className="relative group overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000" 
            className="w-full h-full object-cover grayscale-[30%] group-hover:scale-105 transition-transform duration-1000"
            alt="Menswear"
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-light italic mb-4">Menswear</h2>
            <Link to="/storefront" className="border-b border-white pb-1 text-sm font-bold tracking-widest hover:text-slate-300 transition-colors">
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* 3. THE "INDEX" CATEGORIES (Minimalist Tiles) */}
      <section className="max-w-[1600px] mx-auto px-6 py-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.4em] uppercase mb-4">The Style Index</h2>
          <p className="text-2xl font-light text-slate-500 italic text-center max-w-xl">
            "A curated selection of the world's most iconic boutiques, delivered to your door."
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'New In', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500' },
            { name: 'Iconic Bags', img: 'https://images.unsplash.com/photo-1584917033904-491a84b2ef9b?w=500' },
            { name: 'Designers', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500' },
            { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523206489230-c012c7449a2e?w=500' }
          ].map((cat) => (
            <div key={cat.name} className="relative aspect-[3/4] overflow-hidden bg-slate-100 group">
              <img src={cat.img} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" alt={cat.name} />
              <div className="absolute bottom-6 left-6">
                <h4 className="text-white font-bold tracking-tighter text-xl uppercase drop-shadow-md">{cat.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL SECTION (The "Story") */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-4xl font-black leading-tight tracking-tighter">
              MODERN LUXURY: <br /> THE 2026 EDIT.
            </h3>
            <p className="text-slate-600 leading-relaxed font-light">
              Discover the luxury products set to define the year, ranked by global search demand and local sales data—from cult trainers to iconic bags.
            </p>
            <Link to="/storefront" className="inline-flex items-center space-x-4 bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
              <span>Read the Story</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-black z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" 
              className="relative z-10 w-full grayscale"
              alt="Editorial"
            />
          </div>
        </div>
      </section>
      {/* 5. BRAND INDEX (The Farfetch Signature) */}
<section className="max-w-[1600px] mx-auto px-6 py-24 border-t border-slate-100">
  <div className="flex justify-between items-end mb-12">
    <div>
      <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-2">Boutique Partners</h2>
      <p className="text-3xl font-light italic">Shop by Designer</p>
    </div>
    <Link to="/storefront" className="text-xs font-bold border-b border-black pb-1 hover:text-slate-400 hover:border-slate-400 transition-all">
      VIEW ALL BRANDS
    </Link>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8">
    {['Balenciaga', 'Gucci', 'Prada', 'Off-White', 'Saint Laurent', 'Versace'].map((brand) => (
      <Link 
        key={brand} 
        to={`/storefront?brand=${brand}`} 
        className="group border-b border-transparent hover:border-black transition-all pb-4"
      >
        <h3 className="text-lg font-medium tracking-tight group-hover:pl-2 transition-all duration-300">
          {brand}
        </h3>
      </Link>
    ))}
  </div>
</section>

{/* 6. MINIMALIST FOOTER */}
<footer className="bg-white border-t border-black pt-20 pb-10">
  <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
    <div className="space-y-6">
      <h2 className="text-2xl font-black tracking-tighter uppercase">MY<span className="text-blue-600">MARKET.</span></h2>
      <p className="text-xs text-slate-500 leading-loose uppercase tracking-widest">
        The global destination for modern luxury. Curated in Ghana, delivered worldwide.
      </p>
    </div>
    
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest">Customer Service</h4>
      <ul className="text-xs space-y-3 text-slate-500 font-medium">
        <li><Link to="/help" className="hover:text-black">Contact Us</Link></li>
        <li><Link to="/shipping" className="hover:text-black">Orders & Delivery</Link></li>
        <li><Link to="/returns" className="hover:text-black">Returns & Refunds</Link></li>
      </ul>
    </div>

    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest">About Us</h4>
      <ul className="text-xs space-y-3 text-slate-500 font-medium">
        <li><Link to="/about" className="hover:text-black">Our Story</Link></li>
        <li><Link to="/careers" className="hover:text-black">Careers</Link></li>
        <li><Link to="/boutiques" className="hover:text-black">Our Boutiques</Link></li>
      </ul>
    </div>

    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest">Newsletter</h4>
      <p className="text-[10px] text-slate-400 uppercase tracking-tight">Sign up for exclusive early access and style news.</p>
      <div className="flex border-b border-black pb-2">
        <input 
          type="email" 
          placeholder="EMAIL@ADDRESS.COM" 
          className="bg-transparent text-xs w-full focus:outline-none uppercase" 
        />
        <button className="text-xs font-bold uppercase tracking-widest">Join</button>
      </div>
    </div>
  </div>

  <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] border-t border-slate-100 pt-10">
    <p>© 2026 MYMARKET GHANA. All Rights Reserved.</p>
    <div className="flex space-x-6 mt-4 md:mt-0">
      <span>Privacy Policy</span>
      <span>Terms & Conditions</span>
    </div>
  </div>
</footer>

    </div>
  );
}