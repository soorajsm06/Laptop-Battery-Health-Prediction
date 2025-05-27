
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, CheckCircle, TrendingUp } from 'lucide-react';

const metrics = [
  { name: 'R² Score (Model Fit)', value: '0.9998', description: 'Indicates how well data fits the regression model (closer to 1 is better).' },
  { name: 'Mean Absolute Error (MAE)', value: '40.46 sec', description: 'Average magnitude of errors in predictions (lower is better).' },
  { name: 'Root Mean Squared Error (RMSE)', value: '202.22 sec', description: 'Standard deviation of prediction errors (lower is better, sensitive to outliers).' },
  { name: 'Avg. Cross-Validation MAE (5-fold)', value: '39.99 sec', description: 'Average MAE from 5-fold cross-validation, indicating generalization.' },
];

export function EvaluationMetrics() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center gap-2.5 text-xl font-semibold text-foreground/90">
          <Award size={24} className="text-primary" />
          Model Performance
        </CardTitle>
        <CardDescription>Key evaluation scores for the underlying prediction model.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6 pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[55%] text-muted-foreground">Metric</TableHead>
              <TableHead className="text-right text-muted-foreground">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.name} className="hover:bg-muted/50">
                <TableCell className="py-3.5">
                    <div className="font-medium text-foreground/90">{metric.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{metric.description}</div>
                </TableCell>
                <TableCell className="text-right font-semibold text-lg text-primary">{metric.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/40 px-6 py-4 border-t">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
            <TrendingUp size={18} className="text-green-600 dark:text-green-500" />
            <span>Model performance metrics indicate a high degree of accuracy and reliability.</span>
        </div>
      </CardFooter>
    </Card>
  );
}
