'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useAssets } from '@/hooks/use-assets';
import type { DataAsset } from '@/types/api';

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useAssets();
  const assets: DataAsset[] = data?.assets || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return assets;
    const q = search.toLowerCase();
    return assets.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }, [assets, search]);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Browse registered health data assets
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Browse registered health data assets
          </p>
        </div>
        <Link href="/assets/create">
          <Button>Register Asset</Button>
        </Link>
      </div>

      <Alert>
        <AlertDescription>
          Assets shown here use synthetic data for demonstration purposes only.
        </AlertDescription>
      </Alert>

      <Input
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

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
      ) : filtered.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {assets.length === 0
                ? 'No assets registered yet'
                : 'No matching assets'}
            </CardTitle>
            <CardDescription>
              {assets.length === 0
                ? 'Be the first to register a data asset on the platform'
                : 'Try adjusting your search query'}
            </CardDescription>
          </CardHeader>
          {assets.length === 0 && (
            <CardContent>
              <Link href="/assets/create">
                <Button>Create Your First Asset</Button>
              </Link>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <Link key={asset.id} href={`/assets/${asset.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
