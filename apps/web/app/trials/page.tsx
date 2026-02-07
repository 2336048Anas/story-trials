'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrialCard } from '@/components/trials';
import { useTrials } from '@/hooks/use-trials';

export default function TrialsPage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, error } = useTrials();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Trials</h1>
            <p className="text-muted-foreground mt-2">
              Research trials and data requests
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trials</h1>
          <p className="text-muted-foreground mt-2">
            Research trials and data requests
          </p>
        </div>
        <Link href="/trials/create">
          <Button>Create Trial</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load trials: {error.message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading trials...</div>
      ) : data?.trials && data.trials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.trials.map((trial) => (
            <TrialCard key={trial.id} trial={trial} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No open trials yet</p>
          <Link href="/trials/create">
            <Button variant="outline">Create the first trial</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
