# **App Name**: Laptop Battery Forecaster

## Core Features:

- Battery Input Form: Displays a simple input form for users to input battery characteristics based on the fields used to train the model. Fields include 'State', 'Capacity', 'Design Capacity', 'Drained', 'Duration Seconds', 'Energy', and 'Full Charge Capacity'.
- Prediction Retrieval: Communicates the entered input to the backend Flask service, awaits the response, and displays the prediction returned from the model (Time Left Until Battery Hits 0%).
- Visual Feature Importance: Provide feature importance plot on battery features, as part of the model's response.
- Inference Explanation: AI tool to show relevant decision plots that will inform the user about their device utilization behavior, which influences their battery time left prediction.
- Evaluation Metrics: Displays model evaluation metrics.

## Style Guidelines:

- Primary color: Light blue (#E0F7FA) to represent technology and reliability.
- Secondary color: White (#FFFFFF) for clean and readable backgrounds.
- Accent: Teal (#008080) for key interactive elements and call-to-action buttons, providing a clear visual focus.
- Clear and easily readable sans-serif fonts to ensure the data is easily understood.
- Use battery-related icons to visually represent the different input fields.
- A clean, well-organized layout with clear sections for input, output, and the visualization.