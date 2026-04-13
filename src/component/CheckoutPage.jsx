import React from 'react';
import { usePaystackPayment } from 'react-paystack'; // Change this import
import { supabase } from '../lib/supabaseClient';

const CheckoutPage = ({ amount, email, userId }) => {
  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: amount * 100,
    publicKey: 'pk_test_4a8c8d15791c8e4040ee0aade7bbbfa3b3692fa2',
  };

  // This hook gives us a function called 'initializePayment'
  const initializePayment = usePaystackPayment(config);

  const handlePaystackSuccess = async (reference) => {
    // ... your same Supabase update logic goes here ...
    console.log("Success!", reference);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid', payment_reference: reference.reference })
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (!error) {
       alert("Order Confirmed!");
       window.location.href = "/success";
    }
  };

  const handlePaystackClose = () => {
    console.log('Payment modal closed');
  };

  return (
    <div>
      {/* Now you use a standard HTML button with a normal onClick */}
      <button
        className="w-full py-3 px-6 text-white font-bold bg-green-600 rounded-md hover:bg-green-700 shadow-lg"
        onClick={() => {
          initializePayment(handlePaystackSuccess, handlePaystackClose);
        }}
      >
        Pay Now with Paystack
      </button>
    </div>
  );
};

export default CheckoutPage;