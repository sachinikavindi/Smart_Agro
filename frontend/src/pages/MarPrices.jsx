import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import background from '../assets/background.png'
import Footer from '../components/Footer'

function MarPrices() {
  const forecastTrends = [
    { month: 'Oct 24', price: '₹4047.8', change: '-1.26%', direction: 'down' },
    { month: 'Nov 24', price: '₹4218.0', change: '2.89%', direction: 'up' },
    { month: 'Dec 24', price: '₹4584.3', change: '11.82%', direction: 'up' },
    { month: 'Jan 25', price: '₹4251.3', change: '3.7%', direction: 'up' },
    { month: 'Feb 25', price: '₹4310.5', change: '5.14%', direction: 'up' },
  ]

  const priceHistory = [
    { day: 'Day 1', price: 118 },
    { day: 'Day 5', price: 121 },
    { day: 'Day 10', price: 115 },
    { day: 'Day 15', price: 123 },
    { day: 'Day 20', price: 128 },
    { day: 'Day 25', price: 124 },
    { day: 'Day 30', price: 130 },
  ]

  const chartWidth = 360
  const chartHeight = 220
  const minPrice = Math.min(...priceHistory.map((p) => p.price))
  const maxPrice = Math.max(...priceHistory.map((p) => p.price))
  const priceRange = maxPrice - minPrice || 1
  const linePath = priceHistory
    .map((point, index) => {
      const x = (index / (priceHistory.length - 1)) * chartWidth
      const normalized = (point.price - minPrice) / priceRange
      const y = chartHeight - normalized * chartHeight
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

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
          <a href="#" className="text-white hover:text-yellow-400 transition-colors">
            PRODUCT
          </a>
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
            <div className="flex flex-wrap gap-6">
              <div className="bg-white text-gray-900 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 border-2 border-[#006838]">
                <label className="text-sm font-semibold uppercase tracking-wide">Date</label>
                <input type="date" className="bg-transparent outline-none font-semibold" />
              </div>
              <div className="bg-white text-gray-900 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3 border-2 border-[#006838]">
                <label className="text-sm font-semibold uppercase tracking-wide">Vegetable</label>
                <select className="bg-transparent outline-none font-semibold">
                  <option>Tomato</option>
                  <option>Carrot</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border-[6px] border-[#006838] shadow-2xl p-4 overflow-auto">
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
                  {['Tomato', 'Carrot', 'Cabbage'].map((veg, idx) => (
                    <tr key={veg} className={idx % 2 === 0 ? 'bg-[#EBD4D4]' : 'bg-[#F5E1E1]'}>
                      <td className="p-2 border border-gray-300 font-semibold">{veg}</td>
                      <td className="p-2 border border-gray-300 text-center">Rs 120</td>
                      <td className="p-2 border border-gray-300 text-center">Rs 110</td>
                      <td className="p-2 border border-gray-300 text-center">Rs 140</td>
                      <td className="p-2 border border-gray-300 text-center">Rs 135</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Forecast Trends */}
      <section className="px-4 py-10 md:px-14 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 rounded-3xl border-[6px] border-[#006838] bg-[#F5D9D9] shadow-xl overflow-hidden">
            <div className="bg-white/60 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Forecast Trends</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                <span>Month</span>
                <span className="text-center">Price (per Qtl.)</span>
                <span className="text-right">Change</span>
              </div>
              <ul className="space-y-3">
                {forecastTrends.map(({ month, price, change, direction }) => (
                  <li key={month} className="grid grid-cols-3 text-sm items-center text-gray-800">
                    <span>{month}</span>
                    <span className="text-center font-semibold">{price}</span>
                    <span className="flex items-center justify-end gap-2 font-semibold">
                      {change}
                      {direction === 'up' ? (
                        <span className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[10px] border-b-green-500" />
                      ) : (
                        <span className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[10px] border-t-red-500" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 rounded-3xl border-[6px] border-[#006838] bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">30-Day Price Trend</h2>
                <p className="text-sm text-gray-500">Average wholesale price (Rs/kg)</p>
              </div>
              <span className="text-sm font-semibold text-green-600">+4.7% vs last month</span>
            </div>
            <div className="h-64">
              <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F73FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2F73FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width={chartWidth} height={chartHeight} fill="#F5F0FF" rx="16" />
                <path d={linePath} fill="none" stroke="#2F73FF" strokeWidth="4" strokeLinecap="round" />
                <path
                  d={`${linePath} L${chartWidth},${chartHeight} L0,${chartHeight} Z`}
                  fill="url(#lineGradient)"
                  opacity="0.6"
                />
                {priceHistory.map((point, index) => {
                  const x = (index / (priceHistory.length - 1)) * chartWidth
                  const normalized = (point.price - minPrice) / priceRange
                  const y = chartHeight - normalized * chartHeight
                  return (
                    <circle key={point.day} cx={x} cy={y} r="5" fill="#2F73FF" stroke="#fff" strokeWidth="2" />
                  )
                })}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              {priceHistory.map((point) => (
                <span key={point.day}>{point.day}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MarPrices