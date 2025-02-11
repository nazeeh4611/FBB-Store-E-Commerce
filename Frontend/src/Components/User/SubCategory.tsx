import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseurl } from "../../Constant/Base";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Layouts/Footer";
import NavBar from "../Layouts/Navbar";

interface Category {
  name: string;
  image: string;
  _id: string;
}

interface BannerSlide {
  title: string;
  image: string;
  description: string;
  accent: string;
}

const bannerSlides: BannerSlide[] = [
  {
    title: "Exclusive Offers",
    image: "/images/banner1.jpg",
    description: "Get the best deals on your favorite products.",
    accent: "#FF5733",
  },
  {
    title: "New Arrivals",
    image: "/images/banner2.jpg",
    description: "Check out our latest collections.",
    accent: "#3498DB",
  },
];

const Subcategory: React.FC = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { category } = useParams();

  const api = axios.create({
    baseURL: baseurl
  });

  const getCategory = async () => {
    if (!category) return;
    
    setIsLoading(true);
    try {
      const response = await api.get(`/get-subcategory/${category}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products/${category}/${categoryId}`);
  };

  useEffect(() => {
    getCategory();
  }, [category]); // Add category as dependency to re-fetch when it changes

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <NavBar isTransparent={false} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Select Category</h2>
            <p className="mt-2 text-gray-600">Choose from our premium collection</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Category Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                  <div 
                    className="relative h-96 cursor-pointer" 
                    onClick={() => handleCategoryClick(category._id)}
                  >
                    {/* Image wrapper with background color while loading */}
                    <div className="absolute inset-0 bg-gray-100">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/10 transition-opacity hover:opacity-0" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.name} Products</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View More Button */}
          <div className="flex justify-center mb-16">
            <button className="group relative overflow-hidden bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300">
              <span className="relative z-10">View More Categories</span>
              <div className="absolute inset-0 bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Subcategory;