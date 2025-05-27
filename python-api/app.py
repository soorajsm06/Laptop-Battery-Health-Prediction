import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib  # For loading the Random Forest model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, allowing requests from Next.js frontend

# --- Model Section ---
# Placeholder for the loaded model
MODEL = None

def load_model():
    """Loads the pre-trained Random Forest model."""
    global MODEL
    model_path = os.path.join(os.path.dirname(__file__), 'model2.pkl')
    if os.path.exists(model_path):
        try:
            MODEL = joblib.load(model_path)  # Load the Random Forest model
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            MODEL = None
    else:
        print(f"Warning: Model file {model_path} not found.")
        MODEL = None

def predict_battery_life(input_data: dict) -> float:
    """
    Predicts the battery life using the loaded Random Forest model.
    Preprocesses the input data to match the model's expected format.
    """
    if MODEL is None:
        raise ValueError("Model is not loaded. Please check the model file.")

    # Convert input_data (dict) to a Pandas DataFrame
    features = pd.DataFrame([input_data])

    # --- Feature Mapping ---
    # Map input feature names to the names expected by the model
    feature_mapping = {
        'capacityPercentage': 'Capacity',
        'currentEnergyMwh': 'Energy',
        'drain_rate': 0,
        'state': 'State',
        'durationSeconds': 'Duration Seconds',
        'drainedMwh': 'Drained',
        'fullChargeCapacityMah': 'Full Charge Capacity',
        'designCapacityMah': 'Design Capacity'

    }
    features.rename(columns=feature_mapping, inplace=True)

    # --- Feature Engineering ---
    # Calculate drain_rate_mwh_per_sec
    if 'Drained' in features.columns and 'Duration Seconds' in features.columns:
        features['drain_rate'] = features['Drained'] / features['Duration Seconds']
    else:
        features['drain_rate'] = 0  # Default value if data is missing

    # Directly set the State value
    state_mapping = {
        'Active': 0,
        'Connected standby': 1,
        'Idle': 2,
        'Sleep': 3
    }
    if 'State' in features.columns:
        features['State'] = features['State'].map(state_mapping).fillna(-1)  # Default to -1 if state is unknown

    # Expected columns by the model (add or remove as needed)
    expected_cols = [
        'State', 'Capacity', 'Design Capacity', 'Drained', 'Duration Seconds','Energy', 'Full Charge Capacity','drain_rate'
    ]
    # Add missing columns with default value (e.g., 0)
    for col in expected_cols:
        if col not in features.columns:
            features[col] = 0

    # Ensure correct column order
    features = features[expected_cols]

    print("Input features for prediction:")
    for column in features.columns:
        print(f"{column}: {features[column].values[0]}")

    # --- Model Prediction ---
    prediction = MODEL.predict(features)
    return float(prediction[0])  # Assuming the model returns a single value array

# Load the model when the Flask app starts
load_model()
# --- End Model Section ---

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    input_data = request.get_json()

    # Validate required fields
    required_fields = [
        'state', 'capacityPercentage', 'designCapacityMah', 'drainedMwh',
        'durationSeconds', 'currentEnergyMwh', 'fullChargeCapacityMah'
    ]
    missing_fields = [field for field in required_fields if field not in input_data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        # Preprocessing and Prediction
        prediction_seconds = predict_battery_life(input_data)
        print(f"Predicted time left (seconds): {prediction_seconds}")
        return jsonify({'predictedTimeLeftSeconds': prediction_seconds})
    except Exception as e:
        app.logger.error(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 5001
    port = int(os.environ.get('FLASK_RUN_PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
