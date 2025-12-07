// src/components/Filters.jsx
import React from 'react'
import { categories } from '../data/products'

const Filters = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (category) => {
    onFilterChange('category', category)
  }

  const handlePriceRangeChange = (min, max) => {
    onFilterChange('priceRange', { min, max })
  }

  const clearFilters = () => {
    onFilterChange('category', 'all')
    onFilterChange('priceRange', { min: 0, max: 1000 })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sephora-pink text-sm hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="text-sephora-pink focus:ring-sephora-pink"
              />
              <span className="ml-2 text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { label: 'Under $25', min: 0, max: 25 },
            { label: '$25 - $50', min: 25, max: 50 },
            { label: '$50 - $100', min: 50, max: 100 },
            { label: 'Over $100', min: 100, max: 1000 }
          ].map(range => (
            <label key={range.label} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceRange.min === range.min && 
                  filters.priceRange.max === range.max
                }
                onChange={() => handlePriceRangeChange(range.min, range.max)}
                className="text-sephora-pink focus:ring-sephora-pink"
              />
              <span className="ml-2 text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Filters