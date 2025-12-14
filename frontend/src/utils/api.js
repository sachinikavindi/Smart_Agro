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

