import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../../Constant/Base';

interface Product {
  _id: string;
  name: string;
  brand: string;
  priceINR: number;
  priceAED: number;
  images: string[];
  trending: boolean;
  categoryId: string;
  subCategoryId: string;
  active: boolean;
}

export default function TrendingCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [position, setPosition] = useState(0);
  const itemWidth = 25;
  const navigate = useNavigate();
  const api = axios.create({
    baseURL:baseurl
  })

  useEffect(() => {
    // Fetch products from your API
    const fetchProducts = async () => {
      try {
        const response = await api.get("/get-product");
        const data = await response.data;
        // Filter only trending products
        const trendingProducts = data.filter((product: Product) => product.trending);
        setProducts(trendingProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const newPosition = prev - itemWidth;
        if (Math.abs(newPosition) >= (products.length * itemWidth)) {
          return 0;
        }
        return newPosition;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

  // Double the products array for infinite scroll effect
  const displayProducts = [...products, ...products];

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };


  return (
    <section className="w-full py-16 px-4 md:px-6 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">TRENDING</h2>
        <p className="text-gray-600">
          The World's Premium Brands In One Destination.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-1000 ease-linear"
            style={{ transform: `translateX(${position}%)` }}
          >
            {displayProducts.map((product, index) => (
              <div 
                key={`${product._id}-${index}`} 
                className="w-1/4 flex-shrink-0 px-4 cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
            <div className="flex flex-col group cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden bg-white">
              <div className="relative w-full pt-[100%]"> 
                {product.images && Object.values(product.images).length > 0 && (
                  <img 
                    src={Object.values(product.images)[0]} 
                    alt={`${product.name} 1`}
                    className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              
              <div className="p-4 bg-white">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-gray-800 mb-2 truncate">
                  {product.name}
                </h3>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.priceINR}
                  </span>
                  <span className="text-sm text-gray-500">
                    / AED {product.priceAED}
                  </span>
                </div>
              </div>
            </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}