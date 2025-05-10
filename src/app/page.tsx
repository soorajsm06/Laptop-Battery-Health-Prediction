'use client';

import { useState } from 'react';
import { BatteryForm } from '@/components/battery-form';
import { PredictionDisplay } from '@/components/prediction-display';
import { EvaluationMetrics } from '@/components/evaluation-metrics';
import type { PredictionData } from '@/lib/types';
import { BatteryCharging, BarChartHorizontalBig, BookOpenCheck, Activity } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);

  const handlePredictionResult = (data: PredictionData) => {
    setPredictionResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-4 sm:p-8">
      <header className="w-full max-w-5xl mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M20 11H4C3.44772 11 3 11.4477 3 12V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V12C21 11.4477 20.5523 11 20 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 7V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Laptop Battery Forecaster
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Input your laptop's battery details to get a life expectancy forecast from your model.
        </p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="lg:col-span-1 flex flex-col space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BatteryCharging size={28} className="text-accent" />
              Battery Input
            </h2>
            <BatteryForm onPredictionResult={handlePredictionResult} />
          </div>
          
          <div>
             <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BookOpenCheck size={28} className="text-accent" />
              Model Evaluation
            </h2>
            <EvaluationMetrics />
          </div>
        </section>

        <section className="lg:col-span-1">
          {predictionResult ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Activity size={28} className="text-accent" />
                Forecast Result
              </h2>
              <PredictionDisplay data={predictionResult} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg h-full bg-card">
              <Image 
                src="https://picsum.photos/seed/batteryforecast/400/300" 
                alt="Awaiting input" 
                width={200} 
                height={150} 
                className="rounded-lg mb-4 opacity-70"
                data-ai-hint="laptop battery"
              />
              <h3 className="text-xl font-medium text-muted-foreground">Awaiting Battery Data</h3>
              <p className="text-muted-foreground">
                Enter your battery information to see the forecast.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="w-full max-w-5xl mt-12 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Laptop Battery Forecaster.
        </p>
      </footer>
    </div>
  );
}
