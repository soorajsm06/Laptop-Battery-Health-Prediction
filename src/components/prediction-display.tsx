'use client';

import type { PredictionData, FormattedPrediction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock } from 'lucide-react';
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
    // Error display handled by toast in BatteryForm or can be shown here
     return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Prediction Error</AlertTitle>
        <AlertDescription>{data.error}</AlertDescription>
      </Alert>
    );
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
            <CardDescription>Estimated time until battery is fully drained based on your model's prediction.</CardDescription>
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
    </div>
  );
}
