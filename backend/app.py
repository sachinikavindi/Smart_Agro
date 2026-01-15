from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import pandas as pd
import os
import sys

# Add model directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'model'))
from crop_model import predict_crop, train_crop_model
from aiprediction_model import predict_prices, train_price_model

app = Flask(__name__)
CORS(app)

# Path to the Excel file
EXCEL_FILE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'crop_price1.xlsx')

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

@app.route("/api/market-prices", methods=["GET"])
def get_market_prices():
    try:
        # Get query parameters
        date_filter = request.args.get('date')  # Format: YYYY-MM-DD
        vegetable_filter = request.args.get('vegetable')  # Specific vegetable name
        
        # Read Excel file
        if not os.path.exists(EXCEL_FILE_PATH):
            return jsonify({"error": "Data file not found"}), 404
        
        df = pd.read_excel(EXCEL_FILE_PATH)
        
        # Rename columns for easier access
        df.columns = df.columns.str.strip()
        
        # Filter by date if provided
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d')
                df = df[
                    (df['Year'] == filter_date.year) &
                    (df['Month'] == filter_date.month) &
                    (df['date'] == filter_date.day)
                ]
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Filter by vegetable if provided
        if vegetable_filter:
            df = df[df['vegetable name'].str.lower() == vegetable_filter.lower()]
        
        # If no filters, get the latest data (most recent date)
        if not date_filter and not vegetable_filter:
            # Get the most recent date
            latest_year = df['Year'].max()
            latest_month = df[df['Year'] == latest_year]['Month'].max()
            latest_date = df[(df['Year'] == latest_year) & (df['Month'] == latest_month)]['date'].max()
            df = df[
                (df['Year'] == latest_year) &
                (df['Month'] == latest_month) &
                (df['date'] == latest_date)
            ]
        
        if df.empty:
            return jsonify({
                "success": True,
                "date": date_filter or "latest",
                "data": [],
                "message": "No data found for the specified filters"
            })
        
        # Group by vegetable and get the latest entry for each (in case of duplicates)
        result_data = []
        for vegetable in df['vegetable name'].unique():
            veg_data = df[df['vegetable name'] == vegetable].iloc[-1]  # Get last entry
            
            result_data.append({
                "vegetable": str(veg_data['vegetable name']).strip(),
                "wholesale_pettah": float(veg_data['Wholesale_Pettah(RS)']) if pd.notna(veg_data['Wholesale_Pettah(RS)']) else None,
                "wholesale_dambulla": float(veg_data['Wholesale_Dambulla(RS)']) if pd.notna(veg_data['Wholesale_Dambulla(RS)']) else None,
                "retail_pettah": float(veg_data['Retail_Pettah(RS)']) if pd.notna(veg_data['Retail_Pettah(RS)']) else None,
                "retail_dambulla": float(veg_data['Retail_Dambulla(RS)']) if pd.notna(veg_data['Retail_Dambulla(RS)']) else None,
            })
        
        # Get the date of the returned data
        data_date = f"{int(df.iloc[0]['Year'])}-{int(df.iloc[0]['Month']):02d}-{int(df.iloc[0]['date']):02d}"
        
        return jsonify({
            "success": True,
            "date": data_date,
            "data": result_data,
            "count": len(result_data)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/price-trend", methods=["GET"])
def get_price_trend():
    try:
        # Get query parameters
        month_filter = request.args.get('month')  # Format: YYYY-MM
        vegetable_filter = request.args.get('vegetable')  # Specific vegetable name
        
        if not month_filter:
            return jsonify({"error": "Month is required"}), 400
        
        if not vegetable_filter:
            return jsonify({"error": "Vegetable is required"}), 400
        
        # Validate month format
        try:
            year, month = map(int, month_filter.split('-'))
            if month < 1 or month > 12:
                return jsonify({"error": "Invalid month. Month must be between 1 and 12"}), 400
        except (ValueError, AttributeError):
            return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
        
        # Read Excel file
        if not os.path.exists(EXCEL_FILE_PATH):
            return jsonify({"error": "Data file not found"}), 404
        
        df = pd.read_excel(EXCEL_FILE_PATH)
        df.columns = df.columns.str.strip()
        
        # Filter by vegetable
        df = df[df['vegetable name'].str.lower() == vegetable_filter.lower()]
        
        if df.empty:
            return jsonify({
                "success": True,
                "vegetable": vegetable_filter,
                "month": month_filter,
                "data": [],
                "message": "No data found for the specified vegetable"
            })
        
        # Filter by selected month and year
        df_filtered = df[
            (df['Year'] == year) &
            (df['Month'] == month)
        ].copy()
        
        if df_filtered.empty:
            return jsonify({
                "success": True,
                "vegetable": vegetable_filter,
                "month": month_filter,
                "data": [],
                "message": "No data found for the specified month"
            })
        
        # Create date column for sorting with error handling
        # Use errors='coerce' to handle invalid dates (e.g., day 31 in February)
        df_filtered['full_date'] = pd.to_datetime({
            'year': df_filtered['Year'],
            'month': df_filtered['Month'],
            'day': df_filtered['date']
        }, errors='coerce')
        
        # Remove rows with invalid dates (NaT values)
        df_filtered = df_filtered.dropna(subset=['full_date'])
        
        if df_filtered.empty:
            return jsonify({
                "success": True,
                "vegetable": vegetable_filter,
                "month": month_filter,
                "data": [],
                "message": "No valid date data found for the specified month"
            })
        
        if df_filtered.empty:
            return jsonify({
                "success": True,
                "vegetable": vegetable_filter,
                "date": date_filter,
                "data": [],
                "message": "No data found for the specified date range"
            })
        
        # Sort by date
        df_filtered = df_filtered.sort_values('full_date')
        
        # Prepare trend data
        trend_data = []
        for _, row in df_filtered.iterrows():
            trend_data.append({
                "date": row['full_date'].strftime('%Y-%m-%d'),
                "day": f"Day {len(trend_data) + 1}",
                "pettah_wholesale": float(row['Wholesale_Pettah(RS)']) if pd.notna(row['Wholesale_Pettah(RS)']) else None,
                "dambulla_wholesale": float(row['Wholesale_Dambulla(RS)']) if pd.notna(row['Wholesale_Dambulla(RS)']) else None,
                "pettah_retail": float(row['Retail_Pettah(RS)']) if pd.notna(row['Retail_Pettah(RS)']) else None,
                "dambulla_retail": float(row['Retail_Dambulla(RS)']) if pd.notna(row['Retail_Dambulla(RS)']) else None,
            })
        
        # Calculate percentage change if we have data
        percentage_change = None
        if len(trend_data) >= 2:
            first_price = trend_data[0].get('pettah_wholesale') or trend_data[0].get('dambulla_wholesale')
            last_price = trend_data[-1].get('pettah_wholesale') or trend_data[-1].get('dambulla_wholesale')
            if first_price and last_price:
                percentage_change = round(((last_price - first_price) / first_price) * 100, 1)
        
        return jsonify({
            "success": True,
            "vegetable": vegetable_filter,
            "month": month_filter,
            "data": trend_data,
            "count": len(trend_data),
            "percentage_change": percentage_change
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/demand-forecast", methods=["GET"])
def get_demand_forecast():
    try:
        # Get query parameters
        month_filter = request.args.get('month')  # Format: YYYY-MM
        vegetable_filter = request.args.get('vegetable')  # Optional: specific vegetable
        
        # Read Excel file
        if not os.path.exists(EXCEL_FILE_PATH):
            return jsonify({"error": "Data file not found"}), 404
        
        df = pd.read_excel(EXCEL_FILE_PATH)
        df.columns = df.columns.str.strip()
        
        # Filter by month if provided
        if month_filter:
            try:
                year, month = map(int, month_filter.split('-'))
                if month < 1 or month > 12:
                    return jsonify({"error": "Invalid month. Month must be between 1 and 12"}), 400
                df = df[(df['Year'] == year) & (df['Month'] == month)]
            except (ValueError, AttributeError):
                return jsonify({"error": "Invalid month format. Use YYYY-MM"}), 400
        else:
            # Get latest month if not provided
            latest_year = df['Year'].max()
            latest_month = df[df['Year'] == latest_year]['Month'].max()
            df = df[(df['Year'] == latest_year) & (df['Month'] == latest_month)]
        
        # Filter by vegetable if provided
        if vegetable_filter:
            df = df[df['vegetable name'].str.lower() == vegetable_filter.lower()]
        
        if df.empty:
            return jsonify({
                "success": True,
                "month": month_filter or f"{latest_year}-{latest_month:02d}",
                "data": [],
                "message": "No data found"
            })
        
        # Calculate demand levels based on price trends
        # High demand = prices increasing (scarcity)
        # Medium demand = stable prices
        # Low demand = prices decreasing (surplus)
        
        demand_data = []
        for vegetable in df['vegetable name'].unique():
            veg_df = df[df['vegetable name'] == vegetable].copy()
            
            # Create date column for sorting
            veg_df['full_date'] = pd.to_datetime({
                'year': veg_df['Year'],
                'month': veg_df['Month'],
                'day': veg_df['date']
            }, errors='coerce')
            veg_df = veg_df.dropna(subset=['full_date'])
            veg_df = veg_df.sort_values('full_date')
            
            if len(veg_df) < 2:
                continue
            
            # Calculate average price change trend
            prices = veg_df['Wholesale_Pettah(RS)'].fillna(veg_df['Wholesale_Dambulla(RS)'])
            prices = prices.dropna()
            
            if len(prices) < 2:
                continue
            
            # Calculate price trend (percentage change)
            first_price = prices.iloc[0]
            last_price = prices.iloc[-1]
            
            if first_price > 0:
                price_change = ((last_price - first_price) / first_price) * 100
            else:
                price_change = 0
            
            # Determine demand level based on price trend
            # High demand: prices increasing > 5%
            # Medium demand: prices stable (-5% to 5%)
            # Low demand: prices decreasing < -5%
            if price_change > 5:
                demand_level = "High"
                color = "#22c55e"  # Green
            elif price_change < -5:
                demand_level = "Low"
                color = "#ef4444"  # Red
            else:
                demand_level = "Medium"
                color = "#eab308"  # Yellow
            
            # Get week number or day range
            week_num = len(demand_data) + 1
            date_range = f"Week {week_num}"
            if len(veg_df) > 0:
                start_date = veg_df.iloc[0]['full_date']
                end_date = veg_df.iloc[-1]['full_date']
                date_range = f"{start_date.strftime('%b %d')} - {end_date.strftime('%b %d')}"
            
            demand_data.append({
                "vegetable": str(vegetable).strip(),
                "demand_level": demand_level,
                "color": color,
                "price_change": round(price_change, 1),
                "date_range": date_range,
                "current_price": round(float(last_price), 2) if pd.notna(last_price) else None
            })
        
        # Sort by demand level (High, Medium, Low)
        demand_order = {"High": 0, "Medium": 1, "Low": 2}
        demand_data.sort(key=lambda x: (demand_order.get(x['demand_level'], 3), x['vegetable']))
        
        return jsonify({
            "success": True,
            "month": month_filter or f"{latest_year}-{latest_month:02d}",
            "data": demand_data,
            "count": len(demand_data)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        
        # Predict prices using ML model
        predicted_prices = {}
        for veg in vegetables:
            predictions = predict_prices(date, veg)
            if predictions:
                predicted_prices[veg] = {
                    'wholesale_pettah': predictions.get('Wholesale_Pettah(RS)', 0),
                    'wholesale_dambulla': predictions.get('Wholesale_Dambulla(RS)', 0),
                    'retail_pettah': predictions.get('Retail_Pettah(RS)', 0),
                    'retail_dambulla': predictions.get('Retail_Dambulla(RS)', 0)
                }
            else:
                # Fallback if prediction fails
                predicted_prices[veg] = {
                    'wholesale_pettah': 0,
                    'wholesale_dambulla': 0,
                    'retail_pettah': 0,
                    'retail_dambulla': 0
                }
        
        return jsonify({
            "success": True,
            "date": date,
            "vegetables": vegetables,
            "prices": predicted_prices,
            "message": f"Price prediction for {len(vegetables)} vegetable(s) on {date}"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/crop-recommendation", methods=["POST"])
def get_crop_recommendation():
    try:
        data = request.json
        
        # Validate input
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract parameters
        N = data.get('N')
        P = data.get('P')
        K = data.get('K')
        temperature = data.get('temperature')
        humidity = data.get('humidity')
        ph = data.get('ph')
        rainfall = data.get('rainfall')
        
        # Validate all required fields
        required_fields = {
            'N': N,
            'P': P,
            'K': K,
            'temperature': temperature,
            'humidity': humidity,
            'ph': ph,
            'rainfall': rainfall
        }
        
        missing_fields = [key for key, value in required_fields.items() if value is None]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Validate data types and ranges
        try:
            N = float(N)
            P = float(P)
            K = float(K)
            temperature = float(temperature)
            humidity = float(humidity)
            ph = float(ph)
            rainfall = float(rainfall)
        except (ValueError, TypeError):
            return jsonify({"error": "All fields must be valid numbers"}), 400
        
        # Validate ranges (basic validation)
        if not (0 <= N <= 200) or not (0 <= P <= 200) or not (0 <= K <= 200):
            return jsonify({"error": "N, P, K must be between 0 and 200"}), 400
        if not (0 <= temperature <= 50):
            return jsonify({"error": "Temperature must be between 0 and 50°C"}), 400
        if not (0 <= humidity <= 100):
            return jsonify({"error": "Humidity must be between 0 and 100%"}), 400
        if not (0 <= ph <= 14):
            return jsonify({"error": "pH must be between 0 and 14"}), 400
        if rainfall < 0:
            return jsonify({"error": "Rainfall must be a positive number"}), 400
        
        # Get crop recommendation
        prediction, recommendations = predict_crop(N, P, K, temperature, humidity, ph, rainfall)
        
        if prediction is None:
            return jsonify({"error": recommendations if isinstance(recommendations, str) else "Failed to get crop recommendation"}), 500
        
        return jsonify({
            "success": True,
            "recommended_crop": prediction,
            "recommendations": recommendations,
            "input_data": {
                "N": N,
                "P": P,
                "K": K,
                "temperature": temperature,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
