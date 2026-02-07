'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/use-wallet';
import { useUserProfile } from '@/hooks/use-user';
import { useLicenses } from '@/hooks/use-licenses';

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === 'ISSUED'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors}`}>
      {status}
    </span>
  );
}

export default function LicensesPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useWallet();
  const { data: profileData } = useUserProfile(address);
  const userId = profileData?.user?.id;
  const { data, isLoading, error } = useLicenses(userId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Licenses</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Licenses</h1>
        <Alert>
          <AlertDescription>
            Please connect your wallet to view your licenses.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const licenses = data?.licenses ?? [];

  const issuedCount = licenses.filter((l) => l.status === 'ISSUED').length;
  const revokedCount = licenses.filter((l) => l.status === 'REVOKED').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Licenses</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your data asset licenses
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Browse Assets</Button>
        </Link>
      </div>

      <Alert>
        <AlertDescription>
          SYNTHETIC DATA ONLY - These licenses are for demonstration purposes. No real licensing transactions have occurred.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Licenses</CardDescription>
            <CardTitle className="text-3xl">{licenses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{issuedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">issued licenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revoked</CardDescription>
            <CardTitle className="text-3xl">{revokedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">revoked licenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Licenses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Licenses</CardTitle>
          <CardDescription>
            Licenses you have acquired for data assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading licenses...</p>
          ) : error ? (
            <p className="text-destructive">
              Failed to load licenses: {error.message}
            </p>
          ) : licenses.length > 0 ? (
            <div className="space-y-3">
              {licenses.map((license) => (
                <div
                  key={license.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {license.asset?.title ?? 'Unknown Asset'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Licensed on{' '}
                      {new Date(license.createdAt).toLocaleDateString()}
                      {license.expiresAt && (
                        <>
                          {' '}
                          · Expires{' '}
                          {new Date(license.expiresAt).toLocaleDateString()}
                        </>
                      )}
                    </p>
                    {license.asset?.owner && (
                      <p className="text-xs text-muted-foreground">
                        Owner:{' '}
                        {license.asset.owner.name ||
                          `${license.asset.owner.walletAddress?.slice(0, 6)}...${license.asset.owner.walletAddress?.slice(-4)}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={license.status} />
                    {license.asset && (
                      <Link href={`/assets/${license.asset.id}`}>
                        <Button variant="ghost" size="sm">
                          View Asset
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No licenses yet.{' '}
              <Link href="/" className="text-primary underline">
                Browse the marketplace
              </Link>{' '}
              to license data assets.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
