
'use server';

import type { BatteryInput, PredictionData } from '@/lib/types';
import { BatteryInputSchema } from '@/lib/types';
import { explainBatteryPrediction } from '@/ai/flows/explain-battery-prediction';
import { visualizeFeatureImportance } from '@/ai/flows/feature-importance-battery';

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

  } catch (error) {
    console.error('Error calling Flask prediction service:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching prediction.';
    return {
      error: `Prediction failed: ${errorMessage}`,
    };
  }

  try {
    // Prepare inputs for AI flows using the prediction from Flask
    const aiExplainInput = {
      state: input.state,
      capacity: (input.capacityPercentage / 100) * input.fullChargeCapacityMah,
      designCapacity: input.designCapacityMah,
      drained: input.drainedMwh,
      durationSeconds: input.durationSeconds,
      energy: input.drainedMwh, 
      fullChargeCapacity: input.fullChargeCapacityMah,
      predictedTimeLeftSeconds: predictedTimeLeftSeconds,
    };

    const explanationResult = await explainBatteryPrediction(aiExplainInput);

    const featureList = [
      'State', 
      'Capacity (%)', 
      'Design Capacity (mAh)', 
      'Drained (mWh)', 
      'Duration (s)', 
      'Current Energy (mWh)', 
      'Full Charge Capacity (mAh)',
      // Add other features your model or explanation might consider important
    ];
    // Mock importance scores - these should ideally come from your actual model analysis or the Flask backend
    const importanceScores = [0.10, 0.20, 0.05, 0.25, 0.10, 0.15, 0.05, 0.10].slice(0, featureList.length);
    
    const featureImportanceResult = await visualizeFeatureImportance({
      featureList,
      importanceScores,
    });

    return {
      predictedTimeLeftSeconds: predictedTimeLeftSeconds,
      explanation: explanationResult.explanation,
      featureImportancePlotUri: featureImportanceResult.plotDataUri,
    };
  } catch (error) {
    console.error('Error in AI flow processing after Flask prediction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during AI processing.';
    return {
      error: `AI processing failed: ${errorMessage}`,
      predictedTimeLeftSeconds: predictedTimeLeftSeconds, // Still return prediction if AI fails
    };
  }
}
