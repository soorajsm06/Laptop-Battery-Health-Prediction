'use server';

/**
 * @fileOverview A flow to explain battery life predictions based on user input.
 *
 * - explainBatteryPrediction - A function that handles the battery prediction explanation process.
 * - ExplainBatteryPredictionInput - The input type for the explainBatteryPrediction function.
 * - ExplainBatteryPredictionOutput - The return type for the explainBatteryPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainBatteryPredictionInputSchema = z.object({
  state: z.string().describe('The current state of the laptop (e.g., Active, Idle, Sleep).'),
  capacity: z.number().describe('The current capacity of the battery in mAh.'),
  designCapacity: z.number().describe('The design capacity of the battery in mAh.'),
  drained: z.number().describe('The amount of energy drained from the battery in mWh.'),
  durationSeconds: z.number().describe('The duration over which the energy was drained in seconds.'),
  energy: z.number().describe('The energy consumption during the duration in mWh.'),
  fullChargeCapacity: z.number().describe('The full charge capacity of the battery in mAh.'),
  predictedTimeLeftSeconds: z.number().describe('The predicted time left in seconds before the battery is fully drained.'),
});
export type ExplainBatteryPredictionInput = z.infer<typeof ExplainBatteryPredictionInputSchema>;

const ExplainBatteryPredictionOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the factors influencing the battery life prediction, including the impact of each input parameter.'),
});
export type ExplainBatteryPredictionOutput = z.infer<typeof ExplainBatteryPredictionOutputSchema>;

export async function explainBatteryPrediction(input: ExplainBatteryPredictionInput): Promise<ExplainBatteryPredictionOutput> {
  return explainBatteryPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainBatteryPredictionPrompt',
  input: {schema: ExplainBatteryPredictionInputSchema},
  output: {schema: ExplainBatteryPredictionOutputSchema},
  prompt: `You are an AI assistant that explains battery life predictions for laptops.

  Based on the following battery characteristics, provide a detailed explanation of the factors influencing the predicted battery life. Explain how each factor (state, capacity, design capacity, drained, duration seconds, energy, full charge capacity) contributes to the predicted time left.

  State: {{{state}}}
  Capacity: {{{capacity}}} mAh
  Design Capacity: {{{designCapacity}}} mAh
  Drained: {{{drained}}} mWh
  Duration Seconds: {{{durationSeconds}}} seconds
  Energy: {{{energy}}} mWh
  Full Charge Capacity: {{{fullChargeCapacity}}} mAh
  Predicted Time Left: {{{predictedTimeLeftSeconds}}} seconds

  Focus on making the explanation easy to understand for a non-technical user, highlighting the most important factors and their impact on battery life.
  Make sure to mention specific numbers to justify the AI assistant's decision.
  Speak directly to the user, as if you were a consultant.
  Be specific about what can be done to improve battery life.
  
  Your output should be a well-written paragraph.
  `,
});

const explainBatteryPredictionFlow = ai.defineFlow(
  {
    name: 'explainBatteryPredictionFlow',
    inputSchema: ExplainBatteryPredictionInputSchema,
    outputSchema: ExplainBatteryPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
