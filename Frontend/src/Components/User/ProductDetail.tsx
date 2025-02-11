import { useState, useEffect, useRef } from "react"
import { Button } from "../Layouts/button"
import { ChevronLeft, ChevronRight, Heart, Share2, Maximize2 } from "lucide-react"
import { cn } from "../../lib/util"
import { useParams } from "react-router-dom"
import axios from "axios"
import { baseurl } from "../../Constant/Base"
import NavBar from "../Layouts/Navbar"
import Footer from "../Layouts/Footer"

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

interface ZoomPosition {
  x: number
  y: number
}

export default function ProductPage() {
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState<ZoomPosition>({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const { id } = useParams<{ id: string }>()

  const api = axios.create({
    baseURL: baseurl,
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = ((event.clientX - left) / width) * 100
    const y = ((event.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const getDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/get-product/${id}`)
      console.log(response.data,"dsrtdstsdfstdst")
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

  useEffect(() => {
    if (!productData || !productData.images) return

    const productImages = Object.values(productData.images).filter(Boolean)
    if (productImages.length <= 1) return

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % productImages.length)
    },10000)

    return () => clearInterval(timer)
  }, [productData])

  const handleEnquiry = () => {
    if (productData) {
      const productUrl = window.location.href
      const message = encodeURIComponent(`
🛍️ *Check out this product!*

*${productData.brand} ${productData.name}*

💰 *Price Details:*
• INR: ₹${productData.priceINR.toLocaleString()}
• AED: ${productData.priceAED.toLocaleString()}

🏷️ *Brand:* ${productData.brand}
📦 *Category:* ${productData.subCategoryId.name}

🔍 *View Product:*
${productUrl}

I'm interested in this product. Could you please provide more information?`)

      window.open(`https://wa.me/9207904611?text=${message}`, "_blank")
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
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!productData) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>
  }

  const productImages = Object.values(productData.images).filter(Boolean)

  const ImageMagnifier = () => {
    return (
      <div 
        className="relative w-full aspect-[3/4] rounded-lg overflow-hidden cursor-crosshair"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        ref={imageRef}
      >
        <img
          src={productImages[currentImage] || "/placeholder.svg"}
          alt={`${productData.brand} ${productData.name}`}
          className="w-full h-full object-cover"
        />
        {isZooming && (
          <>
            {/* Dimmed overlay */}
            <div className="absolute inset-0 bg-black/10" />
            
            {/* Zoomed view */}
            <div 
              className="absolute w-[200px] h-[200px] border-2 border-white rounded-full overflow-hidden shadow-lg pointer-events-none"
              style={{
                left: `${Math.min(Math.max(zoomPosition.x - 12.5, 0), 75)}%`,
                top: `${Math.min(Math.max(zoomPosition.y - 12.5, 0), 75)}%`,
              }}
            >
              <div
                className="absolute w-[400%] h-[400%]"
                style={{
                  left: `${-zoomPosition.x * 4 + 200}%`,
                  top: `${-zoomPosition.y * 4 + 200}%`,
                }}
              >
                <img
                  src={productImages[currentImage] || "/placeholder.svg"}
                  alt={`${productData.brand} ${productData.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  const RelatedProductCard = ({ product }: { product: RelatedProduct }) => {
    const productImage = Object.values(product.images).find(Boolean) || "/placeholder.svg"
    
    return (
      <div className="group relative">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-gray-900">
            <a href={`/product/${product._id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.brand} {product.name}
            </a>
          </h3>
          <div>
            <p className="text-sm font-medium text-gray-900">₹{product.priceINR.toLocaleString()}</p>
            <p className="text-sm text-gray-500">AED {product.priceAED.toLocaleString()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar isTransparent={false} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 lg:mt-32 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Image and Thumbnails Container */}
          <div className="w-full lg:w-[500px] mx-auto">
            <div className="relative group mb-4">
              <ImageMagnifier />
              
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev + 1) % productImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="w-full grid grid-cols-4 gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "w-full border-2 transition-all rounded-md overflow-hidden hover:shadow-md",
                    currentImage === index ? "border-black" : "border-transparent"
                  )}
                >
                  <div className="w-full aspect-square relative">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <nav className="flex text-sm text-gray-500 space-x-2">
                <a href="/" className="hover:text-black">HOME</a>
                <span>/</span>
                <a href="/shop" className="hover:text-black">SHOP</a>
              </nav>
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="font-medium">{productData.brand}</span> {productData.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">8k+ reviews</span>
            </div>

            <div className="space-y-1">
              <div className="text-lg sm:text-xl font-bold">
                <span className="font-bold">₹{Number(productData.priceINR).toLocaleString()}</span>
              </div>
              <div className="text-base text-gray-600">
                <span className="font-bold">AED {Number(productData.priceAED).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                onClick={handleEnquiry}
              >
              
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ENQUIRY ON WHATSAPP
                </Button>

<div className="flex flex-col sm:flex-row gap-3">
  <Button variant="outline" className="flex-1 flex justify-center gap-2 text-sm" onClick={handleShare}>
    <Share2 className="h-4 w-4" />
    SHARE
  </Button>
  <Button variant="outline" className="flex-1 flex justify-center gap-2 text-sm">
    <Heart className="h-4 w-4" />
    WISHLIST
  </Button>
</div>
</div>

<div className="space-y-2 pt-4 border-t">
<div className="flex gap-2">
  <span className="font-semibold">CATEGORY:</span>
  <span className="text-gray-600">{productData.subCategoryId.name}</span>
</div>
</div>
</div>
</div>

{/* Related Products Section */}
{relatedProducts.length > 0 && (
<div className="mt-16">
<h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{relatedProducts.map((product) => (
  <RelatedProductCard key={product._id} product={product} />
))}
</div>
</div>
)}
</main>

<Footer />
</div>
)
}