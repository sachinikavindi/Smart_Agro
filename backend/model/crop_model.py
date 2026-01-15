import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Path to the CSV file
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'Crop_recommendation.csv')

def train_crop_model():
    """Train the crop recommendation model"""
    try:
        # Load dataset
        df = pd.read_csv(CSV_FILE_PATH)
        
        # Features and target
        X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
        y = df['label']
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Model - Random Forest Classifier
        model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=20
        )
        
        # Train the model
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model Accuracy: {accuracy:.4f}")
        
        # Save model
        model_path = os.path.join(os.path.dirname(__file__), 'crop_recommendation_model.pkl')
        joblib.dump(model, model_path)
        
        print(f"Model trained and saved to {model_path}")
        return model, accuracy
        
    except Exception as e:
        print(f"Error training model: {str(e)}")
        return None, None

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    """Predict crop recommendation based on soil and weather conditions"""
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'crop_recommendation_model.pkl')
        
        if not os.path.exists(model_path):
            print("Model not found. Training new model...")
            model, _ = train_crop_model()
            if model is None:
                return None, "Failed to train model"
        else:
            model = joblib.load(model_path)
        
        # Prepare input data as DataFrame to match training format
        input_data = pd.DataFrame({
            'N': [N],
            'P': [P],
            'K': [K],
            'temperature': [temperature],
            'humidity': [humidity],
            'ph': [ph],
            'rainfall': [rainfall]
        })
        
        # Predict
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        # Get top 3 recommendations
        classes = model.classes_
        top_indices = probabilities.argsort()[-3:][::-1]
        recommendations = [
            {
                'crop': classes[idx],
                'confidence': float(probabilities[idx] * 100)
            }
            for idx in top_indices
        ]
        
        return prediction, recommendations
        
    except Exception as e:
        print(f"Error predicting crop: {str(e)}")
        return None, str(e)

if __name__ == "__main__":
    # Train the model when script is run directly
    train_crop_model()

