'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrialForm } from '@/components/trials';
import { useCreateTrial } from '@/hooks/use-trials';
import { useWallet } from '@/hooks/use-wallet';

export default function CreateTrialPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const createTrial = useCreateTrial();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (data: { title: string; description: string; rewardUsd: number }) => {
    if (!address) return;

    try {
      await createTrial.mutateAsync({
        ...data,
        buyerId: address,
      });
      router.push('/trials');
    } catch (err) {
      console.error('Failed to create trial:', err);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Trial</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Trial</h1>
          <p className="text-muted-foreground mt-2">
            Post a new data collection trial
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Please connect your wallet to create a trial.
          </AlertDescription>
        </Alert>

        <Link href="/trials">
          <Button variant="outline">Back to Trials</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Trial</h1>
          <p className="text-muted-foreground mt-2">
            Post a new data collection trial
          </p>
        </div>
        <Link href="/trials">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <TrialForm
        onSubmit={handleSubmit}
        isSubmitting={createTrial.isPending}
        error={createTrial.error?.message}
      />
    </div>
  );
}
