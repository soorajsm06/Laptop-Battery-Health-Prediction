'use server';

import type { BatteryInput, PredictionData } from '@/lib/types';
import { BatteryInputSchema } from '@/lib/types';
import { explainBatteryPrediction } from '@/ai/flows/explain-battery-prediction';
import { visualizeFeatureImportance } from '@/ai/flows/feature-importance-battery';

export async function predictBatteryLife(
  currentState: any, // Used for react-hook-form's progressive enhancement formState
  formData: FormData
): Promise<PredictionData> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validationResult = BatteryInputSchema.safeParse(rawFormData);

  if (!validationResult.success) {
    console.error('Form validation error:', validationResult.error.flatten().fieldErrors);
    return {
      error: 'Invalid input. Please check the form fields. ' + 
             Object.entries(validationResult.error.flatten().fieldErrors)
                   .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
                   .join('; '),
    };
  }

  const input: BatteryInput = validationResult.data;

  // Mock model prediction
  // A very simple mock: more capacity = more time, more drain = less time.
  // This is highly arbitrary and NOT a real model.
  const calculatedDrainRateMwhPerSec = input.durationSeconds > 0 ? input.drainedMwh / input.durationSeconds : 0;
  let predictedTimeLeftSeconds = 7200; // Default 2 hours

  // Simplified mock prediction based on some inputs
  // This is not a real model prediction
  const baseTime = (input.capacityPercentage / 100) * input.fullChargeCapacityMah * 0.1; // Arbitrary scaling
  if (calculatedDrainRateMwhPerSec > 0.1) { // Arbitrary threshold for "significant" drain
     predictedTimeLeftSeconds = Math.max(0, baseTime / (calculatedDrainRateMwhPerSec * 50)); // Arbitrary scaling
  } else {
     predictedTimeLeftSeconds = Math.max(0, baseTime * 1.5); // Longer time if low drain
  }
  
  // Ensure prediction is not negative and cap it
  predictedTimeLeftSeconds = Math.max(0, predictedTimeLeftSeconds);
  predictedTimeLeftSeconds = Math.min(predictedTimeLeftSeconds, 24 * 3600 * 3); // Cap at 3 days


  try {
    // Prepare inputs for AI flows
    const aiExplainInput = {
      state: input.state,
      // AI flow expects capacity in mAh. Calculate from percentage and full charge capacity.
      capacity: (input.capacityPercentage / 100) * input.fullChargeCapacityMah,
      designCapacity: input.designCapacityMah,
      // AI flow `drained` and `energy` (consumption) are the same in this context
      drained: input.drainedMwh, 
      durationSeconds: input.durationSeconds,
      energy: input.drainedMwh, // Energy consumed
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
      'Calculated Drain Rate (mWh/s)'
    ];
    // Mock importance scores - these should ideally come from your actual model analysis
    const importanceScores = [0.10, 0.15, 0.05, 0.20, 0.08, 0.12, 0.05, 0.25];
    
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
    console.error('Error in AI flow processing:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during AI processing.';
    return {
      error: `Prediction failed: ${errorMessage}`,
      predictedTimeLeftSeconds: predictedTimeLeftSeconds, // Still return basic prediction if AI fails
    };
  }
}
