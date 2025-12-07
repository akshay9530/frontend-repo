// src/pages/FragrancePage.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../hooks/useCart'
import { fragranceData } from '../data/fragranceData' // Import the data

const FragrancePage = () => {
  const { gender } = useParams() // 'men' or 'women'
  const { addToCart } = useCart()
  const [fragrances, setFragrances] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBrands, setSelectedBrands] = useState([])

  // Extract unique brands for filtering
  const allBrands = [...new Set(fragranceData[gender]?.map(item => item.brand) || [])]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (gender && fragranceData[gender]) {
        setFragrances(fragranceData[gender])
      }
      setLoading(false)
    }, 500)
  }, [gender])

  const handleAddToCart = (fragrance) => {
    addToCart({
      id: fragrance.id,
      name: fragrance.name,
      price: fragrance.price,
      image: fragrance.image,
      quantity: 1
    })
    // You can add a toast notification here
    alert(`${fragrance.name} added to cart!`)
  }

  const filteredFragrances = selectedBrands.length > 0
    ? fragrances.filter(fragrance => selectedBrands.includes(fragrance.brand))
    : fragrances

  const toggleBrandFilter = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading fragrances...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {gender === 'men' ? "Men's Fragrance" : "Women's Fragrance"}
          </h1>
          <p className="text-gray-600">
            Discover our curated collection of premium {gender === 'men' ? "men's" : "women's"} fragrances
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Filters</h3>
              
              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Brands</h4>
                <div className="space-y-2">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2 text-gray-600">Under $50</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2 text-gray-600">$50 - $100</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2 text-gray-600">$100 - $150</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="w-4 h-4 text-green-600" />
                    <span className="ml-2 text-gray-600">Over $150</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setSelectedBrands([])}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredFragrances.length} products
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
              </select>
            </div>

            {filteredFragrances.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No fragrances found with selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFragrances.map(fragrance => (
                  <div key={fragrance.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            {fragrance.brand}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600">{fragrance.rating}</span>
                        </div>
                      </div>
                      
                      <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-300">F</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{fragrance.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{fragrance.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">${fragrance.price}</p>
                          <p className="text-sm text-gray-500">{fragrance.size}</p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(fragrance)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FragrancePage