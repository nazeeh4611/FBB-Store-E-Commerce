import { useState, useEffect, useRef } from "react"
import { Button } from "../Layouts/button"
import { ChevronLeft, ChevronRight, Heart, Share2, Maximize2, ShoppingBag, Truck, Shield, Calendar, Award } from "lucide-react"
import { cn } from "../../lib/util"
import { useParams } from "react-router-dom"
import axios from "axios"
import { baseurl } from "../../Constant/Base"
import NavBar from "../Layouts/Navbar"
import Footer from "../Layouts/Footer"
import { motion, AnimatePresence } from "framer-motion"

interface ProductImages {
  image1: string
  image2: string
  image3: string
  image4: string
}

interface ProductData {
  _id: string
  name: string
  brand: string
  priceINR: number
  priceAED: number
  subCategoryId: Category
  active: boolean
  images: ProductImages
  createdAt: string
  updatedAt: string
}

interface Category {
  name: string,
  _id: string,
}

interface RelatedProduct {
  _id: string
  name: string
  brand: string
  priceINR: number
  priceAED: number
  images: ProductImages
  category: string
}

interface ImageMagnifierProps {
  images: string[]
  currentImage: number
  productName: string
}

const ImageMagnifier = ({ images, currentImage, productName }: ImageMagnifierProps) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / dimensions.width) * 100;
    const y = ((e.clientY - top) / dimensions.height) * 100;

    setPosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-white"
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={images[currentImage] || "/placeholder.svg"}
        alt={productName}
        className="w-full h-full object-cover"
      />

      {showZoom && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/5" />
          <div
            className="absolute w-32 h-32 border-2 border-white rounded-full overflow-hidden shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${Math.min(Math.max(position.x, 16), 84)}%`,
              top: `${Math.min(Math.max(position.y, 16), 84)}%`,
            }}
          >
      <div
  className="absolute w-[1600%] h-[1600%]" // Extreme Zoom Factor
  style={{
    transform: `translate(-${position.x * 16}%, -${position.y * 16}%)`, // Ultra Precise
    transformOrigin: 'top left',
  }}
