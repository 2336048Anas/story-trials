'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="text-4xl font-bold">Story Trials</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-20 space-y-10">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Story Trials</h1>
        <p className="text-lg text-muted-foreground">
          A decentralized marketplace for health data assets, powered by Story Protocol.
          Register data, participate in clinical trials, and earn rewards.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 w-full max-w-2xl">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Marketplace</CardTitle>
            <CardDescription>
              Browse and discover registered health data assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/marketplace">
              <Button className="w-full">Browse Assets</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Clinical Trials</CardTitle>
            <CardDescription>
              View open trials and submit your data to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/trials">
              <Button className="w-full" variant="outline">View Trials</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
