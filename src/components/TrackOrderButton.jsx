import React, { useState } from 'react';
import { FiTruck, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TrackOrderButton = ({ 
  orderNumber, 
  variant = 'default', 
  size = 'md',
  showIcon = true,
  fullWidth = false
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleTrackOrder = async () => {
    if (!orderNumber) {
      alert('Order number is required');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to verify order exists
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate to tracking page
    navigate(`/track-order/${orderNumber}`);
    
    setLoading(false);
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const variantClasses = {
    default: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50',
    ghost: 'text-green-600 hover:bg-green-50',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white'
  };
  
  return (
    <button
      onClick={handleTrackOrder}
      disabled={loading || !orderNumber}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
        shadow-sm hover:shadow
      `}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Tracking...</span>
        </>
      ) : (
        <>
          {showIcon && <FiTruck className="w-4 h-4" />}
          <span>Track Order</span>
          {variant === 'ghost' && <FiExternalLink className="w-3 h-3" />}
        </>
      )}
    </button>
  );
};

export default TrackOrderButton;