import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabaseClient';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const initialFormState = {
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'shirts',
    imageUrl: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const categories = ['Shirts', 'Jeans', 'Sneakers', 'Watchies', 'Suits'];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl || 'https://via.placeholder.com/150';

      // 1. If a file is selected, optimize and upload it
      if (imageFile) {
        // --- OPTIMIZATION START ---
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        console.log('Original size:', imageFile.size / 1024 / 1024, 'MB');
        const compressedFile = await imageCompression(imageFile, options);
        console.log('Compressed size:', compressedFile.size / 1024 / 1024, 'MB');
        // --- OPTIMIZATION END ---

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        // Upload the COMPRESSED file
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, compressedFile); 

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        finalImageUrl = urlData.publicUrl;
      }

      // 2. Insert into the 'products' table
      const { error: dbError } = await supabase
        .from('products')
        .insert([
          { 
            name: formData.name, 
            price: parseFloat(formData.price) || 0, 
            stock: parseInt(formData.stock) || 0,
            description: formData.description,
            category: formData.category, 
            image_url: finalImageUrl 
          }
        ]);

      if (dbError) throw dbError;

      // Success! Clean up
      onProductAdded(); 
      onClose(); 
      setFormData(initialFormState);
      setImageFile(null); 
      
    } catch (err) {
      alert("Action failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-slate-900">Add New Product</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Name</label>
            <input 
              required
              className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price (GHS)</label>
              <input 
                type="number" required step="0.01"
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stock</label>
              <input 
                type="number" required
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
            <select 
              className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Image File</label>
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full mt-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
            </div>

            <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-100"></div>
                <span className="shrink mx-3 text-[9px] font-black text-slate-300 uppercase">OR</span>
                <div className="grow border-t border-slate-100"></div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image URL</label>
              <input 
                type="text"
                placeholder="https://..."
                disabled={!!imageFile}
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-blue-200"
          >
            {loading ? 'Optimizing & Uploading...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;