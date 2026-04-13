import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image_url: "" })

  // 1. Define the function first
  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()

    if (error) {
      alert("Error: Make sure your RLS policy allows 'Insert'!")
      console.error(error)
    } else {
      setProducts([...products, ...data]) // Update UI immediately
      setNewProduct({ name: "", price: "", image_url: "" }) // Clear form
    }
  }

  // 2. Then call it in the hook
  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <div className="p-10 animate-pulse">Loading items...</div>

  console.table(products);

  return (
    <div className="max-w-3xl mx-auto  bg-blue-300 min-h-screen p-26 pw-15 rounded-2x1 shadow-sm mb-10 border">
    <p className= "text-xl font-bold text-sophira text-center p-5"> Add New Product Admin</p>
      {/* 1. The Add Product Form */}
      <section className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-center">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Product Name" required
            className="border p-2 rounded-lg"
            value={newProduct.name || ""}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          />
          <input 
            type="number" placeholder="Price" required
            className="border p-2 rounded-lg"
            value={newProduct.price || ""}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          />
          <input 
            type="text" placeholder="Image URL"
            className="border p-2 rounded-lg"
            value={newProduct.image_url}
            onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
          />
          <input 
          type="text" placeholder="Description"
          className="border p-2 rounded-lg"
          value={newProduct.description || ""}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          />

          <button type="submit" className="bg-blue-600 place-self-center text-white py-2 px-2 rounded-lg hover:bg-blue-400 md:col-span-1 transition" >
            Save Product to Database
          </button>
        </form>
      </section>

      {/* 2. The Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <img src={p.image_url} className="w-16 h-16 object-cover rounded-lg bg-gray-100" alt="" />
            <div>
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-blue-600 font-semibold">${p.price}</p>
              <p className="text-blue-600 font-semibold text-sm">${p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App;