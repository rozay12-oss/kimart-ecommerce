const OrderSuccess = () => (
  <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-sm border">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h1 className="text-3xl font-black mb-4">Payment Success!</h1>
    <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
    <a href="/orders" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
      View My Orders
    </a>
  </div>
);

export default OrderSuccess;