>


              <img
                src={images[currentImage] || "/placeholder.svg"}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RelatedProductCard = ({ product }: { product: RelatedProduct }) => {
  const productImage = Object.values(product.images).find(Boolean) || "/placeholder.svg"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="group relative bg-white rounded-lg overflow-hidden"
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={productImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          <a href={`/product/${product._id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.brand} {product.name}
          </a>
        </h3>
        <div>
          <p className="text-sm font-medium text-gray-900">₹{product.priceINR.toLocaleString()}</p>
          <p className="text-xs text-gray-500">AED {product.priceAED.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProductPage() {
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [region, setRegion] = useState<'IN' | 'AE'>('IN')
  const { id } = useParams<{ id: string }>()

  const PHONE_NUMBERS = {
    IN: '9207904611',
    AE: '971501234567'
  }

  const api = axios.create({
    baseURL: baseurl,
  })

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('Asia/Dubai') || timezone.includes('Asia/Muscat')) {
      setRegion('AE')
    }
  }, [])

  const getDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/get-product/${id}`)
      setProductData(response.data)
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRelated = async () => {
    try {
      const category = productData?.subCategoryId?._id
      const response = await api.get(`/get-related/${category}`)
      setRelatedProducts(response.data)
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  useEffect(() => {
    if (id) {
      getDetails()
    }
  }, [id])

  useEffect(() => {
    if (productData?.subCategoryId?._id) {
      getRelated()
    }
  }, [productData])

  const handleEnquiry = () => {
    if (productData) {
      const phoneNumber = PHONE_NUMBERS[region]
      const productUrl = window.location.href
      
      const priceDisplay = region === 'AE' 
        ? `AED ${productData.priceAED.toLocaleString()}`
        : `₹${productData.priceINR.toLocaleString()}`

      const message = encodeURIComponent(`
🛍️ *Check out this product!*

*${productData.brand} ${productData.name}*

💰 *Price:* ${priceDisplay}
🏷️ *Brand:* ${productData.brand}
📦 *Category:* ${productData.subCategoryId.name}

🔍 *View Product:*
${productUrl}

I'm interested in this product. Could you please provide more information?`)

      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    }
  }

  const handleShare = async () => {
    if (productData) {
      try {
        const shareData = {
          title: `${productData.brand} ${productData.name}`,
          text: `Check out ${productData.brand} ${productData.name} - ₹${productData.priceINR.toLocaleString()}`,
          url: window.location.href
        }
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
        navigator.clipboard.writeText(window.location.href)
        showToastMessage("Link copied to clipboard!")
      }
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showToastMessage(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading product details...</p>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.href = '/shop'}
          >
            Return to Shop
          </Button>
        </div>
      </div>
    )
  }

  const productImages = Object.values(productData.images).filter(Boolean)

  const RegionToggle = () => (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => setRegion('IN')}
        className={cn(
          "px-3 py-1 rounded-full text-sm transition-all",
          region === 'IN' 
            ? "bg-black text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        India
      </button>
      <button
        onClick={() => setRegion('AE')}
        className={cn(
          "px-3 py-1 rounded-full text-sm transition-all",
          region === 'AE' 
            ? "bg-black text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        Dubai
      </button>
    </div>
  )

  const PriceDisplay = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="space-y-1"
    >
      {region === 'AE' ? (
        <>
          <div className="text-2xl sm:text-3xl font-bold text-black">
            AED {Number(productData?.priceAED).toLocaleString()}
          </div>
          <div className="text-base text-gray-600">
            ₹{Number(productData?.priceINR).toLocaleString()}
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl sm:text-3xl font-bold text-black">
            ₹{Number(productData?.priceINR).toLocaleString()}
          </div>
          <div className="text-base text-gray-600">
            AED {Number(productData?.priceAED).toLocaleString()}
          </div>
        </>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar isTransparent={false} />
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-6 lg:gap-8"
        >
          <div className="w-full lg:w-[500px] mx-auto">
            <div className="relative group mb-4">
              <ImageMagnifier 
                images={productImages}
                currentImage={currentImage}
                productName={`${productData.brand} ${productData.name}`}
              />
              
              {productImages.length > 1 && (
                <>
               <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentImage((prev) => (prev + 1) % productImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="w-full grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "w-full transition-all rounded-md overflow-hidden hover:shadow-md",
                    currentImage === index 
                      ? "ring-2 ring-black ring-offset-2" 
                      : "ring-1 ring-gray-200"
                  )}
                >
                  <div className="w-full aspect-square relative">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-2"
            >
              <nav className="flex text-sm text-gray-500 space-x-2">
                <a href="/" className="hover:text-black">HOME</a>
                <span>/</span>
                <a href="/shop" className="hover:text-black">SHOP</a>
                <span>/</span>
                <a href={`/category/${productData.subCategoryId._id}`} className="hover:text-black">
                  {productData.subCategoryId.name.toUpperCase()}
                </a>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="text-gray-700">{productData.brand}</span> {productData.name}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">8k+ reviews</span>
            </motion.div>

            <PriceDisplay />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-4 pt-4"
            >
              <RegionToggle />
              <Button
                variant="outline"
                className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center gap-2 text-sm h-12 rounded-full"
                onClick={handleEnquiry}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ENQUIRE VIA WHATSAPP
              </Button>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full flex justify-center items-center gap-2 text-sm border-gray-300 hover:bg-gray-50 transition-all h-12 rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    SHARE
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full flex justify-center items-center gap-2 text-sm h-12 rounded-full transition-all",
                      isWishlisted
                        ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                        : "border-gray-300 hover:bg-gray-50"
                    )}
                    onClick={toggleWishlist}
                  >
                    <Heart className={cn("h-4 w-4", isWishlisted ? "fill-red-500" : "")} />
                    {isWishlisted ? "WISHLISTED" : "WISHLIST"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 pt-6 border-t"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-gray-700" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-gray-500">On orders over ₹5000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-gray-700" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">1 Year Warranty</p>
                  <p className="text-gray-500">100% Genuine Products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-gray-700" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-gray-500">30 Days Return Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Award className="h-5 w-5 text-gray-700" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Premium Quality</p>
                  <p className="text-gray-500">Exclusive Collection</p>
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="space-y-3 pt-6 border-t"
            >
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">CATEGORY:</span>
                <span className="text-gray-600">{productData.subCategoryId.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">BRAND:</span>
                <span className="text-gray-600">{productData.brand}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">SKU:</span>
                <span className="text-gray-600">{productData._id.substring(0, 8).toUpperCase()}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-24"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              <a href="/shop" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                View All <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((product) => (
                <RelatedProductCard key={product._id} product={product} />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
 )
}