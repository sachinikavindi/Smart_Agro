import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import background from '../assets/background.png'
import Footer from '../components/Footer'
import { getPricePrediction, getCropRecommendation } from '../utils/api'

function AiPrediction() {
  const [activeTab, setActiveTab] = useState('price') // 'price' | 'market' | 'crop'
  const [date, setDate] = useState('') // YYYY-MM-DD
  const vegOptions = ['bean', 'tomato', 'brinjal', 'carrot', 'cabbage']
  const [selectedVegetables, setSelectedVegetables] = useState([])
  const [priceText, setPriceText] = useState('')
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Crop recommendation states
  const [cropInputs, setCropInputs] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  })
  const [cropResult, setCropResult] = useState(null)
  const [cropLoading, setCropLoading] = useState(false)
  const [cropError, setCropError] = useState('')

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
    setPriceData(null)

    try {
      const response = await getPricePrediction(date, selectedVegetables)
      
      // Handle the response from backend
      if (response.error) {
        setError(response.error)
        setPriceText('')
        setPriceData(null)
      } else if (response.prices) {
        // Backend returns structured prices with all 4 price types
        setPriceData(response.prices)
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
      setPriceData(null)
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCropInputChange = (field, value) => {
    setCropInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  async function handleShowCrop() {
    // Validate all fields are filled
    const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    const missingFields = requiredFields.filter(field => !cropInputs[field] || cropInputs[field] === '')
    
    if (missingFields.length > 0) {
      setCropError(`Please fill in all fields: ${missingFields.join(', ')}`)
      setCropResult(null)
      return
    }

    setCropLoading(true)
    setCropError('')
    setCropResult(null)

    try {
      const response = await getCropRecommendation({
        N: parseFloat(cropInputs.N),
        P: parseFloat(cropInputs.P),
        K: parseFloat(cropInputs.K),
        temperature: parseFloat(cropInputs.temperature),
        humidity: parseFloat(cropInputs.humidity),
        ph: parseFloat(cropInputs.ph),
        rainfall: parseFloat(cropInputs.rainfall)
      })
      
      if (response.error) {
        setCropError(response.error)
        setCropResult(null)
      } else if (response.success) {
        setCropResult(response)
        setCropError('')
      }
    } catch (err) {
      setCropError(err.message || 'Failed to get crop recommendation. Please check if the backend is running.')
      setCropResult(null)
      console.error('Crop recommendation error:', err)
    } finally {
      setCropLoading(false)
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
          <Link to="/about" className="text-white hover:text-yellow-400 transition-colors">
            ABOUT
          </Link>
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
          AI Price Forecast for Next 30, and 90 Days and Best Cropt Recommendation
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
                onClick={() => setActiveTab('crop')}
                className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'crop' ? 'bg-[#06603f] text-[#F4C430]' : 'text-white/80 hover:text-white'
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

                  <div className="mt-6 md:mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Predicted Prices</h3>
                      <button
                        onClick={handleShowPrice}
                        disabled={loading}
                        className={`bg-[#06603f] text-white px-6 py-2 rounded-md font-medium hover:bg-[#054f33] transition-colors ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? 'Loading...' : 'Show Price'}
                      </button>
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                      </div>
                    )}

                    {loading ? (
                      <div className="text-center py-8 text-gray-600">Loading predictions...</div>
                    ) : priceData && Object.keys(priceData).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-[#E3D4D4]">
                              <th className="border border-gray-300 p-3 text-left">Vegetable</th>
                              <th colSpan={2} className="border border-gray-300 p-3 text-center bg-blue-50">Wholesale Prices (Rs/kg)</th>
                              <th colSpan={2} className="border border-gray-300 p-3 text-center bg-green-50">Retail Prices (Rs/kg)</th>
                            </tr>
                            <tr className="bg-[#CCBDBD]">
                              <th className="border border-gray-300 p-2 text-left">Vegetable</th>
                              <th className="border border-gray-300 p-2 text-center">Pettah</th>
                              <th className="border border-gray-300 p-2 text-center">Dambulla</th>
                              <th className="border border-gray-300 p-2 text-center">Pettah</th>
                              <th className="border border-gray-300 p-2 text-center">Dambulla</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(priceData).map(([vegetable, prices], index) => (
                              <tr key={vegetable} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 p-3 font-semibold capitalize">{vegetable}</td>
                                <td className="border border-gray-300 p-3 text-center">
                                  Rs {prices.wholesale_pettah?.toFixed(2) || '0.00'}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  Rs {prices.wholesale_dambulla?.toFixed(2) || '0.00'}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  Rs {prices.retail_pettah?.toFixed(2) || '0.00'}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  Rs {prices.retail_dambulla?.toFixed(2) || '0.00'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        {selectedVegetables.length === 0 || !date 
                          ? 'Select date & vegetables to see predicted prices' 
                          : 'Click "Show Price" to get predictions'}
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'crop' ? (
                <div className="bg-white rounded-2xl min-h-[200px] border border-gray-200 shadow-xl p-6 md:p-8 text-gray-800">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Crop Recommendation</h2>
                  <p className="text-sm text-gray-600 mb-6">Enter soil and weather conditions to get crop recommendations</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        N - Nitrogen Ratio (0-200)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.N}
                        onChange={(e) => handleCropInputChange('N', e.target.value)}
                        min="0"
                        max="200"
                        step="0.1"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 90"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        P - Phosphorous Ratio (0-200)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.P}
                        onChange={(e) => handleCropInputChange('P', e.target.value)}
                        min="0"
                        max="200"
                        step="0.1"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 42"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        K - Potassium Ratio (0-200)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.K}
                        onChange={(e) => handleCropInputChange('K', e.target.value)}
                        min="0"
                        max="200"
                        step="0.1"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 43"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.temperature}
                        onChange={(e) => handleCropInputChange('temperature', e.target.value)}
                        min="0"
                        max="50"
                        step="0.1"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 20.88"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        Humidity (%)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.humidity}
                        onChange={(e) => handleCropInputChange('humidity', e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 82.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        pH Value (0-14)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.ph}
                        onChange={(e) => handleCropInputChange('ph', e.target.value)}
                        min="0"
                        max="14"
                        step="0.01"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 6.50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-2">
                        Rainfall (mm)
                      </label>
                      <input
                        type="number"
                        value={cropInputs.rainfall}
                        onChange={(e) => handleCropInputChange('rainfall', e.target.value)}
                        min="0"
                        step="0.1"
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                        placeholder="e.g., 202.94"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleShowCrop}
                      disabled={cropLoading}
                      className={`bg-[#06603f] text-white px-6 py-2 rounded-md font-medium hover:bg-[#054f33] transition-colors ${
                        cropLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {cropLoading ? 'Loading...' : 'Show Crop'}
                    </button>
                  </div>
                  
                  {cropError && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                      {cropError}
                    </div>
                  )}
                  
                  {cropResult && (
                    <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">
                        Recommended Crop: <span className="capitalize">{cropResult.recommended_crop}</span>
                      </h3>
                      
                      {cropResult.recommendations && cropResult.recommendations.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Top Recommendations:</p>
                          <div className="space-y-2">
                            {cropResult.recommendations.map((rec, index) => (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-2 rounded ${
                                  index === 0 ? 'bg-green-100' : 'bg-gray-100'
                                }`}
                              >
                                <span className="capitalize font-medium text-gray-800">
                                  {index + 1}. {rec.crop}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {rec.confidence.toFixed(1)}% confidence
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl min-h-[200px] border border-gray-200 shadow-xl p-6 md:p-8 flex items-center justify-center text-gray-600">
                  Market recommendations will appear here.
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