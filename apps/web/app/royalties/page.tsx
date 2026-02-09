'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/use-wallet';
import { useUserProfile } from '@/hooks/use-user';
import { useRoyalties, usePayouts } from '@/hooks/use-royalties';
import type { RoyaltyEvent, Payout } from '@/types/api';

const EXPLORER_BASE = 'https://aeneid.storyscan.io';

function isRealHash(hash: string | undefined | null): boolean {
  return !!hash && !hash.startsWith('0xmocktx') && !hash.startsWith('mock-');
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === 'PAID' ? 'default' : status === 'FAILED' ? 'destructive' : 'secondary';
  return <Badge variant={variant}>{status}</Badge>;
}

export default function RoyaltiesPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useWallet();

  const { data: profileData } = useUserProfile(address);
  const userId = profileData?.user?.id;

  const { data: royaltiesData, isLoading: royaltiesLoading } = useRoyalties(userId);
  const { data: payoutsData, isLoading: payoutsLoading } = usePayouts(userId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Royalties</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Royalties</h1>
        <Alert>
          <AlertDescription>
            Please connect your wallet to view your royalties.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const royalties: RoyaltyEvent[] = royaltiesData?.royalties ?? [];
  const payouts: Payout[] = payoutsData?.payouts ?? [];

  const totalEarned = royalties.reduce((sum, r) => sum + r.amount, 0);
  const paidOut = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const pending = totalEarned - paidOut;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Royalties</h1>
        <p className="text-muted-foreground mt-2">
          Track your royalty earnings and payout history.
        </p>
      </div>

      <Alert>
        <AlertDescription>
          SYNTHETIC DATA ONLY - All amounts shown are for demonstration purposes.
          No real financial transactions have occurred.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earned</CardDescription>
            <CardTitle className="text-3xl">{formatCents(totalEarned)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {royalties.length} royalty event{royalties.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{formatCents(pending)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">awaiting payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Out</CardDescription>
            <CardTitle className="text-3xl">{formatCents(paidOut)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {payouts.filter((p) => p.status === 'PAID').length} payout{payouts.filter((p) => p.status === 'PAID').length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Royalty Events */}
      <Card>
        <CardHeader>
          <CardTitle>Royalty Events</CardTitle>
          <CardDescription>Earnings from licensed assets</CardDescription>
        </CardHeader>
        <CardContent>
          {royaltiesLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : royalties.length > 0 ? (
            <div className="space-y-3">
              {royalties.map((royalty) => (
                <div
                  key={royalty.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {royalty.license?.asset?.title ?? 'Unknown Asset'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      License: {royalty.licenseId.slice(0, 8)}...
                      {royalty.note ? ` - ${royalty.note}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(royalty.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-semibold">{formatCents(royalty.amount)}</span>
                    {royalty.payout ? (
                      <StatusBadge status={royalty.payout.status} />
                    ) : (
                      <Badge variant="outline">Unpaid</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No royalty events yet. Earnings will appear here when your licensed assets generate revenue.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>Payments sent to you</CardDescription>
        </CardHeader>
        <CardContent>
          {payoutsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : payouts.length > 0 ? (
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{formatCents(payout.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.events?.length ?? 0} royalty event{(payout.events?.length ?? 0) !== 1 ? 's' : ''} included
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payout.createdAt).toLocaleDateString()}
                      {payout.reference && (
                        <>
                          {' - '}
                          {isRealHash(payout.reference) ? (
                            <>
                              Tx:{' '}
                              <a
                                href={`${EXPLORER_BASE}/tx/${payout.reference}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-mono"
                              >
                                {payout.reference.slice(0, 10)}...{payout.reference.slice(-8)}
                              </a>
                            </>
                          ) : (
                            <>Ref: {payout.reference}</>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={payout.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No payouts yet. Payouts will appear here once royalties are processed.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
