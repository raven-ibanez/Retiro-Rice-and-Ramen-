import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  alt, 
  title 
}) => {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
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

  // Zoom functions
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFitToScreen = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag functions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch functions for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
          title="Fit to Screen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleRotate}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
          title="Rotate"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={alt}
          className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            display: 'block'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if (scale === 1) {
              e.preventDefault();
              handleZoomIn();
            }
          }}
        />
      </div>

      {/* Title */}
      {title && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <p className="text-sm font-medium">{title}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-50 px-3 py-2 rounded-lg">
        <p>Click to zoom • Drag to move • Fit to screen • ESC to close</p>
      </div>
    </div>
  );
};

export default ImageModal;
