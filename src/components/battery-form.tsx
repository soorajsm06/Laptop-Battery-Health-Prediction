'use client';

import type { BatteryInput } from '@/lib/types';
import { BatteryInputSchema, BatteryStateEnum } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // For displaying errors, if needed
import { predictBatteryLife } from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Laptop, BatteryCharging, BatteryFull, Zap, Timer, Bolt, BatteryPlus, AlertCircle } from 'lucide-react';

interface BatteryFormProps {
  onPredictionResult: (data: any) => void; // Callback to pass result to parent
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Forecasting...' : 'Forecast Battery Life'}
    </Button>
  );
}

export function BatteryForm({ onPredictionResult }: BatteryFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(predictBatteryLife, null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BatteryInput>({
    resolver: zodResolver(BatteryInputSchema),
    defaultValues: { // Provide sensible defaults
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
          title: 'Error',
          description: state.error,
          variant: 'destructive',
        });
      }
    }
  }, [state, onPredictionResult, toast]);
  
  // Set initial values for Select component, as it's controlled by react-hook-form's Controller
  // This is just an example of one way to handle Select with RHF.
  // For this specific ShadCN Select, direct register might work or a Controller is more robust.
  // Given we use server actions, the default react-hook-form `handleSubmit` isn't used for submission,
  // but it's good for client-side validation.
  // However, with useFormState, we rely more on server-side validation after submission.

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Enter Battery Information</CardTitle>
        <CardDescription>Provide your laptop's current battery metrics to get a forecast.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="state" className="flex items-center gap-2"><Laptop size={16} />State</Label>
            <Select defaultValue="Active" name="state">
              <SelectTrigger id="state">
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
            {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacityPercentage" className="flex items-center gap-2"><BatteryCharging size={16} />Current Capacity (%)</Label>
            <Input id="capacityPercentage" type="number" {...register('capacityPercentage')} placeholder="e.g., 80" />
            {errors.capacityPercentage && <p className="text-sm text-destructive">{errors.capacityPercentage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentEnergyMwh" className="flex items-center gap-2"><Bolt size={16} />Current Energy (mWh)</Label>
            <Input id="currentEnergyMwh" type="number" {...register('currentEnergyMwh')} placeholder="e.g., 30000" />
            {errors.currentEnergyMwh && <p className="text-sm text-destructive">{errors.currentEnergyMwh.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drainedMwh" className="flex items-center gap-2"><Zap size={16} />Energy Drained/Consumed (mWh)</Label>
            <Input id="drainedMwh" type="number" {...register('drainedMwh')} placeholder="e.g., 500" />
            {errors.drainedMwh && <p className="text-sm text-destructive">{errors.drainedMwh.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationSeconds" className="flex items-center gap-2"><Timer size={16} />Duration of Drain (s)</Label>
            <Input id="durationSeconds" type="number" {...register('durationSeconds')} placeholder="e.g., 3600 (for 1 hour)" />
            {errors.durationSeconds && <p className="text-sm text-destructive">{errors.durationSeconds.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designCapacityMah" className="flex items-center gap-2"><BatteryFull size={16} />Design Capacity (mAh)</Label>
            <Input id="designCapacityMah" type="number" {...register('designCapacityMah')} placeholder="e.g., 42180" />
            {errors.designCapacityMah && <p className="text-sm text-destructive">{errors.designCapacityMah.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullChargeCapacityMah" className="flex items-center gap-2"><BatteryPlus size={16} />Full Charge Capacity (mAh)</Label>
            <Input id="fullChargeCapacityMah" type="number" {...register('fullChargeCapacityMah')} placeholder="e.g., 41000" />
            {errors.fullChargeCapacityMah && <p className="text-sm text-destructive">{errors.fullChargeCapacityMah.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
