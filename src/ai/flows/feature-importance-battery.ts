// This is an AI-powered code, and should be placed in a 'use server' block.
'use server';

/**
 * @fileOverview Provides a visualization of feature importance for battery life prediction.
 *
 * - visualizeFeatureImportance - A function that generates a feature importance plot as a data URI.
 * - VisualizeFeatureImportanceInput - The input type for the visualizeFeatureImportance function.
 * - VisualizeFeatureImportanceOutput - The return type for the visualizeFeatureImportance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeFeatureImportanceInputSchema = z.object({
  featureList: z.array(z.string()).describe('List of battery features.'),
  importanceScores: z.array(z.number()).describe('List of importance scores corresponding to the features.'),
});
export type VisualizeFeatureImportanceInput = z.infer<typeof VisualizeFeatureImportanceInputSchema>;

const VisualizeFeatureImportanceOutputSchema = z.object({
  plotDataUri: z
    .string()
    .describe(
      "A plot of feature importances as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' for display in the UI."
    ),
});
export type VisualizeFeatureImportanceOutput = z.infer<typeof VisualizeFeatureImportanceOutputSchema>;

export async function visualizeFeatureImportance(
  input: VisualizeFeatureImportanceInput
): Promise<VisualizeFeatureImportanceOutput> {
  return visualizeFeatureImportanceFlow(input);
}

const visualizeFeatureImportanceFlow = ai.defineFlow(
  {
    name: 'visualizeFeatureImportanceFlow',
    inputSchema: VisualizeFeatureImportanceInputSchema,
    outputSchema: VisualizeFeatureImportanceOutputSchema,
  },
  async input => {
    const featureImportancePrompt = ai.definePrompt({
      name: 'featureImportancePrompt',
      input: {schema: VisualizeFeatureImportanceInputSchema},
      output: {schema: VisualizeFeatureImportanceOutputSchema},
      prompt: `You are an AI expert at visualizing data.

      Given a list of battery features and their importance scores, generate a visualization of the feature importances as a data URI.

      Features: {{featureList}}
      Importance Scores: {{importanceScores}}

      The plot should be a bar chart with features on the y-axis and importance scores on the x-axis.

      Return the plot as a data URI. It should include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'

      Ensure the plot is visually appealing and easy to understand.

      Here is the plot as a data URI:
      {{media url=plotDataUri}}
      `,
    });

    // Create a string that represents the plot data in base64
    const plotDataUri = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIj48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RmVhdHVyZSBJbXBvcnRhbmNlIFBsb3Q8L3RleHQ+PC9zdmc+';

    const {output} = await featureImportancePrompt({
      ...input,
      plotDataUri,
    });

    return output!;
  }
);
