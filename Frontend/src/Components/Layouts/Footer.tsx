import { Button } from "./button"
import { Input } from "./Input"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  PinIcon as Pinterest,
  Truck,
  Headphones,
  ShieldCheck,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      {/* Features Banner */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Truck className="w-12 h-12" />
          <div>
            <h3 className="font-bold">FAST AND FREE DELIVERY</h3>
            <p className="text-sm text-gray-400">Free delivery for all orders over $140</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Headphones className="w-12 h-12" />
          <div>
            <h3 className="font-bold">24/7 CUSTOMER SUPPORT</h3>
            <p className="text-sm text-gray-400">Friendly 24/7 customer support</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-12 h-12" />
          <div>
            <h3 className="font-bold">MONEY BACK GUARANTEE</h3>
            <p className="text-sm text-gray-400">We return money within 30 days</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="text-2xl font-bold">UOMO</div>
            <div className="space-y-2">
              <p>1418 River Drive, Suite 35 Cottonhall,</p>
              <p>CA 9622 United States</p>
              <p>sale@uomo.com</p>
              <p>+1 246-345-0695</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Pinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">COMPANY</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Affiliates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">SHOP</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Men
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Women
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-colors">
                  Shop All
                </a>
              </li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div>
            <h3 className="text-lg font-bold mb-6">SUBSCRIBE</h3>
            <p className="mb-4">Be the first to get the latest news about trends, promotions, and much more!</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border-gray-700 focus:border-gray-500"
              />
              <Button variant="outline" className="whitespace-nowrap border-gray-700 hover:bg-gray-800">
                JOIN
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">©2024 Uomo</p>
            <div className="flex gap-8">
              <div className="relative group">
                <button className="text-sm flex items-center gap-2">
                  Language
                  <span className="text-gray-400">United Kingdom | English</span>
                </button>
              </div>
              <div className="relative group">
                <button className="text-sm flex items-center gap-2">
                  Currency
                  <span className="text-gray-400">$ USD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

