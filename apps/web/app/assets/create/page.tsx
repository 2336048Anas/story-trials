'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/use-wallet';
import { useRegisterAsset } from '@/hooks/use-assets';
import { toast } from 'sonner';

const EXPLORER_BASE = 'https://aeneid.storyscan.io';

function isRealHash(hash: string | undefined | null): boolean {
  return !!hash && !hash.startsWith('0xmocktx') && !hash.startsWith('mock-');
}

export default function CreateAssetPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const registerAsset = useRegisterAsset();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsCid, setIpfsCid] = useState('');
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessData(null);

    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!ipfsCid.trim()) {
      setError('IPFS CID is required');
      return;
    }

    try {
      const result = await registerAsset.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        ownerAddress: address,
        ipfsCid: ipfsCid.trim(),
      });

      setSuccessData(result);
      toast.success('Asset registered successfully!');
      setTitle('');
      setDescription('');
      setIpfsCid('');
    } catch (err: any) {
      const message = err.message || 'Failed to register asset. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Asset</h1>
          <p className="text-muted-foreground mt-2">
            Register a new health data asset on Story Protocol
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Please connect your wallet to register assets.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Asset</h1>
        <p className="text-muted-foreground mt-2">
          Register a new health data asset on Story Protocol
        </p>
      </div>

      {successData && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="space-y-2">
            <p className="font-semibold">Asset registered successfully!</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Asset ID:</span>{' '}
                <span className="font-mono">{successData.asset.id}</span>
              </p>
              {successData.tx.ipAssetId && (
                <p>
                  <span className="font-medium">Story Protocol ID:</span>{' '}
                  {isRealHash(successData.tx.ipAssetId) ? (
                    <a
                      href={`${EXPLORER_BASE}/address/${successData.tx.ipAssetId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 hover:underline"
                    >
                      {successData.tx.ipAssetId}
                    </a>
                  ) : (
                    <span className="font-mono">{successData.tx.ipAssetId}</span>
                  )}
                </p>
              )}
              {successData.tx.txHash && (
                <p>
                  <span className="font-medium">Transaction Hash:</span>{' '}
                  {isRealHash(successData.tx.txHash) ? (
                    <a
                      href={`${EXPLORER_BASE}/tx/${successData.tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-blue-600 hover:underline"
                    >
                      {successData.tx.txHash}
                    </a>
                  ) : (
                    <span className="font-mono text-xs">{successData.tx.txHash}</span>
                  )}
                </p>
              )}
              <p>
                <span className="font-medium">Chain ID:</span> {successData.tx.chainId}
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
              >
                View Marketplace
              </Button>
              {successData.tx.txHash && isRealHash(successData.tx.txHash) && (
                <a
                  href={`${EXPLORER_BASE}/tx/${successData.tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    View on Explorer
                  </Button>
                </a>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertDescription className="text-red-900">{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Asset Details</CardTitle>
          <CardDescription>
            Connected wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="My Health Data Asset"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description of the data asset..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipfsCid">IPFS CID *</Label>
              <Input
                id="ipfsCid"
                placeholder="QmExample123..."
                value={ipfsCid}
                onChange={(e) => setIpfsCid(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                For demo purposes, you can use any string as a placeholder CID
              </p>
            </div>

            <Button
              type="submit"
              disabled={registerAsset.isPending}
              className="w-full"
            >
              {registerAsset.isPending ? 'Registering on Story Protocol...' : 'Register Asset'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
