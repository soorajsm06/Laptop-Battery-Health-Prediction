
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
# import joblib  # Or import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, allowing requests from Next.js frontend

# --- Mock Model Section ---
# This section mocks the behavior of loading and using 'model1.pkl'.
# Replace this with your actual model loading and prediction logic.

# Placeholder for the loaded model
# MODEL = None

# def load_model():
#     """Loads the pre-trained model."""
#     global MODEL
#     model_path = os.path.join(os.path.dirname(__file__), 'model1.pkl')
#     if os.path.exists(model_path):
#         # MODEL = joblib.load(model_path)  # Or pickle.load(open(model_path, 'rb'))
#         print(f"Mock: Would load model from {model_path}")
#         MODEL = "mock_model_loaded" # Placeholder to indicate model is 'loaded'
#     else:
#         print(f"Warning: Model file {model_path} not found. Using a very basic mock prediction.")
#         MODEL = "mock_model_not_found"

def mock_predict_battery_life(input_data: dict) -> float:
    """
    Mocks the battery life prediction.
    Replace this function with your actual model's prediction call
    and any necessary preprocessing of input_data.
    """
    print(f"Mock predict received input: {input_data}")

    # Example: Convert input_data (dict) to a Pandas DataFrame if your model expects it
    # features = pd.DataFrame([input_data])
    #
    # --- Feature Engineering Example (adapt to your model's needs) ---
    # Ensure 'state' is handled (e.g., one-hot encoding if model was trained that way)
    # Example: if 'state' in features.columns:
    #     features = pd.get_dummies(features, columns=['state'], prefix='state')
    #
    # Expected columns by a hypothetical model (add or remove as needed)
    # expected_cols = ['capacityPercentage', 'designCapacityMah', ...] # + one-hot encoded state columns
    # for col in expected_cols:
    #     if col not in features.columns:
    #         features[col] = 0 # Add missing columns with default value (e.g. 0)
    # features = features[expected_cols] # Ensure correct column order

    # --- Actual Model Prediction (replace with your model) ---
    # if MODEL and MODEL != "mock_model_not_found":
    #     # prediction = MODEL.predict(features)
    #     # return float(prediction[0]) # Assuming model returns a single value array
    #     pass # Fall through to basic mock if actual model call is commented out

    # --- Basic Mock Prediction Logic (if model1.pkl is not used or for testing) ---
    capacity_percentage = float(input_data.get('capacityPercentage', 0))
    full_charge_mah = float(input_data.get('fullChargeCapacityMah', 1))
    drained_mwh = float(input_data.get('drainedMwh', 0))
    duration_seconds = float(input_data.get('durationSeconds', 1))

    if duration_seconds == 0:
        duration_seconds = 1 # Avoid division by zero

    # Simplified calculation (arbitrary)
    # Base time proportional to current effective capacity
    predicted_time_left_seconds = (capacity_percentage / 100.0) * full_charge_mah * 0.08 # Arbitrary factor

    # Adjust based on drain rate
    drain_rate_mwh_per_sec = drained_mwh / duration_seconds
    if drain_rate_mwh_per_sec > 0.05: # Arbitrary threshold for "significant" drain
        predicted_time_left_seconds /= (drain_rate_mwh_per_sec * 20) # Reduce time more aggressively

    # Ensure non-negative and apply a cap (e.g., 3 days)
    predicted_time_left_seconds = max(0, predicted_time_left_seconds)
    predicted_time_left_seconds = min(predicted_time_left_seconds, 24 * 3600 * 3)
    
    print(f"Mock predicted time: {predicted_time_left_seconds} seconds")
    return predicted_time_left_seconds

# load_model() # Load the model when the Flask app starts
# --- End Mock Model Section ---

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    input_data = request.get_json()

    # Validate required fields (basic example)
    required_fields = [
        'state', 'capacityPercentage', 'designCapacityMah', 'drainedMwh',
        'durationSeconds', 'currentEnergyMwh', 'fullChargeCapacityMah'
    ]
    missing_fields = [field for field in required_fields if field not in input_data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        # --- Preprocessing and Prediction ---
        # Here, you would typically preprocess `input_data` to match `model1.pkl`'s expected input format
        # For example, creating a Pandas DataFrame, one-hot encoding 'state', etc.
        # prediction_seconds = MODEL.predict(processed_input_data)[0] # Example
        
        # Using the mock prediction function
        prediction_seconds = mock_predict_battery_life(input_data)

        return jsonify({'predictedTimeLeftSeconds': prediction_seconds})
    except Exception as e:
        app.logger.error(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 5001
    port = int(os.environ.get('FLASK_RUN_PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
