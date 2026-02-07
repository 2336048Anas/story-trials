'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/use-wallet';
import {
  useUserProfile,
  useUserAssets,
  useUserTrials,
  useUserSubmissions,
} from '@/hooks/use-user';
import { useRoyalties, usePayouts } from '@/hooks/use-royalties';
import { useLicenses } from '@/hooks/use-licenses';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useWallet();

  const { data: profileData } = useUserProfile(address);
  const { data: assetsData, isLoading: assetsLoading } = useUserAssets(address);
  const { data: trialsData, isLoading: trialsLoading } = useUserTrials(address);
  const { data: submissionsData, isLoading: submissionsLoading } = useUserSubmissions(address);

  const userId = profileData?.user?.id;
  const { data: royaltiesData } = useRoyalties(userId);
  const { data: payoutsData } = usePayouts(userId);
  const { data: licensesData, isLoading: licensesLoading } = useLicenses(userId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Alert>
          <AlertDescription>
            Please connect your wallet to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const assets = assetsData?.assets ?? [];
  const trials = trialsData?.trials ?? [];
  const submissions = submissionsData?.submissions ?? [];

  const openTrials = trials.filter((t) => t.isOpen).length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING').length;
  const approvedSubmissions = submissions.filter((s) => s.status === 'APPROVED').length;

  const royalties = royaltiesData?.royalties ?? [];
  const payoutsList = payoutsData?.payouts ?? [];
  const totalRoyalties = royalties.reduce((sum, r) => sum + r.amount, 0);
  const paidOutAmount = payoutsList
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const licenses = licensesData?.licenses ?? [];
  const activeLicenses = licenses.filter((l) => l.status === 'ISSUED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>My Assets</CardDescription>
            <CardTitle className="text-3xl">{assets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>My Trials</CardDescription>
            <CardTitle className="text-3xl">{trials.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{openTrials} open</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>My Submissions</CardDescription>
            <CardTitle className="text-3xl">{submissions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{pendingSubmissions} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl">{approvedSubmissions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">submissions</p>
          </CardContent>
        </Card>
        <Link href="/royalties">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardDescription>Royalties</CardDescription>
              <CardTitle className="text-3xl">${(totalRoyalties / 100).toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">${(paidOutAmount / 100).toFixed(2)} paid out</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/assets/create">
          <Button>Register Asset</Button>
        </Link>
        <Link href="/trials/create">
          <Button variant="outline">Create Trial</Button>
        </Link>
      </div>

      {/* My Assets */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Assets</CardTitle>
            <Link href="/assets/create">
              <Button variant="ghost" size="sm">+ New</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {assetsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : assets.length > 0 ? (
            <div className="space-y-3">
              {assets.slice(0, 5).map((asset) => (
                <div
                  key={asset.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{asset.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.ipAssetId ? `IP: ${asset.ipAssetId.slice(0, 10)}...` : 'Pending registration'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${asset.isListed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {asset.isListed ? 'Listed' : 'Unlisted'}
                  </span>
                </div>
              ))}
              {assets.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{assets.length - 5} more assets
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No assets yet. <Link href="/assets/create" className="text-primary underline">Register your first asset</Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* My Trials */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Trials</CardTitle>
            <Link href="/trials/create">
              <Button variant="ghost" size="sm">+ New</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {trialsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : trials.length > 0 ? (
            <div className="space-y-3">
              {trials.slice(0, 5).map((trial) => (
                <Link
                  key={trial.id}
                  href={`/trials/${trial.id}`}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{trial.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {trial._count?.submissions ?? 0} submissions · ${(trial.rewardUsd / 100).toFixed(2)} reward
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${trial.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {trial.isOpen ? 'Open' : 'Closed'}
                  </span>
                </Link>
              ))}
              {trials.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{trials.length - 5} more trials
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No trials yet. <Link href="/trials/create" className="text-primary underline">Create your first trial</Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* My Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.slice(0, 5).map((submission) => (
                <Link
                  key={submission.id}
                  href={`/trials/${submission.trialId}`}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{submission.trial?.title ?? 'Unknown Trial'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    submission.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    submission.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </Link>
              ))}
              {submissions.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{submissions.length - 5} more submissions
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No submissions yet. <Link href="/trials" className="text-primary underline">Browse trials to contribute</Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* My Licenses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Licenses</CardTitle>
            <Link href="/licenses">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <CardDescription>
            {activeLicenses} active license{activeLicenses !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {licensesLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : licenses.length > 0 ? (
            <div className="space-y-3">
              {licenses.slice(0, 5).map((license) => (
                <div
                  key={license.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {license.asset?.title ?? 'Unknown Asset'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Licensed {new Date(license.createdAt).toLocaleDateString()}
                      {license.expiresAt && (
                        <> · Expires {new Date(license.expiresAt).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    license.status === 'ISSUED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {license.status}
                  </span>
                </div>
              ))}
              {licenses.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{licenses.length - 5} more licenses
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No licenses yet. <Link href="/" className="text-primary underline">Browse the marketplace</Link> to license data assets.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
