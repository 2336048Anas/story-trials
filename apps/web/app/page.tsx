'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssets } from '@/hooks/use-assets';

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, error } = useAssets();
  const assets = data?.assets || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Browse registered health data assets
          </p>
        </div>
        <Alert>
          <AlertDescription>
            Assets shown here use synthetic data for demonstration purposes only.
          </AlertDescription>
        </Alert>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground mt-2">
          Browse registered health data assets
        </p>
      </div>

      <Alert>
        <AlertDescription>
          Assets shown here use synthetic data for demonstration purposes only.
        </AlertDescription>
      </Alert>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load assets. Please try again.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No assets registered yet</CardTitle>
            <CardDescription>
              Be the first to register a data asset on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/assets/create">
              <Button>Create Your First Asset</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset: any) => (
            <Card key={asset.id}>
              <CardHeader>
                <CardTitle>{asset.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {asset.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Owner:</span>{' '}
                  <span className="font-mono text-xs">
                    {asset.owner?.walletAddress
                      ? `${asset.owner.walletAddress.slice(0, 6)}...${asset.owner.walletAddress.slice(-4)}`
                      : 'Unknown'}
                  </span>
                </div>
                {asset.ipAssetId && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Story Protocol:</span>{' '}
                    <span className="font-mono text-xs">{asset.ipAssetId.slice(0, 10)}...</span>
                  </div>
                )}
                {asset.storyChainId && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Network:</span>{' '}
                    <span>Chain {asset.storyChainId}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
