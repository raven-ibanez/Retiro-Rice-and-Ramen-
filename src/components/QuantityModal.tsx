import React, { useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Check } from 'lucide-react';

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  productName: string;
  productPrice: number;
  productImage?: string;
  isLoading?: boolean;
  showSuccess?: boolean;
  maxQuantity?: number;
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  productName,
  productPrice,
  productImage,
  isLoading = false,
  showSuccess = false,
  maxQuantity = 20
}) => {
  const [quantity, setQuantity] = React.useState(1);

  // Reset quantity when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const totalPrice = productPrice * quantity;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Add to Cart</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 mb-6">
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">{productName}</h4>
              <p className="text-retiro-red font-bold text-lg">₱{productPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quantity
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1 || isLoading}
                className="w-12 h-12 rounded-full bg-retiro-red text-white flex items-center justify-center hover:bg-retiro-kimchi transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <span className="text-sm text-gray-500">items</span>
              </div>
              
              <button
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity || isLoading}
                className="w-12 h-12 rounded-full bg-retiro-red text-white flex items-center justify-center hover:bg-retiro-kimchi transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Price:</span>
              <span className="text-2xl font-bold text-retiro-red">₱{totalPrice.toFixed(2)}</span>
            </div>
            {quantity > 1 && (
              <p className="text-sm text-gray-500 mt-1 text-right">
                ₱{productPrice.toFixed(2)} × {quantity} items
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                showSuccess
                  ? 'bg-green-500 text-white'
                  : isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-retiro-red text-white hover:bg-retiro-kimchi hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : showSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-500 text-center">
            Maximum {maxQuantity} items per order
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
