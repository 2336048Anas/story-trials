'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SubmissionCard, SubmissionForm } from '@/components/trials';
import {
  useTrial,
  useSubmissions,
  useCreateSubmission,
  useUpdateSubmission,
  useUpdateTrial,
} from '@/hooks/use-trials';
import { useWallet } from '@/hooks/use-wallet';

export default function TrialDetailPage() {
  const params = useParams();
  const trialId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useWallet();

  const { data: trialData, isLoading: trialLoading, error: trialError } = useTrial(trialId);
  const { data: submissionsData, isLoading: submissionsLoading } = useSubmissions(trialId);
  const createSubmission = useCreateSubmission();
  const updateSubmission = useUpdateSubmission();
  const updateTrial = useUpdateTrial();

  useEffect(() => {
    setMounted(true);
  }, []);

  const trial = trialData?.trial;
  const submissions = submissionsData?.submissions ?? [];

  const isBuyer = address && trial?.buyerId === address;
  const rewardDollars = trial ? (trial.rewardUsd / 100).toFixed(2) : '0.00';

  const handleSubmit = async (data: { dataCid: string; assetId?: string }) => {
    if (!address) return;

    await createSubmission.mutateAsync({
      trialId,
      data: {
        userId: address,
        dataCid: data.dataCid,
        assetId: data.assetId,
      },
    });
  };

  const handleApprove = (submissionId: string) => {
    updateSubmission.mutate({
      trialId,
      submissionId,
      data: { status: 'APPROVED' },
    });
  };

  const handleReject = (submissionId: string) => {
    updateSubmission.mutate({
      trialId,
      submissionId,
      data: { status: 'REJECTED' },
    });
  };

  const handleCloseTrial = () => {
    updateTrial.mutate({
      id: trialId,
      data: { isOpen: false },
    });
  };

  if (!mounted || trialLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trial Details</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (trialError || !trial) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trial Not Found</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            {trialError?.message || 'This trial does not exist.'}
          </AlertDescription>
        </Alert>
        <Link href="/trials">
          <Button variant="outline">Back to Trials</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{trial.title}</h1>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                trial.isOpen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {trial.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">
            by {trial.buyer?.name || trial.buyer?.walletAddress?.slice(0, 8) + '...' || 'Unknown'}
          </p>
        </div>
        <Link href="/trials">
          <Button variant="outline">Back to Trials</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trial Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trial.description && (
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-1">Description</h4>
              <p>{trial.description}</p>
            </div>
          )}
          <div className="flex gap-8">
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-1">Reward</h4>
              <p className="text-2xl font-bold">${rewardDollars}</p>
              <p className="text-xs text-gray-400">Synthetic value only</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500 mb-1">Submissions</h4>
              <p className="text-2xl font-bold">{submissions.length}</p>
            </div>
          </div>
          {isBuyer && trial.isOpen && (
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={handleCloseTrial}
                disabled={updateTrial.isPending}
              >
                {updateTrial.isPending ? 'Closing...' : 'Close Trial'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!isBuyer && trial.isOpen && isConnected && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Submit Data</h2>
          <SubmissionForm
            onSubmit={handleSubmit}
            isSubmitting={createSubmission.isPending}
            error={createSubmission.error?.message}
          />
        </div>
      )}

      {!isConnected && trial.isOpen && (
        <Alert>
          <AlertDescription>
            Connect your wallet to submit data to this trial.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Submissions ({submissions.length})
        </h2>

        {submissionsLoading ? (
          <p className="text-gray-500">Loading submissions...</p>
        ) : submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isBuyer={!!isBuyer}
                onApprove={() => handleApprove(submission.id)}
                onReject={() => handleReject(submission.id)}
                isUpdating={updateSubmission.isPending}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No submissions yet. Be the first to contribute!
          </p>
        )}
      </div>
    </div>
  );
}
