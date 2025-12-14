import React from 'react'
import { Link } from 'react-router-dom'
import headbanner from '../assets/Headbanner.png'
import logo from '../assets/logo.png'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-[#023F23] px-8 py-4 flex items-center gap-20 shadow-md">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="SmartAgro Logo" className="h-10 w-auto" />
          <span className="text-yellow-400 font-bold text-2xl tracking-wide">SMARTAGRO</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-12 items-center">
          <Link to="/" className="text-yellow-400 hover:text-white transition-colors font-medium">HOME</Link>
          <Link to="/mar-prices" className="text-white hover:text-yellow-400 transition-colors font-medium">MARKET PRICES</Link>
          <Link to="/ai-prediction" className="text-white hover:text-yellow-400 transition-colors font-medium">AI PREDICTION</Link>
          <a href="#" className="text-white hover:text-yellow-400 transition-colors font-medium">PRODUCT</a>
        </nav>
      </header>

      {/* Banner Image with Overlay Button */}
      <div className="relative w-full">
        <img 
          src={headbanner} 
          alt="SmartAgro Banner" 
          className="w-full h-auto object-cover"
        />
        {/* GET STARTED Button Overlay */}
        <div className="absolute bottom-10 left-40 md:bottom-40 md:left-40">
          <button className="bg-white hover:bg-gray-50 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors border-2 border-gray-300 shadow-lg">
            GET STARTED
          </button>
        </div>
      </div>

      {/* Price Banner */}
      <section className="bg-[#006838]  py-4 overflow-hidden">
        <div className="flex items-center animate-scroll">
          {/* First set of content */}
          <div className="flex items-center gap-4 flex-shrink-0 px-8">
            {/* Bar Chart Icon */}
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            
            {/* Price Text */}
            <span className="text-white text-lg font-medium whitespace-nowrap">
              Tomato Price Today: <span className="font-semibold">Rs 120/kg</span>
            </span>

            {/* Price Change Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white font-semibold">+6%</span>
            </div>
          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-4 flex-shrink-0 px-8">
            {/* Bar Chart Icon */}
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            
            {/* Price Text */}
            <span className="text-white text-lg font-medium whitespace-nowrap">
              Tomato Price Today: <span className="font-semibold">Rs 120/kg</span>
            </span>

            {/* Price Change Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white font-semibold">+6%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Cards Section */}
      <section className="bg-white px-8 py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Crop Recommendation */}
          <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80)'
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-gray-900 text-xl font-bold text-center drop-shadow-lg">Crop Recommendation</h3>
            </div>
          </div>

          {/* Card 2 - Price Prediction */}
          <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold text-center">Price Prediction</h3>
            </div>
          </div>

          {/* Card 3 - Demand Forecasting */}
          <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold text-center">Demand Forecasting</h3>
            </div>
          </div>

          {/* Card 4 - Market Recommendation */}
          <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white text-xl font-bold text-center">Market Recommendation</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
