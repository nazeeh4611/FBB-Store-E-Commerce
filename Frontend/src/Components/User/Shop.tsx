import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import tshirt from "../Layouts/Img/tshirt.jpeg"
import Footer from "../Layouts/Footer"
import NavBar from "../Layouts/Navbar"
import { Button } from "../Layouts/button"
import { baseurl } from "../../Constant/Base"
import axios from "axios"

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: Category | string;
  priceINR: number;
  priceAED: number;
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: 'LISTED' | 'UNLISTED';
  rating?: number;
  reviews?: number;
  originalPrice?: number;
  active: boolean;
  __v: number;
}

export default function ShopLayout() {
  const navigate = useNavigate()
  const api = axios.create({
    baseURL: baseurl,
  });

  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})
  const [visibleProducts, setVisibleProducts] = useState(6)
  const [productsPerRow, setProductsPerRow] = useState(3)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const toggleFavorite = (productName: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productName]: !prev[productName],
    }))
  }

  const handleShowMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 6, allProducts.length))
  }

  const handleViewChange = (columns: number) => {
    setProductsPerRow(columns)
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const getCategories = async () => {
    try {
      const response = await api.get("/get-category")
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getProducts = async () => {
    try {
      const response = await api.get("/get-product")
      if (response.data && Array.isArray(response.data)) {
        setAllProducts(response.data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  useEffect(() => {
    getProducts()
    getCategories()
  }, [])

  const products = allProducts.slice(0, visibleProducts)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar isTransparent={false} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-24">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900">
            YOU MIGHT LIKE
          </h2>
          <div className="flex justify-center gap-8 overflow-x-auto pb-6">
            {categories.map((category) => (
              <div key={category._id} className="flex flex-col items-center">
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-full shadow-md transition-transform hover:scale-105">
                  <img
                    src={category.image || tshirt}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-2">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">HOME</a>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-900">THE SHOP</span>
          </div>
          <div className="flex items-center gap-6">
            <select className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none">
              <option>DEFAULT SORTING</option>
            </select>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">VIEW</span>
              {[2, 3, 4].map((num) => (
                <button 
                  key={num} 
                  className={`px-3 text-sm font-medium transition-colors ${
                    productsPerRow === num 
                      ? 'text-gray-900 underline' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => handleViewChange(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              FILTER
            </button>
          </div>
        </div>

        <div 
          className={`grid gap-x-8 gap-y-12 ${
            productsPerRow === 2 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : productsPerRow === 3 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {products.map((product) => (
            <div key={product._id} className="group relative flex flex-col">
              <div 
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all hover:shadow-md cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <img
                  src={product.images.image1 || tshirt}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.brand && (
                  <div className="absolute left-4 top-4 z-10 rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white">
                    {product.brand}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.name);
                  }}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
                  aria-label={favorites[product.name] ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`h-5 w-5 ${favorites[product.name] ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>
              <div className="mt-6 flex flex-col">
                <p className="text-sm font-medium text-gray-500">
                  {typeof product.category === 'object' ? product.category.name : 'Unknown Category'}
                </p>
                <h3 className="mt-2 text-base font-semibold text-gray-900">{product.name}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-lg font-bold text-gray-900">₹{product.priceINR}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">AED {product.originalPrice}</p>
                  )}
                </div>
                {product.rating && (
                  <div className="mt-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                      >
                        ★
                      </span>
                    ))}
                    {product.reviews && (
                      <span className="ml-2 text-sm text-gray-500">{product.reviews}+ reviews</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {visibleProducts < allProducts.length && (
          <div className="mt-16 flex justify-center pb-16">
            <Button
              onClick={handleShowMore}
              className="rounded-full bg-gray-900 px-8 py-6 text-base font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Show More Products
            </Button>
          </div>
        )}
      </div>

      <br />
      <br />
      <Footer />
    </div>
  )
}