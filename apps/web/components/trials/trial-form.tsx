'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TrialFormProps {
  onSubmit: (data: { title: string; description: string; rewardUsd: number }) => void;
  isSubmitting: boolean;
  error?: string;
}

export function TrialForm({ onSubmit, isSubmitting, error }: TrialFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rewardCents = Math.round(parseFloat(reward) * 100);
    onSubmit({ title, description, rewardUsd: rewardCents });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Trial</CardTitle>
          <CardDescription>
            Post a data collection trial for contributors to participate in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Trial Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Medical Image Dataset Collection"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what data you're looking for and any requirements..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Reward Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="reward"
                type="number"
                step="0.01"
                min="0"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="0.00"
                className="pl-7"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Synthetic demonstration value only - no real payments occur
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create Trial'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
