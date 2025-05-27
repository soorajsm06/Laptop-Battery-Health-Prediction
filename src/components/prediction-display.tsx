
'use client';

import type { PredictionData, FormattedPrediction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock, Zap } from 'lucide-react';

interface PredictionDisplayProps {
  data: PredictionData | null;
}

function formatTime(totalSeconds: number): FormattedPrediction {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return { hours: 0, minutes: 0, seconds: 0, error: "Invalid time value" };
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { hours, minutes, seconds };
}

export function PredictionDisplay({ data }: PredictionDisplayProps) {
  if (!data) {
    return null; // Or a loading/default state if preferred
  }

  if (data.error) {
     return (
      <Alert variant="destructive" className="mt-0 shadow-md border-destructive/70">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Prediction Error</AlertTitle>
        <AlertDescription className="text-sm">{data.error}</AlertDescription>
      </Alert>
    );
  }

  const formattedTime = data.predictedTimeLeftSeconds !== undefined ? formatTime(data.predictedTimeLeftSeconds) : null;

  if (formattedTime?.error) {
    return (
      <Alert variant="destructive" className="mt-0 shadow-md border-destructive/70">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Display Error</AlertTitle>
        <AlertDescription className="text-sm">{formattedTime.error}. Received: {data.predictedTimeLeftSeconds}</AlertDescription>
      </Alert>
    );
  }


  return (
    <div className="space-y-6 w-full">
      {formattedTime && (
        <Card className="shadow-xl border-primary/20 overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
              <Clock size={26} />
              Predicted Time Left
            </CardTitle>
            <CardDescription>
              Estimated time until battery depletion based on your model's prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="my-4">
              <span className="text-5xl font-bold text-primary tracking-tight">
                {String(formattedTime.hours).padStart(2, '0')}
              </span>
              <span className="text-3xl font-semibold text-muted-foreground mx-1">:</span>
              <span className="text-5xl font-bold text-primary tracking-tight">
                {String(formattedTime.minutes).padStart(2, '0')}
              </span>
              <span className="text-3xl font-semibold text-muted-foreground mx-1">:</span>
              <span className="text-5xl font-bold text-primary tracking-tight">
                {String(formattedTime.seconds).padStart(2, '0')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              (Total: {data.predictedTimeLeftSeconds?.toFixed(0)} seconds)
            </p>
          </CardContent>
           <div className="bg-primary/5 px-6 py-3 border-t border-primary/10 text-xs text-primary/80 flex items-center justify-center gap-2">
            <Zap size={14} />
            <span>Powered by your custom forecasting model</span>
           </div>
        </Card>
      )}
    </div>
  );
}

