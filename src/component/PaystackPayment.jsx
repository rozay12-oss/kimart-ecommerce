import React from 'react';
import { PaystackButton } from 'react-paystack';
import { supabase } from '../lib/supabaseClient'; 
import { useCart } from '../hooks/useCart'; 

const PaystackPayment = ({ amount, email, userId, orderId }) => {
  const { clearCart } = useCart();
  const publicKey = "pk_test_4a8c8d15791c8e4040ee0aade7bbbfa3b3692fa2"; 

  if (!email || !amount || !orderId) {
    return (
      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-500 text-xs font-bold italic text-center">
          Payment setup incomplete. Please check your details.
        </p>
      </div>
    );
  }

  const handlePaystackSuccess = async (reference) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid', 
          payment_reference: reference.reference 
        })
        .eq('id', orderId);

      if (error) throw error;

      if (clearCart) clearCart(); 
      else localStorage.removeItem('cart');
      
      window.location.assign("/success"); 
    } catch (error) {
      console.error("Supabase Error:", error.message);
      alert("Payment successful, but database update failed. Please contact support.");
    }
  };

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email.trim(),
    amount: Math.floor(Number(amount) * 100), 
    publicKey: publicKey,
    currency: 'GHS', 
    metadata: { userId, orderId },
    channels: ['card', 'mobile_money', 'qr', 'ussd'], 
    onSuccess: (reference) => handlePaystackSuccess(reference),
    onClose: () => console.log("Transaction cancelled"),
  };

  return (
    // Added w-full and responsive padding
    <div className="w-full max-w-md mx-auto p-5 md:p-8 bg-white rounded-[2rem] shadow-xl border border-slate-50">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount Due</span>
        <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter">
          ₵{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
      </div>
      
      <PaystackButton 
        {...config} 
        text="Confirm & Pay Now"
        // Updated color to #611e02 to match Alimarket brand
        className="w-full py-5 px-6 text-white font-black bg-[#611e02] rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-orange-100 uppercase tracking-widest text-sm"
      />
      
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center space-x-2">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
             Secure Checkout
           </p>
        </div>
        {/* Mobile Money Icons Hint */}
        <p className="text-[9px] text-slate-300 font-bold">MTN • VODAFONE • AIRTELTIGO • VISA</p>
      </div>
    </div>
  );
};

export default PaystackPayment;