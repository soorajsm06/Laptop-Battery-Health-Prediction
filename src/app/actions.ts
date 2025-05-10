
'use server';

import type { BatteryInput, PredictionData } from '@/lib/types';
import { BatteryInputSchema } from '@/lib/types';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5001';

export async function predictBatteryLife(
  currentState: any, // Used for react-hook-form's progressive enhancement formState
  formData: FormData
): Promise<PredictionData> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validationResult = BatteryInputSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    console.error('Form validation error:', validationResult.error.flatten().fieldErrors);
    const errorMessage = Object.entries(validationResult.error.flatten().fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ');
    return {
      error: `Invalid input. Please check the form fields. ${errorMessage}`,
    };
  }

  const input: BatteryInput = validationResult.data;
  let predictedTimeLeftSeconds: number;

  try {
    // Call Flask backend for prediction
    console.log(`Sending data to Flask API at ${FLASK_API_URL}/predict:`, input);
    const flaskResponse = await fetch(`${FLASK_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!flaskResponse.ok) {
      const errorBody = await flaskResponse.text();
      console.error('Flask API error response:', flaskResponse.status, errorBody);
      throw new Error(`Prediction service failed: ${flaskResponse.statusText} - ${errorBody}`);
    }

    const flaskPredictionResult = await flaskResponse.json();
    console.log('Received prediction from Flask API:', flaskPredictionResult);

    if (typeof flaskPredictionResult.predictedTimeLeftSeconds !== 'number') {
      throw new Error('Invalid prediction format received from service.');
    }
    predictedTimeLeftSeconds = flaskPredictionResult.predictedTimeLeftSeconds;

    return {
      predictedTimeLeftSeconds: predictedTimeLeftSeconds,
    };

  } catch (error) {
    console.error('Error calling Flask prediction service:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching prediction.';
    return {
      error: `Prediction failed: ${errorMessage}`,
    };
  }
}
