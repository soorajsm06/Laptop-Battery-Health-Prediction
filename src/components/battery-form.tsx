
'use client';

import type { BatteryInput } from '@/lib/types';
import { BatteryInputSchema, BatteryStateEnum } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { predictBatteryLife } from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Laptop, BatteryCharging, BatteryFull, Zap, Timer, Bolt, BatteryPlus, Rocket, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatteryFormProps {
  onPredictionResult: (data: any) => void; // Callback to pass result to parent
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={cn(
        "w-full sm:w-auto text-base py-3 px-8 transition-all duration-300 ease-in-out transform hover:scale-105 focus-visible:ring-2",
        pending 
          ? "bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-400 text-white" 
          : "text-primary-foreground" // bg-primary is default from Button variant, text-primary-foreground ensures correct text color
      )}
      size="lg"
    >
      <Rocket 
        size={20} 
        className={cn(
            "mr-2.5",
            pending && "animate-pulse"
        )} 
      />
      {pending ? 'Forecasting...' : 'Forecast Battery Life'}
    </Button>
  );
}

export function BatteryForm({ onPredictionResult }: BatteryFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(predictBatteryLife, null);

  const {
    register,
    formState: { errors },
    setValue, // Used to set Select value for react-hook-form
  } = useForm<BatteryInput>({
    resolver: zodResolver(BatteryInputSchema),
    defaultValues: { 
      state: BatteryStateEnum.options[0], // Default to 'Active'
      capacityPercentage: 80,
      designCapacityMah: 42000,
      durationSeconds: 3600,
      currentEnergyMwh: 30000,
      fullChargeCapacityMah: 40000,
    },
  });

  useEffect(() => {
    if (state) {
      onPredictionResult(state);
      if (state.error) {
        toast({
          title: 'Error Submitting Form',
          description: state.error,
          variant: 'destructive',
        });
      } else if (state.predictedTimeLeftSeconds !== undefined) {
        toast({
          title: 'Forecast Successful!',
          description: 'Prediction has been generated and displayed.',
          variant: 'default', 
          action: <CheckCircle className="text-green-500" />, 
        });
      }
    }
  }, [state, onPredictionResult, toast]);
  
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Enter Battery Metrics</CardTitle>
        <CardDescription>Provide your laptop&apos;s current battery data to get a forecast.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 p-6 pt-3">
          <div className="space-y-2">
            <Label htmlFor="state" className="flex items-center gap-1.5 text-sm font-medium"><Laptop size={16} className="text-muted-foreground" />State</Label>
            <Select 
              defaultValue={BatteryStateEnum.options[0]} 
              name="state"
              onValueChange={(value) => setValue('state', value as BatteryInput['state'])}
            >
              <SelectTrigger id="state" className="w-full">
                <SelectValue placeholder="Select battery state" />
              </SelectTrigger>
              <SelectContent>
                {BatteryStateEnum.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-xs text-destructive pt-1">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacityPercentage" className="flex items-center gap-1.5 text-sm font-medium"><BatteryCharging size={16} className="text-muted-foreground" />Current Capacity (%)</Label>
            <Input id="capacityPercentage" type="number" {...register('capacityPercentage')} placeholder="e.g., 80" />
            {errors.capacityPercentage && <p className="text-xs text-destructive pt-1">{errors.capacityPercentage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentEnergyMwh" className="flex items-center gap-1.5 text-sm font-medium"><Bolt size={16} className="text-muted-foreground" />Current Energy (mWh)</Label>
            <Input id="currentEnergyMwh" type="number" {...register('currentEnergyMwh')} placeholder="e.g., 30000" />
            {errors.currentEnergyMwh && <p className="text-xs text-destructive pt-1">{errors.currentEnergyMwh.message}</p>}
          </div>
          
          {/* <div className="space-y-2">
            <Label htmlFor="drainedMwh" className="flex items-center gap-1.5 text-sm font-medium"><Zap size={16} className="text-muted-foreground" />Energy Drained (mWh)</Label>
            <Input id="drainedMwh" type="number" {...register('drainedMwh')} placeholder="e.g., 500" />
            {errors.drainedMwh && <p className="text-xs text-destructive pt-1">{errors.drainedMwh.message}</p>}
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="durationSeconds" className="flex items-center gap-1.5 text-sm font-medium"><Timer size={16} className="text-muted-foreground" />Duration of Drain (s)</Label>
            <Input id="durationSeconds" type="number" {...register('durationSeconds')} placeholder="e.g., 3600 (for 1 hour)" />
            {errors.durationSeconds && <p className="text-xs text-destructive pt-1">{errors.durationSeconds.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designCapacityMah" className="flex items-center gap-1.5 text-sm font-medium"><BatteryFull size={16} className="text-muted-foreground" />Design Capacity (mAh)</Label>
            <Input id="designCapacityMah" type="number" {...register('designCapacityMah')} placeholder="e.g., 42180" />
            {errors.designCapacityMah && <p className="text-xs text-destructive pt-1">{errors.designCapacityMah.message}</p>}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="fullChargeCapacityMah" className="flex items-center gap-1.5 text-sm font-medium"><BatteryPlus size={16} className="text-muted-foreground" />Full Charge Capacity (mAh)</Label>
            <Input id="fullChargeCapacityMah" type="number" {...register('fullChargeCapacityMah')} placeholder="e.g., 41000" />
            {errors.fullChargeCapacityMah && <p className="text-xs text-destructive pt-1">{errors.fullChargeCapacityMah.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-5 pb-6 px-6 border-t mt-2">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
