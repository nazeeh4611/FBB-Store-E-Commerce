import React, { useState, useEffect } from "react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';

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


interface Category{
  name:string,
  image:string,
  _id:string
}
const Hero = ({ onShopNowClick = () => {} }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories,setCategories] = useState<Category[]>([])
  const navigate = useNavigate()
  const api = axios.create({
    baseURL:baseurl
  })
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getCategory = async()=>{
    try {
        const response = await api.get("/get-category")
        console.log(response.data,"may here")
        setCategories(response.data)
    } catch (error) {
        console.error(error)
    }
  }


  const handlecategoryClick = (categoryId:string)=>{
    navigate(`/category/${categoryId}`)

  }
  
  useEffect(()=>{
    getCategory()
  },[])



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
  }, []);


  return (
    <div className="relative">
      {/* Hero Section with Slider */}
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.heading}
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 min-h-[80px]">
              <span>{text}</span>
              <Cursor cursorColor='white' />
            </h1>

            <button
              onClick={onShopNowClick}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 active:bg-gray-200"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>


        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Select Category</h2>
            <p className="mt-2 text-gray-600">Choose from our premium collection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-96"  onClick={()=>handlecategoryClick(category._id)}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-opacity hover:opacity-0" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600"> Products</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-16">
            <button 
              className="group relative overflow-hidden bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300"
            >
              <span className="relative z-10">View More Categories</span>
              <div className="absolute inset-0 bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>

          {/* Banner Section */}
          <section className="container mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-12 lg:space-x-16 relative">
              <div className="w-full md:w-1/2 relative h-[600px]">
                <div className="overflow-hidden rounded-lg shadow-lg h-full">
                  {bannerSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        currentBannerIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 mt-8 md:mt-0">
                <div className="transition-all duration-500 transform">
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                    <span style={{ color: bannerSlides[currentBannerIndex].accent }}>
                      {bannerSlides[currentBannerIndex].title}
                    </span>
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {bannerSlides[currentBannerIndex].description}
                  </p>
                  <button 
                    className="inline-flex items-center border-b-2 border-black pb-1 font-medium transition-all hover:border-[#8B4513] hover:text-[#8B4513]"
                    style={{ borderColor: bannerSlides[currentBannerIndex].accent }}
                  >
                    VIEW MORE
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="relative h-[600px] w-full overflow-hidden mb-16">
          <div className="absolute inset-0">
            <img
              src={Hero2}
              alt="New Arrivals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">NEW ARRIVALS</h2>
            <button
              onClick={onShopNowClick}
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 text-lg font-medium"
            >
              SHOP NOW
            </button>
          </div>
        </div>
        {/* Trending Carousel */}
        <TrendingCarousel />

        {/* Brand Logos Section */}
        
      </div>
    );
  };

  export default Hero;
  