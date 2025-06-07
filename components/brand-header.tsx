import Link from "next/link"
import { BRAND_CONFIG } from "./brand-config"

export function BrandHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-3xl">{BRAND_CONFIG.logo}</span>
            <div>
              <h1 className="text-2xl font-bold brand-text">{BRAND_CONFIG.name}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">{BRAND_CONFIG.tagline}</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/quote" className="text-gray-700 hover:text-blue-600 font-medium">
              Get Quote
            </Link>
            <Link href="/claims" className="text-gray-700 hover:text-blue-600 font-medium">
              Claims
            </Link>
            <Link href="/calculator" className="text-gray-700 hover:text-blue-600 font-medium">
              Calculator
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="text-gray-700 hover:text-blue-600 font-medium">Login</button>
            </Link>
            <Link href="/register">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
