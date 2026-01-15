import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import background from '../assets/background.png'
import Footer from '../components/Footer'

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-[#023F23] px-6 md:px-12 py-4 flex flex-wrap items-center gap-10 shadow-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SmartAgro Logo" className="h-10 w-auto" />
          <span className="text-yellow-400 font-bold text-2xl tracking-wide">SMARTAGRO</span>
        </div>

        <nav className="flex gap-10 items-center text-sm md:text-base font-medium text-white">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
            HOME
          </Link>
          <Link to="/mar-prices" className="text-white hover:text-yellow-400 transition-colors">
            MARKET PRICES
          </Link>
          <Link to="/ai-prediction" className="text-white hover:text-yellow-400 transition-colors">
            AI PREDICTION
          </Link>
          <Link to="/about" className="text-yellow-400">
            ABOUT
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="px-4 py-10 md:px-14 md:py-16"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-[#024229]/90 rounded-3xl shadow-2xl text-white p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">About SmartAgro</h1>
          
          {/* Mission Section */}
          <div className="bg-white/10 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-400">Our Mission</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Helping Sri Lankan farmers earn fair profit using AI.
            </p>
          </div>

          {/* Problem Section */}
          <div className="bg-white/10 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-400">The Problem</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">👥</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Middlemen</h3>
                  <p className="text-lg opacity-90">
                    Farmers often lose significant portions of their profits to intermediaries who control the supply chain, leaving farmers with minimal returns for their hard work.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">📉</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Unstable Prices</h3>
                  <p className="text-lg opacity-90">
                    Market prices fluctuate unpredictably, making it difficult for farmers to plan their crops and maximize their earnings. Without accurate price forecasts, farmers face financial uncertainty.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="bg-white/10 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-yellow-400">Our Solution</h2>
            <div className="space-y-4">
              <p className="text-lg md:text-xl leading-relaxed mb-4">
                AI-powered decision support system that empowers farmers with:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/20">
                  <div className="text-3xl mb-3">🤖</div>
                  <h3 className="text-xl font-semibold mb-2">AI Price Prediction</h3>
                  <p className="opacity-90">
                    Forecast wholesale and retail prices for the next 30 and 90 days, helping farmers make informed decisions about when to sell their produce.
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/20">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
                  <p className="opacity-90">
                    Real-time market price comparisons across different locations (Pettah, Dambulla) to help farmers find the best markets for their crops.
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/20">
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-xl font-semibold mb-2">Crop Recommendation</h3>
                  <p className="opacity-90">
                    AI-powered crop recommendations based on soil conditions (N, P, K levels), weather data, and market demand to maximize profitability.
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/20">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="text-xl font-semibold mb-2">Demand Forecasting</h3>
                  <p className="opacity-90">
                    Predict demand levels (High, Medium, Low) for different vegetables, enabling farmers to plan their cultivation accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>

 
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default About
