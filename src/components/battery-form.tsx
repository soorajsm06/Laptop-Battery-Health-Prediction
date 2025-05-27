
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
import { Laptop, BatteryCharging, BatteryFull, Zap, Timer, Bolt, BatteryPlus, Rocket } from 'lucide-react';

interface BatteryFormProps {
  onPredictionResult: (data: any) => void; // Callback to pass result to parent
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto text-base py-3 px-6" size="lg">
      <Rocket size={18} className="mr-2" />
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
  } = useForm<BatteryInput>({
    resolver: zodResolver(BatteryInputSchema),
    defaultValues: { 
      state: 'Active',
      capacityPercentage: 80,
      designCapacityMah: 42000,
      drainedMwh: 500,
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
          title: 'Forecast Successful',
          description: 'Prediction has been generated.',
          variant: 'default',
        });
      }
    }
  }, [state, onPredictionResult, toast]);
  
  return (
    <Card className="w-full max-w-3xl shadow-xl border-primary/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Enter Battery Metrics</CardTitle>
        <CardDescription>Provide your laptop's current battery data to get a forecast.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 p-6 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="state" className="flex items-center gap-1.5 text-sm font-medium"><Laptop size={15} className="text-muted-foreground" />State</Label>
            <Select defaultValue="Active" name="state" >
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

          <div className="space-y-1.5">
            <Label htmlFor="capacityPercentage" className="flex items-center gap-1.5 text-sm font-medium"><BatteryCharging size={15} className="text-muted-foreground" />Current Capacity (%)</Label>
            <Input id="capacityPercentage" type="number" {...register('capacityPercentage')} placeholder="e.g., 80" />
            {errors.capacityPercentage && <p className="text-xs text-destructive pt-1">{errors.capacityPercentage.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="currentEnergyMwh" className="flex items-center gap-1.5 text-sm font-medium"><Bolt size={15} className="text-muted-foreground" />Current Energy (mWh)</Label>
            <Input id="currentEnergyMwh" type="number" {...register('currentEnergyMwh')} placeholder="e.g., 30000" />
            {errors.currentEnergyMwh && <p className="text-xs text-destructive pt-1">{errors.currentEnergyMwh.message}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="drainedMwh" className="flex items-center gap-1.5 text-sm font-medium"><Zap size={15} className="text-muted-foreground" />Energy Drained (mWh)</Label>
            <Input id="drainedMwh" type="number" {...register('drainedMwh')} placeholder="e.g., 500" />
            {errors.drainedMwh && <p className="text-xs text-destructive pt-1">{errors.drainedMwh.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="durationSeconds" className="flex items-center gap-1.5 text-sm font-medium"><Timer size={15} className="text-muted-foreground" />Duration of Drain (s)</Label>
            <Input id="durationSeconds" type="number" {...register('durationSeconds')} placeholder="e.g., 3600 (for 1 hour)" />
            {errors.durationSeconds && <p className="text-xs text-destructive pt-1">{errors.durationSeconds.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="designCapacityMah" className="flex items-center gap-1.5 text-sm font-medium"><BatteryFull size={15} className="text-muted-foreground" />Design Capacity (mAh)</Label>
            <Input id="designCapacityMah" type="number" {...register('designCapacityMah')} placeholder="e.g., 42180" />
            {errors.designCapacityMah && <p className="text-xs text-destructive pt-1">{errors.designCapacityMah.message}</p>}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="fullChargeCapacityMah" className="flex items-center gap-1.5 text-sm font-medium"><BatteryPlus size={15} className="text-muted-foreground" />Full Charge Capacity (mAh)</Label>
            <Input id="fullChargeCapacityMah" type="number" {...register('fullChargeCapacityMah')} placeholder="e.g., 41000" />
            {errors.fullChargeCapacityMah && <p className="text-xs text-destructive pt-1">{errors.fullChargeCapacityMah.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 pb-6 px-6 border-t border-border mt-2">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
