import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiChevronDown, FiX, FiMenu, FiUser } from 'react-icons/fi'
import { IoManSharp, IoWoman } from 'react-icons/io5'
import { useCart } from '../hooks/useCart'

const Navbar = () => {
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()
  const itemCount = getCartItemsCount()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    
    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setIsMobileMenuOpen(false)
      setSearchQuery('')
    }
  }

  // Search suggestions based on query
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    const suggestions = []
    
    // Product categories suggestions
    const categories = ['Fragrance', 'Watch', 'Clothes', 'Sneakers', 'Electronics']
    categories.forEach(cat => {
      if (cat.toLowerCase().includes(query)) {
        suggestions.push({ type: 'category', text: cat, href: `/${cat.toLowerCase()}` })
      }
    })
    
    // Brand suggestions
    const brands = [
      'Nike', 'Puma', 'Apple', 'Titan', 'H&M', 'Sony', 'Samsung', 
      'Adidas', 'Fossil', 'Calvin Klein', 'Levi\'s', 'Casio'
    ]
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(query)) {
        suggestions.push({ type: 'brand', text: brand, href: `/brands/${brand.toLowerCase().replace(/[&'\s]/g, '-')}` })
      }
    })
    
    // Color suggestions
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Yellow', 'Purple', 'Pink']
    colors.forEach(color => {
      if (color.toLowerCase().includes(query)) {
        suggestions.push({ type: 'color', text: `${color} Products`, href: `/search?color=${color.toLowerCase()}` })
      }
    })
    
    // Generic product suggestions
    const products = [
      'Smartphone', 'TV', 'Earbuds', 'Watch', 'Shoes', 'Clothes', 
      'Fragrance', 'Perfume', 'Sneakers', 'Dress', 'Shirt'
    ]
    products.forEach(product => {
      if (product.toLowerCase().includes(query)) {
        suggestions.push({ type: 'product', text: product, href: `/search?q=${product.toLowerCase()}` })
      }
    })
    
    return suggestions.slice(0, 8)
  }

  // Categories with submenus
  const categories = [
    {
      name: 'Home',
      type: 'link',
      href: '/'
    },
    {
      name: 'New',
      type: 'link',
      href: '/new-arrivals'
    },
    {
      name: 'Fragrance',
      type: 'dropdown',
      items: [
        { name: 'Men', icon: <IoManSharp className="w-4 h-4" />, href: '/fragrance/men' },
        { name: 'Women', icon: <IoWoman className="w-4 h-4" />, href: '/fragrance/women' }
      ]
    },
    {
      name: 'Watch',
      type: 'dropdown',
      items: [
        { name: 'Men', icon: <IoManSharp className="w-4 h-4" />, href: '/watch/men' },
        { name: 'Women', icon: <IoWoman className="w-4 h-4" />, href: '/watch/women' }
      ]
    },
    {
      name: 'Electronics',
      type: 'dropdown',
      items: [
        { name: 'TV', icon: <FiX className="w-4 h-4" />, href: '/electronics/tv' },
        { name: 'Smartphone', icon: <FiX className="w-4 h-4" />, href: '/electronics/smartphone' },
        { name: 'Earbuds', icon: <FiX className="w-4 h-4" />, href: '/electronics/earbuds' }
      ]
    },
    {
      name: 'Clothes',
      type: 'dropdown',
      items: [
        { name: 'Men', icon: <IoManSharp className="w-4 h-4" />, href: '/clothes/men' },
        { name: 'Women', icon: <IoWoman className="w-4 h-4" />, href: '/clothes/women' }
      ]
    },
    {
      name: 'Sneakers',
      type: 'dropdown',
      items: [
        { name: 'Men', icon: <IoManSharp className="w-4 h-4" />, href: '/sneakers/men' },
        { name: 'Women', icon: <IoWoman className="w-4 h-4" />, href: '/sneakers/women' }
      ]
    },
    {
      name: 'Brands',
      type: 'brands',
      items: [
        { 
          name: 'Nike', 
          href: '/brands/nike',
          image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
        },
        { 
          name: 'Puma', 
          href: '/brands/puma',
          image: 'https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg'
        },
        { 
          name: 'Apple', 
          href: '/brands/apple',
          image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
        },
        { 
          name: 'Titan', 
          href: '/brands/titan',
          image:'https://images.seeklogo.com/logo-png/50/1/titan-logo-png_seeklogo-502722.png'
        },
        { 
          name: 'H&M', 
          href: '/brands/hm',
          image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg'
        },
        { 
          name: 'Sony', 
          href: '/brands/sony',
          image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg'
        },
        { 
          name: 'Samsung', 
          href: '/brands/samsung',
          image: 'https://images.seeklogo.com/logo-png/37/1/samsung-logo-png_seeklogo-370356.png'
        },
        { 
          name: 'Adidas', 
          href: '/brands/adidas',
          image: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'
        },
        { 
          name: 'Fossil', 
          href: '/brands/fossil',
          image: 'https://images.seeklogo.com/logo-png/47/2/fossil-watch-logo-png_seeklogo-472088.png'
        },
        { 
          name: 'Calvin Klein', 
          href: '/brands/calvin-klein',
          image: 'https://images.seeklogo.com/logo-png/2/1/calvin-klein-logo-png_seeklogo-25074.png'
        },
        { 
          name: 'Levi\'s', 
          href: '/brands/levis',
          image: 'https://logowik.com/content/uploads/images/254_levis.jpg'
        },
        { 
          name: 'Casio', 
          href: '/brands/casio',
          image: 'https://images.seeklogo.com/logo-png/2/1/casio-logo-png_seeklogo-26977.png'
        }
      ]
    },
    {
      name: 'Sale & Offers',
      type: 'link',
      href: '/SaleOffers'
    }
  ]

  const handleCategoryClick = (categoryName, categoryType) => {
    if (categoryType === 'link') return
    setActiveDropdown(activeDropdown === categoryName ? null : categoryName)
  }

  const handleMobileCategoryClick = (categoryName, categoryType) => {
    if (categoryType === 'link') return
    setActiveMobileDropdown(activeMobileDropdown === categoryName ? null : categoryName)
  }

  const renderDropdownContent = (category) => {
    if (!category.items) return null

    if (category.type === 'brands') {
      return (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 p-3 xs:p-4 sm:p-6 w-[280px] xs:w-[320px] sm:w-[400px] md:w-[480px]">
          {category.items.map((brand, index) => (
            <Link
              key={index}
              to={brand.href}
              className="group flex flex-col items-center p-2 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover:shadow-sm transform hover:-translate-y-0.5"
              onClick={() => {
                setActiveDropdown(null)
                setIsMobileMenuOpen(false)
              }}
            >
              <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1 xs:mb-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 items-center justify-center text-gray-400 font-bold text-xs">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-green-600 transition-colors">{brand.name}</span>
            </Link>
          ))}
        </div>
      )
    }

    return (
      <div className=" py-2 w-48 xs:w-56 bg-linear-to-b from-white to-gray-50">
        {category.items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="flex items-center px-4 py-2 xs:px-5 xs:py-3 text-sm text-gray-700 hover:bg-linear-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200 group border-l-4 border-transparent hover:border-green-500"
            onClick={() => {
              setActiveDropdown(null)
              setIsMobileMenuOpen(false)
            }}
          >
            {item.icon && (
              <span className="mr-3 text-gray-400 group-hover:text-green-500 transition-colors transform group-hover:scale-110">
                {item.icon}
              </span>
            )}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    )
  }

  const renderMobileDropdownContent = (category) => {
    if (!category.items) return null

    if (category.type === 'brands') {
      return (
        <div className="grid grid-cols-2 gap-2 p-3">
          {category.items.map((brand, index) => (
            <Link
              key={index}
              to={brand.href}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-10 h-10 items-center justify-center text-gray-400 font-bold text-xs">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <span className="text-xs text-center font-medium">{brand.name}</span>
            </Link>
          ))}
        </div>
      )
    }

    return (
      <div className="pl-4">
        {category.items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="block py-2 px-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    )
  }

  const searchSuggestions = getSearchSuggestions()

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm relative" ref={dropdownRef}>
        <div className="container mx-auto px-3 xs:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 relative">
            {/* Logo/Brand - Left */}
            <div className="flex items-center">
              {/* Mobile Hamburger Menu Button */}
              <button
                data-mobile-menu-button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-green-600 p-2 mr-2"
                aria-label="Toggle menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              
              {/* Brand/Logo */}
              <Link to="/" className="text-lg sm:text-xl font-bold text-gray-900 hover:text-green-600 transition-colors">
                ShopNow
              </Link>
            </div>

            {/* Main Categories - Desktop */}
            <div className={`hidden lg:flex flex-1 justify-center transition-all duration-200 ${isSearchOpen ? 'hidden' : ''}`}>
              <div className="flex items-center space-x-6">
                {categories.map((category) => (
                  <div key={category.name} className="relative">
                    {category.type === 'link' ? (
                      <Link
                        to={category.href}
                        className="flex items-center space-x-1 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors relative group"
                      >
                        <span>{category.name}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleCategoryClick(category.name, category.type)}
                        className="flex items-center space-x-1 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors group"
                      >
                        <span>{category.name}</span>
                        <FiChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === category.name ? 'rotate-180 text-green-600' : ''}`} />
                      </button>
                    )}

                    {/* Dropdown Menu */}
                    {activeDropdown === category.name && category.type !== 'link' && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                        {renderDropdownContent(category)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 xs:space-x-3">
              {/* Desktop Search - Hidden on mobile when search is open */}
              <div className="hidden lg:block">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`text-gray-600 hover:text-green-600 transition-all duration-200 p-1.5 xs:p-2 rounded-full hover:bg-green-50 z-10 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  aria-label="Search"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden text-gray-600 hover:text-green-600 p-1.5 xs:p-2 rounded-full hover:bg-green-50"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {/* User Account - Desktop */}
              <Link
                to={isLoggedIn ? "/profile" : "/signin"}
                className="hidden lg:block text-gray-600 hover:text-green-600 p-1.5 xs:p-2 rounded-full hover:bg-green-50 transition-colors"
                aria-label="Account"
              >
                <FiUser className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Full Width Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-0 left-0 w-full bg-white border-b border-gray-200 shadow-lg z-30 animate-fadeIn">
            <div className="container mx-auto px-3 xs:px-4">
              <form
                onSubmit={handleSearch}
                className="py-3 sm:py-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, colors, categories..."
                    className="w-full pl-10 pr-20 py-2 xs:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm xs:text-base"
                    autoFocus
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 xs:w-5 xs:h-5" />
                  
                  {/* Search Actions */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 xs:space-x-2">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Clear search"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!searchQuery.trim()}
                      className={`px-3 xs:px-4 py-1 xs:py-1.5 rounded text-xs xs:text-sm font-medium ${searchQuery.trim() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      aria-label="Close search"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-40 animate-fadeIn">
                    <div className="p-3">
                      <div className="grid grid-cols-1 gap-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <Link
                            key={index}
                            to={suggestion.href}
                            className="flex items-center px-3 py-2 hover:bg-green-50 rounded-md transition-colors group"
                            onClick={() => {
                              setIsSearchOpen(false)
                              setSearchQuery('')
                            }}
                          >
                            <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${suggestion.type === 'category' ? 'bg-blue-100 text-blue-600' : suggestion.type === 'brand' ? 'bg-purple-100 text-purple-600' : suggestion.type === 'color' ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'}`}>
                              <FiSearch className="w-3 h-3" />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-green-600">
                              {suggestion.text}
                            </span>
                            <span className="ml-auto text-xs text-gray-400 capitalize">{suggestion.type}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 backdrop-blur-lg z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-64 xs:w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="h-[calc(100%-64px)] overflow-y-auto">
          {/* User Section */}
          <div className="p-4 border-b border-gray-200">
            <Link
              to={isLoggedIn ? "/profile" : "/signin"}
              className="flex items-center text-gray-700 hover:text-green-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiUser className="w-5 h-5 mr-3" />
              <span className="font-medium">{isLoggedIn ? "My Profile" : "Sign In / Register"}</span>
            </Link>
          </div>

          {/* Mobile Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
          </div>

          {/* Mobile Categories */}
          <div className="p-2">
            {categories.map((category) => (
              <div key={category.name} className="mb-1">
                {category.type === 'link' ? (
                  <Link
                    to={category.href}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-medium">{category.name}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleMobileCategoryClick(category.name, category.type)}
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    >
                      <span className="font-medium">{category.name}</span>
                      <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeMobileDropdown === category.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Mobile Dropdown Content */}
                    {activeMobileDropdown === category.name && (
                      <div className="ml-4 border-l border-gray-200">
                        {renderMobileDropdownContent(category)}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Additional Mobile Links */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/help"
                className="block text-gray-600 hover:text-green-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Help & Support
              </Link>
              <Link
                to="/contact"
                className="block text-gray-600 hover:text-green-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                to="/track-order"
                className="block text-gray-600 hover:text-green-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar for Quick Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2"
          >
            <FiMenu className="w-5 h-5 mb-1" />
            <span className="text-xs">Menu</span>
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2"
          >
            <FiSearch className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </button>
          <Link
            to="/cart"
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2 relative"
          >
            <FiShoppingCart className="w-5 h-5 mb-1" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>
          <Link
            to={isLoggedIn ? "/profile" : "/signin"}
            className="flex flex-col items-center text-gray-600 hover:text-green-600 p-2"
          >
            <FiUser className="w-5 h-5 mb-1" />
            <span className="text-xs">{isLoggedIn ? "Profile" : "Account"}</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Navbar