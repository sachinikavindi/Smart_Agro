import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from datetime import datetime

# Path to the Excel file
EXCEL_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'crop_price1.xlsx')

def prepare_data():
    """Load and prepare the dataset for training"""
    try:
        # Load dataset
        df = pd.read_excel(EXCEL_FILE_PATH)
        df.columns = df.columns.str.strip()
        
        # Create full date from Year, Month, date
        df['full_date'] = pd.to_datetime({
            'year': df['Year'],
            'month': df['Month'],
            'day': df['date']
        }, errors='coerce')
        
        # Remove rows with invalid dates
        df = df.dropna(subset=['full_date'])
        
        # Extract date features
        df['year'] = df['full_date'].dt.year
        df['month'] = df['full_date'].dt.month
        df['day'] = df['full_date'].dt.day
        df['day_of_week'] = df['full_date'].dt.dayofweek
        df['day_of_year'] = df['full_date'].dt.dayofyear
        
        # Encode vegetable names
        le = LabelEncoder()
        df['vegetable_encoded'] = le.fit_transform(df['vegetable name'])
        
        # Select features
        feature_columns = ['year', 'month', 'day', 'day_of_week', 'day_of_year', 'vegetable_encoded']
        X = df[feature_columns]
        
        # Target columns (all 4 price types)
        target_columns = [
            'Wholesale_Pettah(RS)',
            'Wholesale_Dambulla(RS)',
            'Retail_Pettah(RS)',
            'Retail_Dambulla(RS)'
        ]
        
        # Remove rows with missing target values
        df_clean = df.dropna(subset=target_columns)
        X_clean = df_clean[feature_columns]
        
        # Prepare targets
        y = df_clean[target_columns]
        
        return X_clean, y, le, feature_columns, target_columns
        
    except Exception as e:
        print(f"Error preparing data: {str(e)}")
        return None, None, None, None, None

def train_price_model():
    """Train the price prediction model"""
    try:
        X, y, le, feature_columns, target_columns = prepare_data()
        
        if X is None:
            return None, None, None, None
        
        # Train-test split (80-20)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train separate models for each price type
        models = {}
        scores = {}
        
        for target in target_columns:
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=20,
                random_state=42,
                n_jobs=-1
            )
            
            model.fit(X_train, y_train[target])
            
            # Evaluate
            y_pred = model.predict(X_test)
            mae = mean_absolute_error(y_test[target], y_pred)
            rmse = np.sqrt(mean_squared_error(y_test[target], y_pred))
            r2 = r2_score(y_test[target], y_pred)
            
            models[target] = model
            scores[target] = {
                'mae': mae,
                'rmse': rmse,
                'r2': r2
            }
            
            print(f"{target}:")
            print(f"  MAE: {mae:.2f}")
            print(f"  RMSE: {rmse:.2f}")
            print(f"  R²: {r2:.4f}")
        
        # Save models
        model_dir = os.path.join(os.path.dirname(__file__))
        joblib.dump(models, os.path.join(model_dir, 'price_prediction_models.pkl'))
        joblib.dump(le, os.path.join(model_dir, 'vegetable_encoder.pkl'))
        
        print(f"\nModels saved to {model_dir}")
        return models, le, feature_columns, target_columns, scores
        
    except Exception as e:
        print(f"Error training model: {str(e)}")
        return None, None, None, None, None

def predict_prices(date_str, vegetable_name):
    """Predict prices for a given date and vegetable"""
    try:
        model_dir = os.path.join(os.path.dirname(__file__))
        models_path = os.path.join(model_dir, 'price_prediction_models.pkl')
        encoder_path = os.path.join(model_dir, 'vegetable_encoder.pkl')
        
        if not os.path.exists(models_path) or not os.path.exists(encoder_path):
            print("Models not found. Training new models...")
            result = train_price_model()
            if result[0] is None:
                return None
            models, le, feature_columns, target_columns, _ = result
        else:
            models = joblib.load(models_path)
            le = joblib.load(encoder_path)
            X, y, le_temp, feature_columns, target_columns = prepare_data()
        
        # Parse date
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        
        # Encode vegetable
        try:
            vegetable_encoded = le.transform([vegetable_name])[0]
        except ValueError:
            # If vegetable not in training data, use average encoding
            vegetable_encoded = len(le.classes_) // 2
        
        # Prepare features
        features = pd.DataFrame({
            'year': [date_obj.year],
            'month': [date_obj.month],
            'day': [date_obj.day],
            'day_of_week': [date_obj.weekday()],
            'day_of_year': [date_obj.timetuple().tm_yday],
            'vegetable_encoded': [vegetable_encoded]
        })
        
        # Predict all prices
        predictions = {}
        for target in target_columns:
            model = models[target]
            pred = model.predict(features)[0]
            # Ensure non-negative prices and convert to float
            predictions[target] = float(max(0, round(pred, 2)))
        
        return predictions
        
    except Exception as e:
        print(f"Error predicting prices: {str(e)}")
        return None

if __name__ == "__main__":
    # Train the model when script is run directly
    train_price_model()
