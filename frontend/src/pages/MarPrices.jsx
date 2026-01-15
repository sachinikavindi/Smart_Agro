import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import background from '../assets/background.png'
import Footer from '../components/Footer'
import { getMarketPrices, getPriceTrend, getDemandForecast } from '../utils/api'

function MarPrices() {
  const [marketData, setMarketData] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedVegetable, setSelectedVegetable] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dataDate, setDataDate] = useState('')
  const [availableVegetables, setAvailableVegetables] = useState([])
  
  // Trend chart states
  const [trendMonth, setTrendMonth] = useState('')
  const [trendVegetable, setTrendVegetable] = useState('')
  const [trendData, setTrendData] = useState([])
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendError, setTrendError] = useState('')
  const [percentageChange, setPercentageChange] = useState(null)
  
  // Demand forecast states
  const [demandData, setDemandData] = useState([])
  const [demandLoading, setDemandLoading] = useState(false)
  const [demandError, setDemandError] = useState('')
  const [demandMonth, setDemandMonth] = useState('')

  // Fetch market prices
  useEffect(() => {
    fetchMarketPrices()
    fetchDemandForecast()
  }, [])

  // Fetch trend data when month or vegetable changes
  useEffect(() => {
    if (trendMonth && trendVegetable) {
      fetchTrendData()
    }
  }, [trendMonth, trendVegetable])

  const fetchMarketPrices = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getMarketPrices(selectedDate || null, selectedVegetable || null)
      if (response.success) {
        setMarketData(response.data || [])
        setDataDate(response.date || '')
        // Extract unique vegetables for dropdown
        const vegetables = [...new Set(response.data.map(item => item.vegetable))].sort()
        setAvailableVegetables(vegetables)
        
        // Set default trend vegetable if not set
        if (!trendVegetable && vegetables.length > 0) {
          setTrendVegetable(vegetables[0])
        }
      } else {
        setError(response.error || 'Failed to fetch market prices')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch market prices. Please check if the backend is running.')
      console.error('Market prices error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendData = async () => {
    setTrendLoading(true)
    setTrendError('')
    try {
      const response = await getPriceTrend(trendMonth, trendVegetable)
      if (response.success) {
        setTrendData(response.data || [])
        setPercentageChange(response.percentage_change)
      } else {
        setTrendError(response.error || 'Failed to fetch trend data')
      }
    } catch (err) {
      setTrendError(err.message || 'Failed to fetch trend data. Please check if the backend is running.')
      console.error('Trend data error:', err)
    } finally {
      setTrendLoading(false)
    }
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handleVegetableChange = (e) => {
    setSelectedVegetable(e.target.value)
  }

  const handleFilter = () => {
    fetchMarketPrices()
  }

  const handleTrendMonthChange = (e) => {
    setTrendMonth(e.target.value)
  }

  const handleTrendVegetableChange = (e) => {
    setTrendVegetable(e.target.value)
  }

  const fetchDemandForecast = async () => {
    setDemandLoading(true)
    setDemandError('')
    try {
      const response = await getDemandForecast(demandMonth || null, null)
      if (response.success) {
        setDemandData(response.data || [])
        if (!demandMonth && response.month) {
          setDemandMonth(response.month)
        }
      } else {
        setDemandError(response.error || 'Failed to fetch demand forecast')
      }
    } catch (err) {
      setDemandError(err.message || 'Failed to fetch demand forecast. Please check if the backend is running.')
      console.error('Demand forecast error:', err)
    } finally {
      setDemandLoading(false)
    }
  }

  const handleDemandMonthChange = (e) => {
    setDemandMonth(e.target.value)
  }

  const handleDemandFilter = () => {
    fetchDemandForecast()
  }

  // Calculate chart dimensions and paths for multi-line chart
  const chartWidth = 600
  const chartHeight = 250
  const padding = 40
  
  const getChartData = () => {
    if (!trendData || trendData.length === 0) return null
    
    const allPrices = [
      ...trendData.map(d => d.pettah_wholesale).filter(p => p !== null),
      ...trendData.map(d => d.dambulla_wholesale).filter(p => p !== null)
    ]
    
    if (allPrices.length === 0) return null
    
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice || 1
    
    const plotWidth = chartWidth - padding * 2
    const plotHeight = chartHeight - padding * 2
    
    const pettahPath = trendData
      .map((point, index) => {
        if (point.pettah_wholesale === null) return null
        const x = padding + (index / (trendData.length - 1)) * plotWidth
        const normalized = (point.pettah_wholesale - minPrice) / priceRange
        const y = padding + plotHeight - (normalized * plotHeight)
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
      })
      .filter(p => p !== null)
      .join(' ')
    
    const dambullaPath = trendData
      .map((point, index) => {
        if (point.dambulla_wholesale === null) return null
        const x = padding + (index / (trendData.length - 1)) * plotWidth
        const normalized = (point.dambulla_wholesale - minPrice) / priceRange
        const y = padding + plotHeight - (normalized * plotHeight)
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
      })
      .filter(p => p !== null)
      .join(' ')
    
    return {
      pettahPath,
      dambullaPath,
      minPrice,
      maxPrice,
      plotWidth,
      plotHeight
    }
  }

  const chartData = getChartData()

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
          <Link to="/mar-prices" className="text-yellow-400 ">
            MARKET PRICES
          </Link>
          <Link to="/ai-prediction" className="text-white hover:text-yellow-400 transition-colors font-medium">AI PREDICTION</Link>
          <Link to="/about" className="text-white hover:text-yellow-400 transition-colors">
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
        <div className="bg-[#024229]/90 rounded-3xl shadow-2xl text-white p-6 md:p-10 flex flex-col gap-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
            Today’s Market Prices – Pettah, Dambulla, Narahenpita
          </h1>

          <div className="flex flex-col gap-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-6 items-end">
              <div className="bg-white text-gray-900 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 border-2 border-[#006838]">
                <label className="text-sm font-semibold uppercase tracking-wide">Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="bg-transparent outline-none font-semibold" 
                />
              </div>
              <div className="bg-white text-gray-900 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 border-2 border-[#006838]">
                <label className="text-sm font-semibold uppercase tracking-wide">Vegetable</label>
                <select 
                  value={selectedVegetable}
                  onChange={handleVegetableChange}
                  className="bg-transparent outline-none font-semibold"
                >
                  <option value="">All Vegetables</option>
                  {availableVegetables.map((veg) => (
                    <option key={veg} value={veg}>{veg}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleFilter}
                disabled={loading}
                className="bg-[#006838] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#005a2d] transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Filter'}
              </button>
              {dataDate && (
                <span className="text-white text-sm">
                  Showing data for: {dataDate}
                </span>
              )}
            </div>

            <div className="bg-white rounded-3xl border-[6px] border-[#006838] shadow-2xl p-4 overflow-auto">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center py-8 text-gray-600">Loading market prices...</div>
              ) : marketData.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No data available</div>
              ) : (
                <table className="w-full text-gray-800 text-sm md:text-base border-collapse">
                  <thead>
                    <tr className="bg-[#E3D4D4] text-gray-800">
                      <th className="p-3 border border-gray-300 text-left">Vegetable</th>
                      <th colSpan={2} className="p-3 border border-gray-300 text-center text-[#5466B2] uppercase tracking-wide">
                        Wholesale Prices
                      </th>
                      <th colSpan={2} className="p-3 border border-gray-300 text-center text-[#5466B2] uppercase tracking-wide">
                        Retail Prices
                      </th>
                    </tr>
                    <tr className="bg-[#CCBDBD] text-gray-700">
                      <th className="p-2 border border-gray-300">Vegetable</th>
                      <th className="p-2 border border-gray-300 text-center">Pettah</th>
                      <th className="p-2 border border-gray-300 text-center">Dambulla</th>
                      <th className="p-2 border border-gray-300 text-center">Pettah</th>
                      <th className="p-2 border border-gray-300 text-center">Dambulla</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((item, idx) => (
                      <tr key={item.vegetable} className={idx % 2 === 0 ? 'bg-[#EBD4D4]' : 'bg-[#F5E1E1]'}>
                        <td className="p-2 border border-gray-300 font-semibold capitalize">{item.vegetable}</td>
                        <td className="p-2 border border-gray-300 text-center">
                          {item.wholesale_pettah !== null && item.wholesale_pettah !== undefined 
                            ? `Rs ${item.wholesale_pettah.toFixed(2)}` 
                            : 'N/A'}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {item.wholesale_dambulla !== null && item.wholesale_dambulla !== undefined 
                            ? `Rs ${item.wholesale_dambulla.toFixed(2)}` 
                            : 'N/A'}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {item.retail_pettah !== null && item.retail_pettah !== undefined 
                            ? `Rs ${item.retail_pettah.toFixed(2)}` 
                            : 'N/A'}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {item.retail_dambulla !== null && item.retail_dambulla !== undefined 
                            ? `Rs ${item.retail_dambulla.toFixed(2)}` 
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Demand Trend Forecast */}
      <section className="px-4 py-10 md:px-14 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 rounded-3xl border-[6px] border-[#006838] bg-white shadow-xl overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Demand Trend Forecast</h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 font-medium">Month:</label>
                  <input
                    type="month"
                    value={demandMonth}
                    onChange={handleDemandMonthChange}
                    className="border px-3 py-1 rounded-md text-sm"
                  />
                  <button
                    onClick={handleDemandFilter}
                    disabled={demandLoading}
                    className="bg-[#006838] text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-[#005a2d] transition-colors disabled:opacity-50"
                  >
                    {demandLoading ? 'Loading...' : 'Filter'}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span>High Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span>Medium Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span>Low Demand</span>
                </div>
              </div>
            </div>
            
            {demandError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded text-sm">
                {demandError}
              </div>
            )}

            {demandLoading ? (
              <div className="text-center py-8 text-gray-600">Loading demand forecast...</div>
            ) : demandData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No demand data available</div>
            ) : (
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {demandData.map((item, index) => {
                    // Calculate bar width (High=100%, Medium=70%, Low=40%)
                    const barWidth = item.demand_level === 'High' ? 100 : item.demand_level === 'Medium' ? 70 : 40
                    
                    // Get emoji based on demand level
                    const emoji = item.demand_level === 'High' ? '🟢' : item.demand_level === 'Medium' ? '🟡' : '🔴'
                    
                    return (
                      <div key={`${item.vegetable}-${index}`} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="w-28 text-sm font-semibold text-gray-800 capitalize flex items-center gap-2">
                            <span className="text-lg">{emoji}</span>
                            <span>{item.vegetable}</span>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-10 rounded-lg transition-all duration-300 flex items-center justify-between px-4 shadow-sm"
                                  style={{
                                    width: `${barWidth}%`,
                                    backgroundColor: item.color,
                                    minWidth: '120px'
                                  }}
                                >
                                  <span className="text-white text-sm font-bold">
                                    {item.demand_level} Demand
                                  </span>
                                  <span className="text-white text-xs font-medium">
                                    {item.price_change > 0 ? '+' : ''}{item.price_change}%
                                  </span>
                                </div>
                                {item.current_price && (
                                  <span className="text-xs text-gray-600">
                                    Rs {item.current_price}/kg
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 italic">
                              {item.demand_level === 'High' && `High demand expected for ${item.vegetable} next week`}
                              {item.demand_level === 'Medium' && `Moderate demand for ${item.vegetable}`}
                              {item.demand_level === 'Low' && `Low demand for ${item.vegetable}`}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {item.date_range}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 rounded-3xl border-[6px] border-[#006838] bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Market Comparison Trend</h2>
                <p className="text-sm text-gray-500">Wholesale prices comparison (Rs/kg) - Monthly Trend</p>
              </div>
              {percentageChange !== null && (
                <span className={`text-sm font-semibold ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {percentageChange >= 0 ? '+' : ''}{percentageChange}% vs start
                </span>
              )}
            </div>
            
            {/* Trend Chart Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Month:</label>
                <input
                  type="month"
                  value={trendMonth}
                  onChange={handleTrendMonthChange}
                  className="border px-3 py-1 rounded-md text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Vegetable:</label>
                <select
                  value={trendVegetable}
                  onChange={handleTrendVegetableChange}
                  className="border px-3 py-1 rounded-md text-sm"
                >
                  <option value="">Select Vegetable</option>
                  {availableVegetables.map((veg) => (
                    <option key={veg} value={veg}>{veg}</option>
                  ))}
                </select>
              </div>
            </div>

            {trendError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {trendError}
              </div>
            )}

            {trendLoading ? (
              <div className="text-center py-8 text-gray-600">Loading trend data...</div>
            ) : !trendMonth || !trendVegetable ? (
              <div className="text-center py-8 text-gray-500">Select a month and vegetable to view the trend</div>
            ) : !chartData || trendData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No trend data available</div>
            ) : (
              <div>
                <div className="h-64 overflow-x-auto">
                  <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                    <defs>
                      <linearGradient id="pettahGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2F73FF" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2F73FF" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="dambullaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Background */}
                    <rect width={chartWidth} height={chartHeight} fill="#F5F0FF" rx="16" />
                    
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                      const y = padding + (chartData.plotHeight * (1 - ratio))
                      return (
                        <line
                          key={ratio}
                          x1={padding}
                          y1={y}
                          x2={padding + chartData.plotWidth}
                          y2={y}
                          stroke="#E0E0E0"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                      )
                    })}
                    
                    {/* Pettah area fill */}
                    {chartData.pettahPath && (
                      <path
                        d={`${chartData.pettahPath} L${padding + chartData.plotWidth},${padding + chartData.plotHeight} L${padding},${padding + chartData.plotHeight} Z`}
                        fill="url(#pettahGradient)"
                        opacity="0.6"
                      />
                    )}
                    
                    {/* Dambulla area fill */}
                    {chartData.dambullaPath && (
                      <path
                        d={`${chartData.dambullaPath} L${padding + chartData.plotWidth},${padding + chartData.plotHeight} L${padding},${padding + chartData.plotHeight} Z`}
                        fill="url(#dambullaGradient)"
                        opacity="0.6"
                      />
                    )}
                    
                    {/* Pettah line */}
                    {chartData.pettahPath && (
                      <path
                        d={chartData.pettahPath}
                        fill="none"
                        stroke="#2F73FF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    {/* Dambulla line */}
                    {chartData.dambullaPath && (
                      <path
                        d={chartData.dambullaPath}
                        fill="none"
                        stroke="#FF6B35"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    {/* Data points */}
                    {trendData.map((point, index) => {
                      const x = padding + (index / (trendData.length - 1)) * chartData.plotWidth
                      if (point.pettah_wholesale !== null) {
                        const normalized = (point.pettah_wholesale - chartData.minPrice) / (chartData.maxPrice - chartData.minPrice || 1)
                        const y = padding + chartData.plotHeight - (normalized * chartData.plotHeight)
                        return (
                          <circle
                            key={`pettah-${index}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#2F73FF"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        )
                      }
                      return null
                    })}
                    
                    {trendData.map((point, index) => {
                      const x = padding + (index / (trendData.length - 1)) * chartData.plotWidth
                      if (point.dambulla_wholesale !== null) {
                        const normalized = (point.dambulla_wholesale - chartData.minPrice) / (chartData.maxPrice - chartData.minPrice || 1)
                        const y = padding + chartData.plotHeight - (normalized * chartData.plotHeight)
                        return (
                          <circle
                            key={`dambulla-${index}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#FF6B35"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        )
                      }
                      return null
                    })}
                    
                    {/* Y-axis labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                      const y = padding + (chartData.plotHeight * (1 - ratio))
                      const price = chartData.minPrice + (chartData.maxPrice - chartData.minPrice) * ratio
                      return (
                        <text
                          key={ratio}
                          x={padding - 10}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fill="#666"
                        >
                          {Math.round(price)}
                        </text>
                      )
                    })}
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#2F73FF]"></div>
                    <span className="text-sm text-gray-700">Pettah Wholesale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#FF6B35]"></div>
                    <span className="text-sm text-gray-700">Dambulla Wholesale</span>
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                  {trendData.length > 0 && (
                    <>
                      <span>{trendData[0].day}</span>
                      {trendData.length > 1 && <span>{trendData[Math.floor(trendData.length / 2)].day}</span>}
                      <span>{trendData[trendData.length - 1].day}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MarPrices