import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error
import joblib

# Load dataset
df = pd.read_excel("../data/crop_price1.xlsx")

# Encode vegetable type
le = LabelEncoder()
df["vegetable_type_encoded"] = le.fit_transform(df["vegetable_type"])

# Features & Target
X = df[
    ["year", "month", "date", "vegetable_type_encoded"]
]
y = df["wholesale_dambulla_price"]  # You can change target

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print("Model MAE:", mae)

# Save model & encoder
joblib.dump(model, "vegetable_price_model.pkl")
joblib.dump(le, "vegetable_encoder.pkl")

print("✅ Model trained and saved successfully")
