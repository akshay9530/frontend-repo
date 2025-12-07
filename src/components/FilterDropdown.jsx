import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiX, FiClock, FiArrowUp, FiArrowDown, FiTrendingUp, FiStar } from 'react-icons/fi';

const COLOR_HEX = {
  Black: '#000000',
  White: '#FFFFFF',
  Blue: '#2563EB',
  Red: '#DC2626',
  Green: '#059669',
  Yellow: '#F59E0B',
  Brown: '#8B5E3C',
  Gray: '#6B7280',
  Pink: '#EC4899',
  Purple: '#7C3AED',
  'Multi-color': 'linear-gradient(45deg,#F97316,#06B6D4,#EF4444)'
};

const FilterDropdown = ({ label, value, options, isOpen, onToggle, onSelect, onClear, onClose }) => {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0, minWidth: 0 });
  const [openDirection, setOpenDirection] = useState('down');

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const menuWidthEstimate = 240;
      const left = Math.min(Math.max(8, rect.left), Math.max(8, viewportWidth - menuWidthEstimate - 8));
      setMenuStyle({
        top: rect.bottom + 6 + window.scrollY,
        left: left + window.scrollX,
        minWidth: Math.max(rect.width, 180)
      });
      setOpenDirection('down');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!buttonRef.current || !menuRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < menuRect.height + 12 && spaceAbove > menuRect.height + 12) {
      setMenuStyle((prev) => ({
        ...prev,
        top: rect.top - menuRect.height - 6 + window.scrollY
      }));
      setOpenDirection('up');
    } else {
      setMenuStyle((prev) => ({
        ...prev,
        top: rect.bottom + 6 + window.scrollY
      }));
      setOpenDirection('down');
    }
  }, [isOpen, options]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e) => {
      if (
        buttonRef.current &&
        menuRef.current &&
        !buttonRef.current.contains(e.target) &&
        !menuRef.current.contains(e.target)
      ) {
        onClose && onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const renderOptionContent = (label, option) => {
    if (label.toLowerCase().includes('colour') || label.toLowerCase().includes('color')) {
      const hex = COLOR_HEX[option] || '#E5E7EB';
      return (
        <div className="flex items-center space-x-3">
          <span
            aria-hidden
            className="w-5 h-5 rounded-full border"
            style={{
              background: COLOR_HEX[option] || hex,
              backgroundImage: option === 'Multi-color' ? COLOR_HEX['Multi-color'] : undefined
            }}
          />
          <span>{option}</span>
        </div>
      );
    }

    if (label.toLowerCase().includes('size')) {
      return (
        <div className="flex items-center">
          <div className="px-3 py-1 text-sm rounded-full bg-gray-100">{option}</div>
        </div>
      );
    }

    return <span>{option}</span>;
  };

  const sortIconForOption = (option) => {
    if (option.toLowerCase().includes('price: low')) return <FiArrowDown className="w-4 h-4" />;
    if (option.toLowerCase().includes('price: high')) return <FiArrowUp className="w-4 h-4" />;
    if (option.toLowerCase().includes('newest')) return <FiClock className="w-4 h-4" />;
    if (option.toLowerCase().includes('popularity') || option.toLowerCase().includes('trending')) return <FiTrendingUp className="w-4 h-4" />;
    if (option.toLowerCase().includes('rating') || option.toLowerCase().includes('customer')) return <FiStar className="w-4 h-4" />;
    return null;
  };

  const FiCheckIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
    </svg>
  );

  const menu = isOpen ? (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${menuStyle.top}px`,
        left: `${menuStyle.left}px`,
        minWidth: `${menuStyle.minWidth}px`,
        zIndex: 9999
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto"
      onMouseDown={(e) => e.stopPropagation()}
      role="listbox"
      aria-label={label}
    >
      <div className="py-2">
        {options.map((option) => {
          const selected = value === option;
          const isSort = label.toLowerCase().includes('sort');
          return (
            <button
              key={option}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(option);
                onClose && onClose();
              }}
              className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm transition-colors ${
                selected ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'
              }`}
              role="option"
              aria-selected={selected}
            >
              <div className="flex items-center space-x-3">
                {isSort ? (
                  <span className="w-4 h-4 text-gray-500">{sortIconForOption(option)}</span>
                ) : null}
                <div className="truncate">{renderOptionContent(label, option)}</div>
              </div>
              {selected && (
                <span className="text-green-600 font-semibold">
                  <FiCheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative inline-block" ref={buttonRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
            value ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <span className="truncate max-w-[120px]">{value || label}</span>
          <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
            aria-label={`Clear ${label}`}
          >
            <FiX className="w-3 h-3" />
          </button>
        )}
      </div>

      {menu && createPortal(menu, document.body)}
    </>
  );
};

export default FilterDropdown;