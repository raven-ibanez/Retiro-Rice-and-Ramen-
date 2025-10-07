import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import { usePromotions, Promotion } from '../hooks/usePromotions';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';

// Promotion Carousel Component
const PromotionCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
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
    <div className="relative h-80 sm:h-96 bg-gradient-to-r from-retiro-red to-retiro-kimchi">
      {/* Background Image */}
      <img 
        src={currentPromotion.image_url}
        alt={currentPromotion.subtitle}
        className="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-500"
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${currentPromotion.gradient_colors}/80`}></div>
      
      {/* Navigation Arrows - Hidden on mobile, shown on larger screens */}
      <button
        onClick={prevSlide}
        className="hidden sm:block absolute left-3 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm rounded-full p-3 hover:bg-black/50 transition-all duration-300 border border-white/20"
        aria-label="Previous promotion"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="hidden sm:block absolute right-3 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 backdrop-blur-sm rounded-full p-3 hover:bg-black/50 transition-all duration-300 border border-white/20"
        aria-label="Next promotion"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Mobile Navigation Dots */}
      <div className="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50'
            }`}
            aria-label={`Go to promotion ${index + 1}`}
          />
        ))}
      </div>
      
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