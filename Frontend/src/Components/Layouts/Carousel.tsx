import React, { useState, useEffect } from 'react'
import watchsp from "../Layouts/Img/watchsp.jpg"
import tshortsp from "../Layouts/Img/tshortsp.jpg"
import shoesp from "../Layouts/Img/shoesp.jpeg"
import glasssp from "../Layouts/Img/glasssp.jpeg"
interface Product {
  id: number
  category: string
  name: string
  price: number
  image: string
}

const products: Product[] = [
  {
    id: 1,
    category: "Sunglass",
    name: "Police_55927_silver_blue",
    price: 1000,
    image: glasssp
  },
  {
    id: 2,
    category: "Shoes",
    name: "Jordan Why Not ZER0 5 Bloodline",
    price: 1750,
    image: shoesp
  },
  {
    id: 3,
    category: "Watches",
    name: "Fossi_l Fs2424 Multifort",
    price: 2249,
    image: watchsp
  },
  {
    id: 4,
    category: "Tshirts",
    name: "Gucci_Maroon_Crochet",
    price: 620,
    image: tshortsp
  },
  {
    id: 5,
    category: "Sunglass",
    name: "Police_55927_silver_blue",
    price: 1000,
    image: glasssp
  },
  {
    id: 6,
    category: "Shoes",
    name: "Jordan Why Not ZER0 5 Bloodline",
    price: 1750,
    image: shoesp
  }
]

export default function TrendingCarousel() {
  const [position, setPosition] = useState(0)
  const itemWidth = 25 // Each item takes 25% of container width

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        const newPosition = prev - itemWidth
        // Reset position when all items have scrolled
        if (Math.abs(newPosition) >= (products.length * itemWidth)) {
          return 0
        }
        return newPosition
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Create a duplicated array for infinite scroll effect
  const displayProducts = [...products, ...products]

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
                key={`${product.id}-${index}`} 
                className="w-1/4 flex-shrink-0 px-4"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gray-50 w-full aspect-square mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain p-8"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm text-gray-600">
                      {product.category}
                    </p>
                    <h3 className="font-medium">
                      {product.name}
                    </h3>
                    <p className="font-bold">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}