import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import background from '../assets/background.png'
import Footer from '../components/Footer'
import { getPricePrediction } from '../utils/api'

function AiPrediction() {
  const [activeTab, setActiveTab] = useState('price') // 'price' | 'market' | 'crop'
  const [date, setDate] = useState('') // YYYY-MM-DD
  const vegOptions = ['Beans', 'Tomato', 'Brinjal', 'Carrot', 'Cabbage']
  const [selectedVegetables, setSelectedVegetables] = useState([])
  const [priceText, setPriceText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleVegetable(veg) {
    setSelectedVegetables((prev) =>
      prev.includes(veg) ? prev.filter((v) => v !== veg) : [...prev, veg]
    )
  }

  async function handleShowPrice() {
    if (!date) {
      setPriceText('Select a date first')
      setError('')
      return
    }
    if (selectedVegetables.length === 0) {
      setPriceText('Select one or more vegetables')
      setError('')
      return
    }

    setLoading(true)
    setError('')
    setPriceText('')

    try {
      const response = await getPricePrediction(date, selectedVegetables)
      
      // Handle the response from backend
      if (response.error) {
        setError(response.error)
        setPriceText('')
      } else if (response.prices) {
        // Backend returns structured prices
        const items = Object.entries(response.prices).map(
          ([veg, price]) => `${veg}: Rs ${price}`
        )
        const total = response.total || Object.values(response.prices).reduce((sum, price) => sum + price, 0)
        setPriceText(`${items.join(', ')}  |  Total: Rs ${total.toFixed(2)}`)
        setError('')
      } else if (response.prediction) {
        // If backend returns prediction data
        setPriceText(response.prediction)
        setError('')
      } else {
        // Fallback: display the response
        setPriceText(JSON.stringify(response))
        setError('')
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch price prediction. Please check if the backend is running at http://localhost:5000'
      setError(errorMessage)
      setPriceText('')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#023F23] px-6 md:px-12 py-4 flex flex-wrap items-center gap-10 shadow-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SmartAgro Logo" className="h-10 w-auto" />
          <span className="text-yellow-400 font-bold text-2xl tracking-wide">SMARTAGRO</span>
        </div>

        <nav className="flex gap-10 items-center text-sm md:text-base font-medium text-white">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
            HOME
          </Link>
          <Link to="/mar-prices" className="hover:text-yellow-400 transition-colors">
            MARKET PRICES
          </Link>
          <a href="#" className="text-yellow-400 transition-colors">
            AI PREDICTION
          </a>
          <a href="#" className="hover:text-yellow-400 transition-colors">
            PRODUCT
          </a>
        </nav>
      </header>

      {/* Main section */}
      <section
        className="px-4 py-10 md:px-14 md:py-16"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-[#024229]/90 rounded-3xl shadow-2xl text-white p-6 md:p-10 flex flex-col gap-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
            Today’s Market Prices – Pettah, Dambulla, Narahenpita
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="bg-[#035d35] rounded-3xl p-6 w-full lg:w-64 space-y-6 shadow-xl">
              <button
                onClick={() => setActiveTab('price')}
                className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'price' ? 'bg-[#06603f] text-[#F4C430]' : 'text-white/90 hover:text-white'
                }`}
              >
                Price Prediction
              </button>
              <button
                onClick={() => setActiveTab('market')}
                className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'market' ? 'bg-[#06603f] text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                Market rec
              </button>
              <button
                onClick={() => setActiveTab('crop')}
                className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'crop' ? 'bg-[#06603f] text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                Crop Rec
              </button>
            </aside>

            <div className="flex-1">
              {activeTab === 'price' ? (
                <div className="bg-white rounded-2xl min-h-[200px] border border-gray-200 shadow-xl p-6 md:p-8 text-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700 font-medium">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border px-3 py-1 rounded-md text-sm bg-white"
                      />
                      <span className="text-gray-400 ml-1">▼</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700 font-medium">Vegetables</label>
                      <div className="flex gap-2 bg-gray-50 text-gray-700 rounded-md px-2 py-1">
                        {vegOptions.map((v) => (
                          <label key={v} className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedVegetables.includes(v)}
                              onChange={() => toggleVegetable(v)}
                              className="w-4 h-4"
                            />
                            <span>{v}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-center md:gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 font-medium mb-2">Price (Rs):</label>
                      <input
                        type="text"
                        readOnly
                        value={priceText}
                        placeholder={selectedVegetables.length === 0 || !date ? 'Select date & vegetables to see prices' : loading ? 'Loading...' : 'Click "Show Price"'}
                        className={`w-full max-w-2xl border rounded-md px-3 py-2 focus:outline-none bg-white ${error ? 'border-red-500' : ''}`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                      )}
                    </div>

                    <div className="mt-3 md:mt-0">
                      <button
                        onClick={handleShowPrice}
                        disabled={loading}
                        className={`bg-[#06603f] text-white px-4 py-2 rounded-md font-medium hover:bg-[#054f33] transition-colors ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Loading...' : 'Show Price'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl min-h-[200px] border border-gray-200 shadow-xl p-6 md:p-8 flex items-center justify-center text-gray-600">
                  {activeTab === 'market' ? 'Market recommendations will appear here.' : 'Crop recommendations will appear here.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default AiPrediction