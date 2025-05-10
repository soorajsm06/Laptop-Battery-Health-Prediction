# Firebase Studio - Laptop Battery Forecaster

This is a Next.js application that predicts laptop battery life using a Python backend for the core model prediction.

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   Python (v3.8 or later recommended)
*   pip

### 1. Frontend (Next.js) Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root of the project (if it doesn't exist) and add the following:
    ```
    FLASK_API_URL=http://127.0.0.1:5001
    ```

3.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The Next.js app will be available at `http://localhost:9002`.

### 2. Backend (Flask) Setup

The Flask backend serves the machine learning model prediction.

1.  **Navigate to the Python API directory:**
    ```bash
    cd python-api
    ```

2.  **Create and Activate a Virtual Environment (recommended):**
    ```bash
    # For Unix/macOS
    python3 -m venv venv
    source venv/bin/activate
    
    # For Windows
    # python -m venv venv
    # .\venv\Scripts\activate
    ```

3.  **Install Python Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Place your Model (model1.pkl):**
    *   This project expects a pre-trained model file named `model1.pkl` in the `python-api/` directory.
    *   The `python-api/app.py` file currently uses a *mock prediction function*.
    *   To use your actual model:
        *   Place your `model1.pkl` file into the `python-api/` directory.
        *   Open `python-api/app.py`.
        *   Uncomment the `import joblib` (or `import pickle`) line.
        *   Uncomment the `MODEL = None` and `load_model()` function.
        *   In `load_model()`, uncomment `MODEL = joblib.load(model_path)` (or the pickle equivalent).
        *   In the `/predict` route, comment out `prediction_seconds = mock_predict_battery_life(input_data)`
        *   Uncomment the lines for actual model preprocessing and prediction (e.g., `prediction_seconds = MODEL.predict(processed_input_data)[0]`).
        *   **Ensure the preprocessing steps in `python-api/app.py` match the requirements of your `model1.pkl` (e.g., feature names, data types, scaling, encoding).**

5.  **Run the Flask Backend Server:**
    ```bash
    flask run --port 5001
    # or, if you want it to be accessible from other devices on your network:
    # flask run --host=0.0.0.0 --port 5001
    ```
    The Flask API will be available at `http://127.0.0.1:5001`. The Next.js app is configured to send requests to this URL.

## Project Structure

*   `src/app/`: Next.js App Router pages and layouts.
    *   `page.tsx`: Main page component.
    *   `actions.ts`: Server Actions, including `predictBatteryLife` which calls the Flask backend.
*   `src/components/`: React components.
    *   `battery-form.tsx`: Form for user input.
    *   `prediction-display.tsx`: Component to display prediction results.
*   `src/lib/`: Shared TypeScript types and utility functions.
*   `python-api/`: Flask backend for model serving.
    *   `app.py`: Flask application logic.
    *   `requirements.txt`: Python dependencies.
    *   `model1.pkl`: (To be provided by the user) The pre-trained machine learning model.

## How it Works

1.  The user fills out the battery information form in the Next.js frontend (`src/components/battery-form.tsx`).
2.  On submission, the `predictBatteryLife` Server Action (`src/app/actions.ts`) is called.
3.  The Server Action sends the form data to the Flask backend (`python-api/app.py`) at the `/predict` endpoint.
4.  The Flask backend loads `model1.pkl` (or uses the mock), preprocesses the input, and makes a prediction.
5.  The Flask backend returns the `predictedTimeLeftSeconds` to the Next.js Server Action.
6.  The result (`predictedTimeLeftSeconds`) is returned to the frontend and displayed using `src/components/prediction-display.tsx`.

To get started, take a look at `src/app/page.tsx`.
