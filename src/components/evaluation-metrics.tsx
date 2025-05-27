
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, CheckCircle } from 'lucide-react';

const metrics = [
  { name: 'R² Score (Model Fit)', value: '0.9998', description: 'Indicates how well data fits the regression model.' },
  { name: 'Mean Absolute Error (MAE)', value: '40.46 sec', description: 'Average magnitude of errors in a set of predictions.' },
  { name: 'Root Mean Squared Error (RMSE)', value: '202.22 sec', description: 'Standard deviation of the prediction errors.' },
  { name: 'Avg. Cross-Validation MAE (5-fold)', value: '39.99 sec', description: 'Average MAE from 5-fold cross-validation.' },
];

export function EvaluationMetrics() {
  return (
    <Card className="shadow-xl border-primary/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-xl font-semibold">
          <Award size={24} className="text-primary" />
          Model Performance
        </CardTitle>
        <CardDescription>Key evaluation scores for the underlying prediction model.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.name} className="hover:bg-muted/30">
                <TableCell className="py-3">
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-xs text-muted-foreground/80">{metric.description}</div>
                </TableCell>
                <TableCell className="text-right font-medium text-primary">{metric.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
        <CardHeader className="pt-4 pb-4">
             <div className="flex items-center text-sm text-muted-foreground gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Model performance is excellent for this dataset.</span>
            </div>
        </CardHeader>
    </Card>
  );
}
