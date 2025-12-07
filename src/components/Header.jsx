import { Link } from "react-router-dom";
import { FiUserPlus, FiLogIn, FiMapPin, FiHelpCircle, FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useCart, useCartListener } from '../hooks/useCart';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItemCount, getCartSummary } = useCart();
  const [cartSummary, setCartSummary] = useState({ itemCount: 0, formatted: { total: '₹0' } });
  const mobileMenuRef = useRef(null);

  // Listen for cart updates
  useCartListener((cart) => {
    const summary = getCartSummary();
    setCartSummary(summary);
  });

  // Initial load
  useEffect(() => {
    const summary = getCartSummary();
    setCartSummary(summary);
  }, [getCartSummary]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="p-2 sm:p-3 lg:p-4">
          <nav
            className="
              container mx-auto 
              flex 
              justify-between 
              items-center 
              gap-2 sm:gap-3 lg:gap-4
              w-full
            "
          >

            {/* Left: Hamburger Menu (Mobile & Tablet) */}
            <div className="lg:hidden flex items-center">
              <button
                data-mobile-menu-button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-green-600 p-1.5"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Center: SEPHORA Logo */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <Link
                to="/"
                className="
                  text-lg sm:text-xl lg:text-2xl font-bold 
                  inline-block overflow-hidden 
                  w-full 
                  max-w-full 
                  sm:max-w-md 
                  whitespace-nowrap 
                  text-center 
                  lg:text-left
                "
              >
                <span
                  className="inline-block text-gray-900 hover:text-green-600 transition-colors"
                  style={{
                    animation: 'marquee 15s linear infinite',
                    display: 'inline-block',
                    letterSpacing: '0.2em'
                  }}
                >
                  S&nbsp;&nbsp;E&nbsp;&nbsp;P&nbsp;&nbsp;H&nbsp;&nbsp;O&nbsp;&nbsp;R&nbsp;&nbsp;A&nbsp;&nbsp;
                </span>

                <span
                  className="inline-block text-gray-900 hover:text-green-600 transition-colors"
                  style={{
                    animation: 'marquee 15s linear infinite',
                    animationDelay: '-7.5s',
                    display: 'inline-block',
                    letterSpacing: '0.2em'
                  }}
                >
                  S&nbsp;&nbsp;E&nbsp;&nbsp;P&nbsp;&nbsp;H&nbsp;&nbsp;O&nbsp;&nbsp;R&nbsp;&nbsp;A&nbsp;&nbsp;
                </span>
              </Link>
            </div>

            {/* Right: Top Navigation Links (Desktop Only) */}
            <div
              className="
                hidden 
                lg:flex 
                items-center 
                space-x-4 xl:space-x-6
                text-sm lg:text-base
              "
            >
              <Link
                to="/signup"
                className="flex items-center space-x-1 hover:text-green-600 hover:underline transition-colors"
              >
                <FiUserPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Sign Up</span>
              </Link>

              <Link
                to="/signin"
                className="flex items-center space-x-1 hover:text-green-600 hover:underline transition-colors"
              >
                <FiLogIn className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Sign In</span>
              </Link>

              <Link
                to="/cart"
                className="flex items-center space-x-1 hover:text-green-600 hover:underline transition-colors relative"
              >
                <FiShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/"
                className="flex items-center space-x-1 hover:text-green-600 hover:underline transition-colors"
              >
                <FiMapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Store Locator</span>
              </Link>

              <Link
                to="/help"
                className="flex items-center space-x-1 hover:text-green-600 hover:underline transition-colors"
              >
                <FiHelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Help</span>
              </Link>
            </div>

            {/* Cart icon for mobile/tablet */}
            <div className="lg:hidden flex items-center">
              <Link
                to="/cart"
                className="text-gray-700 hover:text-green-600 p-1.5 relative"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 backdrop-blur-md z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Mobile Menu Sidebar */}
        <div 
          ref={mobileMenuRef}
          className={`
            lg:hidden 
            fixed top-0 left-0 
            h-full w-64 sm:w-72 
            bg-white shadow-xl 
            z-50 
            transform transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{ top: '60px' }}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Quick Menu</h2>
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
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="flex items-center text-gray-700 hover:text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUserPlus className="w-5 h-5 mr-3" />
                  <span className="font-medium">Sign Up</span>
                </Link>
                <Link
                  to="/signin"
                  className="flex items-center text-gray-700 hover:text-green-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiLogIn className="w-5 h-5 mr-3" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center text-gray-700 hover:text-green-600 relative"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiShoppingCart className="w-5 h-5 mr-3" />
                  <span className="font-medium">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-2">
                <Link
                  to="/"
                  className="flex items-center text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiMapPin className="w-5 h-5 mr-3" />
                  <span>Store Locator</span>
                </Link>
                <Link
                  to="/help"
                  className="flex items-center text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiHelpCircle className="w-5 h-5 mr-3" />
                  <span>Help Center</span>
                </Link>
              </div>
            </div>

            {/* Additional Links */}
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 mb-2">More Links</h3>
                <Link
                  to="/new-arrivals"
                  className="block text-gray-600 hover:text-green-600 py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link
                  to="/SaleOffers"
                  className="block text-gray-600 hover:text-green-600 py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sale & Offers
                </Link>
                <Link
                  to="/track-order"
                  className="block text-gray-600 hover:text-green-600 py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-green-600 py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-green-600 py-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">Customer Support</p>
                <p className="mb-1">📞 1-800-123-4567</p>
                <p className="mb-1">✉️ support@example.com</p>
                <p>🕒 Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          /* Adjust marquee speed for different screen sizes */
          @media (max-width: 640px) {
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          }
          
          @media (min-width: 641px) and (max-width: 1024px) {
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          }
        `}</style>
      </header>
    </>
  );
}