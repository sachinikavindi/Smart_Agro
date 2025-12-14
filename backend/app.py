from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock price data - replace with actual ML model predictions later
BASE_PRICES = {
    'Beans': 120,
    'Tomato': 90,
    'Brinjal': 80,
    'Carrot': 70,
    'Cabbage': 60,
}

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask backend!"})

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        
        # Validate input
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        date = data.get('date')
        vegetables = data.get('vegetables', [])
        
        if not date:
            return jsonify({"error": "Date is required"}), 400
        
        if not vegetables or len(vegetables) == 0:
            return jsonify({"error": "At least one vegetable must be selected"}), 400
        
        # Validate date format
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Calculate predicted prices (mock implementation)
        # In production, this would use a trained ML model
        predicted_prices = {}
        for veg in vegetables:
            base_price = BASE_PRICES.get(veg, 100)
            # Simple mock prediction: add some variation based on date
            # In production, this would be replaced with actual ML predictions
            date_factor = hash(date) % 20 - 10  # -10 to +10 variation
            predicted_price = max(50, base_price + date_factor)  # Ensure minimum price
            predicted_prices[veg] = round(predicted_price, 2)
        
        # Calculate total
        total = sum(predicted_prices.values())
        
        return jsonify({
            "success": True,
            "date": date,
            "vegetables": vegetables,
            "prices": predicted_prices,
            "total": round(total, 2),
            "message": f"Price prediction for {len(vegetables)} vegetable(s) on {date}"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
