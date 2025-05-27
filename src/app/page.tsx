
'use client';

import { useState, useEffect } from 'react';
import { BatteryForm } from '@/components/battery-form';
import { PredictionDisplay } from '@/components/prediction-display';
import { EvaluationMetrics } from '@/components/evaluation-metrics';
import type { PredictionData } from '@/lib/types';
import { BatteryCharging, BarChartHorizontalBig, BookOpenCheck, Activity, Power } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePredictionResult = (data: PredictionData) => {
    setPredictionResult(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-6 sm:p-10">
      <header className="w-full max-w-6xl mb-10 pb-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-3">
           <div className="p-3 bg-primary/10 rounded-full">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M20 11H4C3.44772 11 3 11.4477 3 12V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V12C21 11.4477 20.5523 11 20 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 7V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
           </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight text-center sm:text-left">
            Laptop Battery Forecaster
          </h1>
        </div>
        <p className="text-md sm:text-lg text-muted-foreground text-center sm:text-left max-w-2xl mx-auto sm:mx-0">
          Input your laptop's current battery metrics to receive a detailed forecast of its remaining life, powered by your custom model.
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 flex flex-col space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <BatteryCharging size={26} className="text-accent" />
              Battery Input
            </h2>
            <BatteryForm onPredictionResult={handlePredictionResult} />
          </div>
          
          <div>
             <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <BookOpenCheck size={26} className="text-accent" />
              Model Evaluation Insights
            </h2>
            <EvaluationMetrics />
          </div>
        </section>

        <section className="lg:col-span-2">
           <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <Activity size={26} className="text-accent" />
                Forecast Result
            </h2>
          {predictionResult && !predictionResult.error ? (
            <PredictionDisplay data={predictionResult} />
          ) : (
            <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/70 rounded-lg h-full bg-card/50 min-h-[300px] shadow-md">
              <Image 
                src="https://placehold.co/400x300.png" 
                alt="Awaiting battery input" 
                width={180} 
                height={135} 
                className="rounded-lg mb-6 opacity-60"
                data-ai-hint="data analytics"
              />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">Awaiting Battery Data</h3>
              <p className="text-sm text-muted-foreground/80 max-w-xs">
                Enter your laptop's battery information on the left to see the life expectancy forecast.
              </p>
              {predictionResult?.error && (
                <div className="mt-6 w-full">
                  <PredictionDisplay data={predictionResult} />
                </div>
              )}
            </Card>
          )}
        </section>
      </main>

      <footer className="w-full max-w-6xl mt-16 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {isClient ? new Date().getFullYear() : '2024'} Laptop Battery Forecaster. Precision insights for your power needs.
        </p>
      </footer>
    </div>
  );
}
