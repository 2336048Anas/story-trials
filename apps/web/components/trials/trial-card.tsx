'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Trial } from '@/types/api';

interface TrialCardProps {
  trial: Trial;
}

export function TrialCard({ trial }: TrialCardProps) {
  const rewardDollars = (trial.rewardUsd / 100).toFixed(2);
  const submissionCount = trial._count?.submissions ?? 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{trial.title}</CardTitle>
            <CardDescription className="mt-1">
              by {trial.buyer?.name || trial.buyer?.walletAddress?.slice(0, 8) + '...' || 'Unknown'}
            </CardDescription>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${trial.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {trial.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {trial.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{trial.description}</p>
        )}
        <div className="flex justify-between text-sm text-gray-500">
          <span>Reward: <span className="font-semibold text-gray-900">${rewardDollars}</span></span>
          <span>{submissionCount} submission{submissionCount !== 1 ? 's' : ''}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/trials/${trial.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
