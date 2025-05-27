
'use client';

import type { PredictionData, FormattedPrediction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock, Zap, Info } from 'lucide-react';

interface PredictionDisplayProps {
  data: PredictionData | null;
}

function formatTime(totalSeconds: number): FormattedPrediction {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return { hours: 0, minutes: 0, seconds: 0, error: "Invalid time value received from model." };
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { hours, minutes, seconds };
}

export function PredictionDisplay({ data }: PredictionDisplayProps) {
  if (!data) {
    // This case should ideally be handled by the parent showing a placeholder
    return null; 
  }

  if (data.error) {
     return (
      <Alert variant="destructive" className="shadow-md border-destructive/70">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Prediction Error</AlertTitle>
        <AlertDescription className="text-sm leading-relaxed">{data.error}</AlertDescription>
      </Alert>
    );
  }

  const formattedTime = data.predictedTimeLeftSeconds !== undefined ? formatTime(data.predictedTimeLeftSeconds) : null;

  if (formattedTime?.error) {
    return (
      <Alert variant="destructive" className="shadow-md border-destructive/70">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="font-semibold">Display Error</AlertTitle>
        <AlertDescription className="text-sm leading-relaxed">{formattedTime.error} (Received: {data.predictedTimeLeftSeconds})</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {formattedTime && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-primary">
              <Clock size={24} />
              Predicted Time Left
            </CardTitle>
            <CardDescription className="text-sm">
              Estimated time until battery depletion.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <div className="my-4">
              <span className="text-6xl font-bold text-primary tracking-tight">
                {String(formattedTime.hours).padStart(2, '0')}
              </span>
              <span className="text-4xl font-semibold text-muted-foreground mx-1.5">:</span>
              <span className="text-6xl font-bold text-primary tracking-tight">
                {String(formattedTime.minutes).padStart(2, '0')}
              </span>
              <span className="text-4xl font-semibold text-muted-foreground mx-1.5">:</span>
              <span className="text-6xl font-bold text-primary tracking-tight">
                {String(formattedTime.seconds).padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Hours : Minutes : Seconds
            </p>
             <p className="text-sm text-muted-foreground mt-3">
              (Total: {data.predictedTimeLeftSeconds?.toFixed(0)} seconds)
            </p>
          </CardContent>
           <CardFooter className="bg-muted/40 px-6 py-3 border-t text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Info size={14} />
            <span>Powered by your custom forecasting model.</span>
           </CardFooter>
        </Card>
      )}
    </div>
  );
}
