import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MarPrices from './pages/MarPrices'
import AiPrediction from './pages/AiPrediction'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mar-prices" element={<MarPrices />} />
        <Route path="/ai-prediction" element={<AiPrediction />} />
      </Routes>
    </Router>
  )
}

export default App
