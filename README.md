# SmartAgro

A smart agricultural platform for Sri Lankan farmers providing AI-driven insights for crop decisions, market prices, and agricultural success.

## Features

- **Market Prices**: View real-time market prices for vegetables across different markets (Pettah, Dambulla, Narahenpita)
- **AI Price Prediction**: Get AI-powered price predictions for selected vegetables on specific dates
- **Crop Recommendations**: Receive recommendations for optimal crop selection
- **Market Recommendations**: Get insights on best markets for selling produce

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Tailwind CSS
- Vite

### Backend
- Flask
- Flask-CORS
- Python

## Project Structure

```
SmartAgro_project/
├── backend/
│   └── app.py          # Flask backend API
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utility functions (API calls)
│   │   └── assets/     # Images and static assets
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install flask flask-cors
```

3. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

## API Endpoints

### GET `/api/hello`
Test endpoint to verify backend connection.

**Response:**
```json
{
  "message": "Hello from Flask backend!"
}
```

### POST `/api/predict`
Get price predictions for vegetables.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "vegetables": ["Tomato", "Carrot", "Cabbage"]
}
```

**Response:**
```json
{
  "success": true,
  "date": "2024-01-15",
  "vegetables": ["Tomato", "Carrot", "Cabbage"],
  "prices": {
    "Tomato": 90.0,
    "Carrot": 70.0,
    "Cabbage": 60.0
  },
  "total": 220.0,
  "message": "Price prediction for 3 vegetable(s) on 2024-01-15"
}
```

## Development

### Frontend Development
- The frontend uses Vite for fast development
- Hot module replacement (HMR) is enabled
- Tailwind CSS is configured for styling

### Backend Development
- Flask debug mode is enabled
- CORS is configured to allow frontend requests
- API endpoints are prefixed with `/api`

## License

This project is licensed under the MIT License.

## Contributors

- Sachini Kavindi

