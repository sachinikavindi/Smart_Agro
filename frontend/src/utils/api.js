// API configuration and utility functions

const API_BASE_URL = 'http://localhost:5000/api'

/**
 * Make a GET request to the API
 */
export async function get(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      // Try to parse error response as JSON
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` }
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to backend. Make sure the Flask server is running.')
    }
    console.error('GET request failed:', error)
    throw error
  }
}

/**
 * Make a POST request to the API
 */
export async function post(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      // Try to parse error response as JSON
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: `HTTP error! status: ${response.status}` }
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to backend. Make sure the Flask server is running.')
    }
    console.error('POST request failed:', error)
    throw error
  }
}

/**
 * Get prediction for vegetables
 */
export async function getPricePrediction(date, vegetables) {
  return post('/predict', {
    date,
    vegetables,
  })
}

/**
 * Test backend connection
 */
export async function testConnection() {
  return get('/hello')
}

/**
 * Get market prices from Excel data
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 * @param {string} vegetable - Optional vegetable filter
 */
export async function getMarketPrices(date = null, vegetable = null) {
  const params = new URLSearchParams()
  if (date) params.append('date', date)
  if (vegetable) params.append('vegetable', vegetable)
  
  const queryString = params.toString()
  const endpoint = `/market-prices${queryString ? `?${queryString}` : ''}`
  return get(endpoint)
}

/**
 * Get monthly price trend for a vegetable
 * @param {string} month - Month (YYYY-MM)
 * @param {string} vegetable - Vegetable name
 */
export async function getPriceTrend(month, vegetable) {
  const params = new URLSearchParams()
  params.append('month', month)
  params.append('vegetable', vegetable)
  
  return get(`/price-trend?${params.toString()}`)
}

/**
 * Get demand forecast data
 * @param {string} month - Optional month (YYYY-MM)
 * @param {string} vegetable - Optional vegetable name
 */
export async function getDemandForecast(month = null, vegetable = null) {
  const params = new URLSearchParams()
  if (month) params.append('month', month)
  if (vegetable) params.append('vegetable', vegetable)
  
  const queryString = params.toString()
  return get(`/demand-forecast${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get crop recommendation based on soil and weather conditions
 * @param {object} data - Object with N, P, K, temperature, humidity, ph, rainfall
 */
export async function getCropRecommendation(data) {
  return post('/crop-recommendation', data)
}

