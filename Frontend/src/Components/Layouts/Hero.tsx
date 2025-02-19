import React, { useState, useEffect, useRef } from "react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { RiStarFill } from "react-icons/ri";

// Import images
import Hero1 from "../Layouts/Img/Hero1.jpg";
import Hero2 from "../Layouts/Img/Hero2.jpg";
import watch from "../Layouts/Img/watch.jpeg";
import shoe from "../Layouts/Img/shoe.jpeg";
import tshirt from "../Layouts/Img/tshirt.jpeg";
import glass from "../Layouts/Img/glass.jpeg";
import banner1 from "../Layouts/Img/banner1.jpg";
import slider1 from "../Layouts/Img/slider1.jpg";
import TrendingCarousel from "./Carousel";
import axios from "axios";
import { baseurl } from "../../Constant/Base";
import { useNavigate } from "react-router-dom";

interface Category {
  name: string,
  image: string,
  _id: string
}

const Hero = ({ onShopNowClick = () => {} }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const navigate = useNavigate();
  
  const api = axios.create({
    baseURL: baseurl
  });
  
  const heroSlides = [
    {
      image: slider1,
      heading: "Elevate Your Style",
      subheading: "Discover the latest fashion trends"
    },
    {
      image: Hero1,
      heading: "Premium Collection",
      subheading: "Luxury meets comfort"
    },
    {
      image: Hero2,
      heading: "Exclusive Designs",
      subheading: "Stand out from the crowd"
    }
  ];

  const [text] = useTypewriter({
    words: ["Elevate Your Style", "Discover the latest fashion trends", "Premium Collection", "Luxury meets comfort", "Exclusive Designs", "Stand out from the crowd"],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 70,
    deleteSpeed: 50
  });

  // Welcome overlay effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Autoplay for hero slider with pause on hover
  useEffect(() => {
    if (isHovering) return;
    
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isHovering, heroSlides.length]);

  const getCategory = async() => {
    setLoadingCategories(true);
    try {
      const response = await api.get("/get-category");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handleClick = () => {
    navigate("/category");
  };

  const getProducts = async() => {
    try {
      const response = await api.get("/get-product");
      console.log(response.data, "may here");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  useEffect(() => {
    getCategory();
    getProducts();
  }, []);

  // Parallax effect for banner on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const offset = window.scrollY;
        // Modify just the y-transform without affecting other properties
        bannerRef.current.style.transform = `translateY(${offset * 0.1}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const bannerSlides = [
    {
      image: banner1,
      title: "WATCHES FOR MEN & LADIES",
      description: "As an official stockist of all brands, we offer a wide selection of premium timepieces for both men and women.",
      accent: "#8B4513"
    },
    {
      image: glass,
      title: "DESIGNER SUNGLASSES",
      description: "Discover our exclusive collection of designer sunglasses featuring the latest trends and timeless classics.",
      accent: "#2C3E50"
    },
    {
      image: shoe,
      title: "PREMIUM FOOTWEAR",
      description: "Step into style with our curated selection of premium shoes for every occasion.",
      accent: "#34495E"
    }
  ];


  

  // Auto-rotate banner slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextBannerSlide = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevBannerSlide = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Get only first 4 categories
  const displayCategories = categories.slice(0, 4);

  return (
    <div className="relative">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-white text-6xl font-light tracking-widest">
                WELCOME TO <span className="font-bold">LUXURY</span>
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold accents */}
      <div className="hidden lg:block fixed top-0 bottom-0 left-8 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent z-10"></div>
      <div className="hidden lg:block fixed top-0 bottom-0 right-8 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent z-10"></div>

      {/* Hero Section with Slider */}
      <div 
        className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlideIndex].image}
              alt={heroSlides[currentSlideIndex].heading}
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-7000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)]"></div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:bg-white/30 z-10 opacity-0 group-hover:opacity-100"
          onClick={prevSlide}
        >
          <FiChevronLeft size={24} />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:bg-white/30 z-10 opacity-0 group-hover:opacity-100"
          onClick={nextSlide}
        >
          <FiChevronRight size={24} />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlideIndex === index ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#D4AF37]/30"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#D4AF37]/30"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#D4AF37]/30"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#D4AF37]/30"></div>

        <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-px bg-[#D4AF37] mb-6"
            ></motion.div>
            
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 min-h-[80px]">
              <span>{text}</span>
              <Cursor cursorColor='#D4AF37' />
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShopNowClick}
              className="bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] group border border-white/20 hover:border-[#D4AF37]"
            >
              <span className="flex items-center">
                Shop Now
                <FiArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900">Select Category</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-4 mb-4"></div>
          <p className="mt-2 text-gray-600">Choose from our premium collection</p>
        </motion.div>

        {loadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden h-96 animate-pulse">
                <div className="h-full w-full bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayCategories.map((category, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden group"
              >
                <div 
                  className="relative h-96 cursor-pointer" 
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Embellishment */}
                  <div className="absolute top-4 right-4 w-10 h-10 border-2 border-[#D4AF37]/40 rounded-full flex items-center justify-center">
                    <RiStarFill className="text-[#D4AF37]/70 text-sm" />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/80 text-white px-6 py-2 rounded-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border-b border-[#D4AF37]">
                      View Collection
                    </span>
                  </div>
                  
                  {/* Category name overlay at bottom */}
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <h3 className="text-xl font-semibold text-white px-4 py-2 bg-black/50 backdrop-blur-sm inline-block">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mb-16">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative overflow-hidden bg-black text-white px-8 py-3 rounded-sm transition-all duration-300 border border-transparent hover:border-[#D4AF37]"
            onClick={handleClick}>
            <span className="relative z-10 flex items-center">
              View More Categories
              <FiArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-[#D4AF37]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </motion.button>
        </div>

        {/* Banner Section with fix for overlap issue */}
        <section className="container mx-auto px-4 py-12 mb-24 overflow-hidden">
  <div className="flex flex-col md:flex-row md:items-center md:space-x-12 lg:space-x-16 relative">
    <div className="w-full md:w-1/2 h-[600px] relative"> {/* Fixed height container */}
      <div className="absolute inset-0 overflow-hidden rounded-lg shadow-xl border border-[#D4AF37]/10">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative w-full h-full"
            ref={bannerRef}
          >
            <img
              src={bannerSlides[currentBannerIndex].image}
              alt={bannerSlides[currentBannerIndex].title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          </motion.div>
        </AnimatePresence>
                
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[#D4AF37]/30 z-10"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[#D4AF37]/30 z-10"></div>
        
        {/* Banner navigation arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] z-10"
          onClick={prevBannerSlide}
        >
          <FiChevronLeft size={20} />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] z-10"
          onClick={nextBannerSlide}
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>

            <motion.div 
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full md:w-1/2 mt-8 md:mt-0"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBannerIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 shadow-lg relative border-l-4"
          style={{ borderColor: bannerSlides[currentBannerIndex].accent }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/5 -z-10"></div>
          
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 transition-colors duration-500">
            <span style={{ color: bannerSlides[currentBannerIndex].accent }}>
              {bannerSlides[currentBannerIndex].title}
            </span>
          </h2>
          <div className="w-16 h-1 mb-6" style={{ backgroundColor: bannerSlides[currentBannerIndex].accent }}></div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {bannerSlides[currentBannerIndex].description}
          </p>
          <motion.button 
            whileHover={{ x: 5 }}
            className="inline-flex items-center border-b-2 pb-1 font-medium transition-all"
            style={{ 
              borderColor: bannerSlides[currentBannerIndex].accent,
              color: bannerSlides[currentBannerIndex].accent
            }}
          >
            VIEW MORE
            <FiArrowRight className="ml-2" />
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  </div>
</section>
      </div>

      {/* New Arrivals Section - with proper spacing to fix overlap */}
      <div className="relative h-[600px] w-full overflow-hidden mb-16 group">
        <motion.div 
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <img
            src={Hero2}
            alt="New Arrivals"
            className="w-full h-full object-cover transition-transform duration-10000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold mb-8 relative"
          >
            <span className="tracking-widest">NEW ARRIVALS</span>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 left-0 h-1 bg-[#D4AF37]"
            />
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShopNowClick}
            className="bg-transparent text-white hover:bg-white hover:text-black px-8 py-3 border border-white hover:border-[#D4AF37] rounded-sm transition-all duration-300 text-lg font-medium group"
          >
            <span className="flex items-center">
              SHOP NOW
              <FiArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-8 left-8 md:left-16 w-20 h-20 border-l-2 border-t-2 border-[#D4AF37]/30"></div>
        <div className="absolute bottom-8 right-8 md:right-16 w-20 h-20 border-r-2 border-b-2 border-[#D4AF37]/30"></div>
      </div>
      
      <TrendingCarousel />
      
      {/* Floating badge */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 3,
            scale: {
              type: "spring",
              stiffness: 100
            }
          }}
          whileHover={{ scale: 1.05 }}
          className="w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] flex items-center justify-center group">
            <RiStarFill className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;