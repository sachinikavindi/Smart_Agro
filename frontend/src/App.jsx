import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MarPrices from './pages/MarPrices'
import AiPrediction from './pages/AiPrediction'
import About from './pages/About'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mar-prices" element={<MarPrices />} />
        <Route path="/ai-prediction" element={<AiPrediction />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
