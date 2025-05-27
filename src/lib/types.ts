
import { z } from 'zod';

export const BatteryStateEnum = z.enum(['Active', 'Idle', 'Sleep', 'Connected standby']);

export const BatteryInputSchema = z.object({
  state: BatteryStateEnum.describe('Current state of the laptop'),
  capacityPercentage: z.coerce.number().min(0).max(100).describe('Current battery capacity percentage (0-100)'),
  designCapacityMah: z.coerce.number().positive().describe('Original design capacity of the battery in mAh'),
  // drainedMwh: z.coerce.number().min(0).describe('Amount of energy drained/consumed from the battery in mWh'),
  durationSeconds: z.coerce.number().min(1).describe('Duration over which the energy was drained in seconds (min 1)'),
  currentEnergyMwh: z.coerce.number().min(0).describe('Current absolute energy in the battery in mWh'),
  fullChargeCapacityMah: z.coerce.number().positive().describe('Current full charge capacity of the battery in mAh'),
});

export type BatteryInput = z.infer<typeof BatteryInputSchema>;

export interface PredictionData {
  predictedTimeLeftSeconds?: number;
  error?: string;
}

export interface FormattedPrediction {
  hours: number;
  minutes: number;
  seconds: number;
  error?: string; // Added to handle potential formatting errors
}
