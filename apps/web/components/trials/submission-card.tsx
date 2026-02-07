'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Submission } from '@/types/api';

interface SubmissionCardProps {
  submission: Submission;
  isBuyer: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  isUpdating?: boolean;
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export function SubmissionCard({
  submission,
  isBuyer,
  onApprove,
  onReject,
  isUpdating,
}: SubmissionCardProps) {
  const submitterName =
    submission.user?.name ||
    submission.user?.walletAddress?.slice(0, 8) + '...' ||
    'Unknown';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Submission from {submitterName}</CardTitle>
            <CardDescription>
              {new Date(submission.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[submission.status]}`}>
            {submission.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-500">Data CID:</span>
            <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
              {submission.dataCid.slice(0, 20)}...
            </code>
          </div>
          {submission.asset && (
            <div>
              <span className="text-gray-500">Linked Asset:</span>
              <span className="ml-2">{submission.asset.title}</span>
            </div>
          )}
        </div>
      </CardContent>
      {isBuyer && submission.status === 'PENDING' && (
        <CardFooter className="gap-2">
          <Button
            onClick={onApprove}
            disabled={isUpdating}
            className="flex-1"
          >
            {isUpdating ? 'Processing...' : 'Approve'}
          </Button>
          <Button
            variant="outline"
            onClick={onReject}
            disabled={isUpdating}
            className="flex-1"
          >
            {isUpdating ? 'Processing...' : 'Reject'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
