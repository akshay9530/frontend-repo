import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Header from '../components/Header';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { slidingImages, gridImages, createPlaceholder } from '../dummyData/homeData';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const navigate = useNavigate();

  // Auto-slide functionality with smooth transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slidingImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, [slidingImages.length]);

  const goToSlide = (index) => {
    if (index === currentSlide || isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    goToSlide((currentSlide + 1) % slidingImages.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    goToSlide((currentSlide - 1 + slidingImages.length) % slidingImages.length);
  };

  // Image error handler
  const handleImgError = (e, placeholder) => {
    if (e.target.src !== placeholder) {
      e.target.src = placeholder;
    }
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => new Set([...prev, id]));
  };

  const handleImageError = (e, placeholder, id) => {
    handleImgError(e, placeholder);
    handleImageLoad(id);
  };

  // Handle slide button clicks based on slide index
  const handleSlideButtonClick = (slideIndex) => {
    switch(slideIndex) {
      case 0: // New Arrivals
        navigate('/new-arrivals');
        break;
      case 1: // Best Sellers
        navigate('/clothes/women');
        break;
      case 2: // Limited Edition
        navigate('/sneakers/men');
        break;
      case 3: // "/fragrance/women"
        navigate("/fragrance/women");
        break;
      case 4: // "/fragrance men"
        navigate("/fragrance/men");
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="grow">
        {/* Hero Slider Section */}
        <section className="relative w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] overflow-hidden bg-gray-900">
          {/* Slides Container */}
          <div className="relative w-full h-full">
            {slidingImages.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0 z-20'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full z-10'
                    : 'opacity-0 translate-x-full z-10'
                }`}
                aria-hidden={index !== currentSlide}
              >
                {/* Background Image */}
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    onLoad={() => handleImageLoad(slide.id)}
                    onError={(e) => handleImageError(e, slide.placeholder, slide.id)}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  
                  {/* Fixed gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
                  
                  {/* Loading Fallback */}
                  <div className={`absolute inset-0 bg-gray-800 flex items-center justify-center ${loadedImages.has(slide.id) ? 'hidden' : ''}`}>
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-white mx-auto mb-2 xs:mb-3 sm:mb-4"></div>
                      <p className="text-xs xs:text-sm sm:text-base">Loading...</p>
                    </div>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center z-30 px-3 xs:px-4 sm:px-6">
                  <div className="container mx-auto px-3 xs:px-4 sm:px-6">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 xs:mb-3 sm:mb-4 animate-fade-in-up">
                        {slide.title}
                      </h2>
                      <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-3 xs:mb-4 sm:mb-6 md:mb-8 opacity-90 animate-fade-in-up animation-delay-200">
                        {slide.description}
                      </p>
                      <button 
                        onClick={() => handleSlideButtonClick(index)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 xs:px-4 sm:px-6 md:px-8 py-1.5 xs:py-2 sm:py-3 md:py-4 rounded-full font-semibold text-xs xs:text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400 shadow-lg"
                      >
                        {slide.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 xs:left-3 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white p-1.5 xs:p-2 sm:p-3 rounded-full transition-all duration-300 z-40 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 xs:right-3 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white p-1.5 xs:p-2 sm:p-3 rounded-full transition-all duration-300 z-40 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 xs:space-x-2 sm:space-x-3 z-40">
            {slidingImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 right-3 xs:right-4 sm:right-6 bg-black/50 text-white px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs sm:text-sm z-40 backdrop-blur-sm">
            {currentSlide + 1} / {slidingImages.length}
          </div>
        </section>

        {/* Featured Collections Grid */}
        <section className="bg-gray-50 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6">
            <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
                Explore Our Collections
              </h2>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 xs:px-4 sm:px-0">
                Discover our carefully curated selection of beauty products for every need and occasion
              </p>
            </div>

            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
              {gridImages.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 xs:hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => handleImgError(e, item.placeholder)}
                      className="w-full h-40 xs:h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                    <div className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4">
                      <span className="bg-green-500 text-white px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs sm:text-sm font-semibold">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="p-3 xs:p-4 sm:p-6">
                    <h3 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl text-gray-900 mb-1 xs:mb-2 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs xs:text-sm md:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">{item.description}</p>
                    <button className="w-full bg-gray-100 hover:bg-green-600 hover:text-white text-gray-800 py-1.5 xs:py-2 sm:py-3 rounded-lg font-semibold text-xs xs:text-sm sm:text-base transition-all duration-300 transform group-hover:scale-105">
                      Available Soon..
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* First Video Section */}
            <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16">
              <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video w-full overflow-hidden">
                  <video
                    src="https://s7d5.scene7.com/is/content/Crate/Video/cb_mHP_20250222_CBCC.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  
                  {/* All Items Available Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button 
                      onClick={() => navigate('/')}
                      className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 xs:px-4 sm:px-6 md:px-8 py-1.5 xs:py-2 sm:py-3 md:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm bg-opacity-90 border-2 border-white hover:border-green-300"
                    >
                      All ... Available
                    </button>
                  </div>
                </div>
                
                <div className="p-3 xs:p-4 sm:p-6 text-center">
                  <h3 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 mb-1 xs:mb-2">
                    Premium Collection 2026
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                    Explore our exclusive collection with limited time offers
                  </p>
                </div>
              </div>
            </div>

            {/* Second Video Section */}
            <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16">
              <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video w-full overflow-hidden">
                  <video
                    src="https://s7d5.scene7.com/is/content/Crate/Video/cb_dHP_20251023_DD.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  
                  {/* All Items Available Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button 
                      onClick={() => navigate('/')}
                      className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 xs:px-4 sm:px-6 md:px-8 py-1.5 xs:py-2 sm:py-3 md:py-4 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm bg-opacity-90 border-2 border-white hover:border-blue-300"
                    >
                      All .... Available
                    </button>
                  </div>
                </div>
                
                <div className="p-3 xs:p-4 sm:p-6 text-center">
                  <h3 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 mb-1 xs:mb-2">
                    Designer Collection
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                    Latest trends and designer items now available
                  </p>
                </div>
              </div>
            </div>

           

            {/* YouTube Video Section */}
            <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16">
              <div className="w-full bg-transparent relative">
                <div className="relative aspect-video w-full max-w-full overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl">
                  <iframe
                    src="https://www.youtube.com/embed/3gwNezFJuYM?autoplay=1&mute=1&loop=1&playlist=3gwNezFJuYM&modestbranding=1&controls=0&rel=0&showinfo=0"
                    title="Beauty Collection Video"
                    className="w-full h-full scale-105"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                    loading="lazy"
                  ></iframe>
                  
                  {/* Buy Now Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-14">
                    <button 
                      onClick={() => navigate('/brands/apple')}
                      className="bg-green-600 hover:bg-green-800 text-white px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-1.5 xs:py-2 sm:py-3 md:py-4 lg:py-6 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm bg-opacity-95 border-2 xs:border-3 md:border-4 border-white hover:border-green-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Barbershop Products GIF Section */}
            <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16 text-center">
              <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative">
                  <img
                    src="https://i.marketingprofs.com/assets/images/articles/content/birds-barbershop-products.gif"
                    alt="Barbershop Products"
                    className="w-full h-auto object-cover"
                    onError={(e) => handleImgError(e, createPlaceholder('Barbershop Products'))}
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-500" />
                  
                  {/* Visit Now Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button className="bg-blue-600 hover:bg-blue-800 text-white px-3 xs:px-4 sm:px-6 md:px-8 lg:px-14 py-1.5 xs:py-2 sm:py-3 md:py-4 lg:py-5 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm bg-opacity-90 border-2 xs:border-3 md:border-4 border-white hover:border-blue-300">
                      Visit Now
                    </button>
                  </div>
                </div>
                
                <div className="p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 text-center">
                  <h3 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 mb-1 xs:mb-2">
                    Premium Grooming Products
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                    Discover our exclusive barbershop collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Black Friday Section */}
        <section className="relative py-8 xs:py-10 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://content.asos-media.com/-/media/homepages/unisex/generic-hp/nov-2025---black-friday/00-generic-hp-landing-screen/00-uk/generic-homepage-landing-screen_1440x698.jpg"
              alt="Black Friday Sale"
              className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
              onError={(e) => handleImgError(e, createPlaceholder('Black Friday', 1440, 698))}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 relative z-10">
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-6 md:gap-8 justify-center items-center">
                <button 
                  onClick={() => navigate('/clothes/women')}
                  className="bg-white text-black hover:bg-gray-100 hover:text-gray-800 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-gray-200 min-w-[140px] xs:min-w-[150px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] uppercase tracking-wide"
                >
                  SHOP WOMENS
                </button>
                <button 
                  onClick={() => navigate('/clothes/men')}
                  className="bg-white text-black hover:bg-gray-100 hover:text-gray-800 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-full font-bold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-gray-200 min-w-[140px] xs:min-w-[150px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] uppercase tracking-wide"
                >
                  SHOP MENS
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-green-600 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 text-center">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 xs:mb-3 sm:mb-4">
              Stay Updated
            </h2>
            <p className="text-green-100 text-xs xs:text-sm sm:text-base md:text-lg mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and beauty tips.
            </p>
            <div className="max-w-md mx-auto flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 rounded-full border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 text-xs xs:text-sm sm:text-base"
              />
              <button className="bg-white text-green-600 hover:bg-gray-100 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 rounded-full font-semibold text-xs xs:text-sm sm:text-base transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;