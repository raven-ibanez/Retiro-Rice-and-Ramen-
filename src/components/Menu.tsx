import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import { usePromotions, Promotion } from '../hooks/usePromotions';
import { useExclusiveOffers, ExclusiveOffer } from '../hooks/useExclusiveOffers';
import { useCart } from '../hooks/useCart';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';
import ImageModal from './ImageModal';
import QuantityModal from './QuantityModal';
import { Star, Crown, Zap } from 'lucide-react';

// Exclusive Offers Component
const ExclusiveOffers: React.FC<{ onAddToCart: (item: CartItem) => void }> = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [modalImage, setModalImage] = React.useState({ url: '', title: '', alt: '' });
  const [showQuantityModal, setShowQuantityModal] = React.useState(false);

  const { offers, settings, loading } = useExclusiveOffers();

  // Filter only available offers for display
  const availableOffers = offers.filter(offer => offer.available);

  // Auto-rotate carousel based on settings
  React.useEffect(() => {
    if (!settings.auto_rotate || availableOffers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % availableOffers.length);
    }, settings.rotation_speed);

    return () => clearInterval(interval);
  }, [settings.auto_rotate, settings.rotation_speed, availableOffers.length]);

  // Touch handlers for swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % availableOffers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + availableOffers.length) % availableOffers.length);
  };

  const handleAddToCart = async (offer: ExclusiveOffer) => {
    setShowQuantityModal(true);
  };

  const handleQuantityAddToCart = async (quantity: number) => {
    setIsAddingToCart(true);
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Convert exclusive offer to cart item format
    const cartItem: CartItem = {
      id: availableOffers[currentSlide].id,
      name: availableOffers[currentSlide].title,
      description: availableOffers[currentSlide].description || '',
      basePrice: availableOffers[currentSlide].price,
      category: 'Exclusive Offers',
      image: availableOffers[currentSlide].image_url,
      popular: false,
      available: availableOffers[currentSlide].available,
      quantity: quantity,
      totalPrice: availableOffers[currentSlide].price * quantity
    };

    onAddToCart(cartItem);
    setIsAddingToCart(false);
    setShowSuccessFeedback(true);
    setShowQuantityModal(false);
    // Hide success feedback after 2 seconds
    setTimeout(() => setShowSuccessFeedback(false), 2000);
  };

  const handleImageClick = (offer: ExclusiveOffer) => {
    setModalImage({
      url: offer.image_url || '',
      title: offer.title,
      alt: offer.title
    });
    setShowImageModal(true);
  };

  // Don't render if disabled or no offers available
  if (!settings.enabled || availableOffers.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-retiro-cream to-retiro-beige py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-retiro-red mx-auto mb-4"></div>
            <p className="text-retiro-charcoal">Loading exclusive offers...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-gradient-to-br from-retiro-cream to-retiro-beige py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-retiro-red text-white px-6 py-2 rounded-full mb-4">
            <span className="text-sm font-bold tracking-wider uppercase">{settings.badge}</span>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-retiro-red mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-retiro-dark">
              {settings.title}
            </h2>
            <Crown className="w-8 h-8 text-retiro-red ml-3" />
          </div>
          <p className="text-xl text-retiro-charcoal max-w-2xl mx-auto">
            {settings.subtitle}
          </p>
        </div>

        {/* Exclusive Items Carousel */}
        <div 
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative h-96 bg-white">
            {availableOffers.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Background Image */}
                <img 
                  src={item.image_url || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop'}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all duration-300"
                  onClick={() => handleImageClick(item)}
                  title="Click to enlarge image"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-retiro-dark/70 via-retiro-dark/40 to-transparent"></div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/50 transition-all duration-300 border border-white/20"
                  aria-label="Previous exclusive item"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/50 transition-all duration-300 border border-white/20"
                  aria-label="Next exclusive item"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Content */}
                <div className="relative z-10 flex items-center h-full px-4 sm:px-16">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    {item.badge_text && (
                      <div className="inline-block bg-retiro-red text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full mb-4 sm:mb-6">
                        <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">{item.badge_text}</span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                      {item.title}
                    </h3>
                    
                    {/* Subtitle */}
                    {item.subtitle && (
                      <p className="text-sm sm:text-xl text-retiro-cream mb-2 sm:mb-4 font-medium">
                        {item.subtitle}
                      </p>
                    )}
                    
                    {/* Description */}
                    {item.description && (
                      <p className="text-xs sm:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    {/* Pricing */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl sm:text-4xl font-bold text-retiro-cream">₱{item.price.toLocaleString()}</span>
                        <span className="text-lg sm:text-xl text-gray-300 line-through">₱{item.original_price.toLocaleString()}</span>
                      </div>
                      {item.discount_text && (
                        <div className="bg-retiro-kimchi text-white px-3 py-1 rounded-full text-sm font-bold">
                          {item.discount_text}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <button 
                      onClick={() => handleAddToCart(item)}
                      disabled={isAddingToCart}
                      className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg transform ${
                        isAddingToCart 
                          ? 'bg-gray-400 cursor-not-allowed scale-95' 
                          : 'bg-retiro-cream text-retiro-red hover:bg-white hover:scale-105'
                      } ${showSuccessFeedback ? 'bg-green-500 text-white' : ''}`}
                    >
                      {isAddingToCart ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </div>
                      ) : showSuccessFeedback ? (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Added!</span>
                        </div>
                      ) : (
                        'Order Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {availableOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-retiro-cream scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to exclusive item ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={modalImage.url}
        alt={modalImage.alt}
        title={modalImage.title}
      />

      {/* Quantity Modal */}
      {availableOffers.length > 0 && (
        <QuantityModal
          isOpen={showQuantityModal}
          onClose={() => setShowQuantityModal(false)}
          onAddToCart={handleQuantityAddToCart}
          productName={availableOffers[currentSlide]?.title || ''}
          productPrice={availableOffers[currentSlide]?.price || 0}
          productImage={availableOffers[currentSlide]?.image_url}
          isLoading={isAddingToCart}
          showSuccess={showSuccessFeedback}
          maxQuantity={20}
        />
      )}
    </div>
  );
};

// Promotion Carousel Component
const PromotionCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const { promotions, settings, loading } = usePromotions();

  // Auto-rotate carousel if enabled and has promotions
  React.useEffect(() => {
    if (!settings.promotion_auto_rotate || promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, settings.promotion_rotation_speed);

    return () => clearInterval(interval);
  }, [promotions.length, settings.promotion_auto_rotate, settings.promotion_rotation_speed]);

  // Reset current slide when promotions change
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [promotions.length]);

  // Touch handlers for swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  // Don't render if no promotions or disabled
  if (!settings.promotions_enabled || promotions.length === 0) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-retiro-red to-retiro-kimchi rounded-2xl overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading promotions...</p>
          </div>
        </div>
      </div>
    );
  }


  const currentPromotion = promotions[currentSlide];

  return (
    <div 
      className="relative h-80 sm:h-96 bg-gradient-to-r from-retiro-red to-retiro-kimchi"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Image */}
      <img 
        src={currentPromotion.image_url}
        alt={currentPromotion.subtitle}
        className="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-500"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${currentPromotion.gradient_colors}/80`}></div>
      
      {/* Navigation Arrows - Always visible */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/50 transition-all duration-300 border border-white/20"
        aria-label="Previous promotion"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/50 transition-all duration-300 border border-white/20"
        aria-label="Next promotion"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-16">
        <div className="text-center text-white max-w-4xl mx-auto">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-1 sm:py-2 mb-4 sm:mb-6 animate-fade-in">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">{currentPromotion.badge_text}</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
            <span className="text-retiro-cream">{currentPromotion.title}</span>
          </h2>
          
          <p className="text-sm sm:text-xl md:text-2xl mb-2 opacity-90 font-medium px-2">
            {currentPromotion.subtitle}
          </p>
          
          <p className="text-xs sm:text-lg mb-6 sm:mb-8 opacity-80 px-2">
            {currentPromotion.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2">
              <span className="text-xs sm:text-sm opacity-90">Valid until</span>
              <div className="text-sm sm:text-lg font-bold">{currentPromotion.valid_until}</div>
            </div>
            
            <button className="bg-retiro-cream text-retiro-red px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg">
              Order Now
            </button>
          </div>
          
          <p className="text-xs sm:text-sm opacity-75 mt-2 sm:mt-4 px-2">
            * Use code: <span className="font-bold">{currentPromotion.promo_code}</span> at checkout
          </p>
        </div>
      </div>

    </div>
  );
};

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <MobileNav 
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Promotion Carousel Section */}
        <div className="relative mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <PromotionCarousel />
        </div>

        {/* Exclusive Offers Section */}
        <div className="mb-16">
          <ExclusiveOffers onAddToCart={addToCart} />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-noto font-semibold text-black mb-4">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the perfect harmony of rich, savory ramen and comforting rice dishes, made with care and the freshest ingredients.
          </p>
        </div>

      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category.id);
        
        if (categoryItems.length === 0) return null;
        
        return (
          <section key={category.id} id={category.id} className="mb-16">
            <div className="flex items-center mb-8">
              <span className="text-3xl mr-3">{category.icon}</span>
              <h3 className="text-3xl font-noto font-medium text-black">{category.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => {
                const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={cartItem?.quantity || 0}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      </main>
    </>
  );
};

export default Menu;