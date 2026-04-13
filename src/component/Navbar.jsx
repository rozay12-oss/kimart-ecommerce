import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut, Package, Home, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-2 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          
          {/* Left: Hamburger & New Kimart Logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            {/* LOGO GROUP */}
            <Link to="/" className="flex items-center gap-1 group">
              <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden">
                <img 
                  src="/kimart.png" // Ensure your extracted logo is named this in /public
                  alt="Kimart Logo" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                />
              </div>
              <div className="flex flex-col leading-none ml-1">
                <span className="text-xl md:text-2xl font-black text-[#611e02] tracking-tighter uppercase italic">
                  Ki<span className="text-slate-900">mart</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase ml-0.5">
                  Global Sourcing Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Cart & Desktop Auth */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* User Profile (Desktop) */}
            <div className="hidden md:flex items-center gap-2 border-r border-slate-200 pr-4">
              <User size={18} className="text-slate-400" />
              {!user ? (
                <Link to="/login" className="text-xs font-black text-slate-700 hover:text-[#611e02] uppercase">
                  Sign In
                </Link>
              ) : (
                <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                  Hi, {user.email.split('@')[0]}
                </span>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 hover:bg-orange-50 rounded-full transition-all group">
              <ShoppingCart size={26} className="text-slate-800 group-hover:text-[#611e02]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#611e02] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* SIDEBAR OVERLAY & MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-70 bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 bg-[#611e02] text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full border border-white/30">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Global Account</p>
                    <p className="font-bold truncate max-w-[150px]">
                      {user ? user.email.split('@')[0] : 'Sign In / Join'}
                    </p>
                  </div>
                </div>
                <button onClick={toggleSidebar} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <SidebarLink to="/" icon={<Home size={20}/>} label="Home" onClick={toggleSidebar} />
                <SidebarLink to="/storefront" icon={<Package size={20}/>} label="All Products" onClick={toggleSidebar} />
                
                {user && (
                  <>
                    <div className="my-4 border-t border-slate-100 mx-6" />
                    <SidebarLink to="/orders" icon={<Package size={20}/>} label="My Orders" onClick={toggleSidebar} />
                  </>
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-slate-100">
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-[#611e02] text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-[#611e02] transition-all"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center bg-[#611e02] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#611e02]/20 active:scale-95 transition-all"
                  >
                    Login / Join Free
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center justify-between px-6 py-4 text-slate-700 hover:bg-orange-50 hover:text-[#611e02] transition-all group"
  >
    <div className="flex items-center gap-3">
      <span className="text-slate-400 group-hover:text-[#611e02]">{icon}</span>
      <span className="font-bold text-sm">{label}</span>
    </div>
    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#611e02]" />
  </Link>
);

export default Navbar;