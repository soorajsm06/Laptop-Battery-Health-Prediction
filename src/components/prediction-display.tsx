'use client';

import type { PredictionData, FormattedPrediction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BarChart3, MessageSquareText, Clock } from 'lucide-react';
import Image from 'next/image';

interface PredictionDisplayProps {
  data: PredictionData | null;
}

function formatTime(totalSeconds: number): FormattedPrediction {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { hours, minutes, seconds };
}

export function PredictionDisplay({ data }: PredictionDisplayProps) {
  if (!data) {
    return null;
  }

  if (data.error) {
    // Error display handled by toast in BatteryForm for now
    return null; 
  }

  const timeLeft = data.predictedTimeLeftSeconds !== undefined ? formatTime(data.predictedTimeLeftSeconds) : null;

  return (
    <div className="space-y-6 w-full">
      {timeLeft && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock size={24} className="text-primary" />
              Predicted Time Left
            </CardTitle>
            <CardDescription>Estimated time until battery is fully drained.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </p>
            <p className="text-sm text-muted-foreground">
              (Total: {data.predictedTimeLeftSeconds?.toFixed(0)} seconds)
            </p>
          </CardContent>
        </Card>
      )}

      {data.explanation && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquareText size={24} className="text-primary" />
              Prediction Explanation
            </CardTitle>
            <CardDescription>AI-generated insights into your battery forecast.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{data.explanation}</p>
          </CardContent>
        </Card>
      )}

      {data.featureImportancePlotUri && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 size={24} className="text-primary" />
              Feature Importance
            </CardTitle>
            <CardDescription>Visualization of factors influencing the prediction.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={data.featureImportancePlotUri} 
              alt="Feature Importance Plot" 
              className="rounded-md border"
              data-ai-hint="chart graph"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
