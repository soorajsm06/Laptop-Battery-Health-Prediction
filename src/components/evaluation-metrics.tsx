'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award } from 'lucide-react';

const metrics = [
  { name: 'R² Score', value: '0.9998' },
  { name: 'Mean Absolute Error (MAE)', value: '40.46 sec' },
  { name: 'Root Mean Squared Error (RMSE)', value: '202.22 sec' },
  { name: 'Average Cross-Validation MAE (5-fold)', value: '39.99 sec' },
];

export function EvaluationMetrics() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award size={24} className="text-primary" />
          Model Performance Metrics
        </CardTitle>
        <CardDescription>Key evaluation scores for the underlying prediction model.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell className="text-right">{metric.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
