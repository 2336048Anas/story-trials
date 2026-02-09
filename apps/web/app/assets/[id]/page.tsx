'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAsset } from '@/hooks/use-assets';
import { useCreateLicense } from '@/hooks/use-licenses';
import { useWallet } from '@/hooks/use-wallet';

const EXPLORER_BASE = 'https://aeneid.storyscan.io';

function isRealHash(hash: string | undefined | null): boolean {
  return !!hash && !hash.startsWith('0xmocktx') && !hash.startsWith('mock-');
}

function ExplorerLink({ hash, type }: { hash: string; type: 'tx' | 'address' }) {
  const url = `${EXPLORER_BASE}/${type}/${hash}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline font-mono text-xs"
    >
      {hash.slice(0, 10)}...{hash.slice(-8)}
    </a>
  );
}

export default function AssetDetailPage() {
  const params = useParams();
  const assetId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const { data, isLoading, error } = useAsset(assetId);
  const { address, isConnected } = useWallet();
  const createLicense = useCreateLicense();
  const [licenseSuccess, setLicenseSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLicense = () => {
    if (!address) return;
    setLicenseSuccess(false);
    createLicense.mutate(
      { assetId, buyerAddress: address },
      {
        onSuccess: () => setLicenseSuccess(true),
      }
    );
  };

  if (!mounted || isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Asset Details</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !data?.asset) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Asset Not Found</h1>
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || 'This asset does not exist.'}
          </AlertDescription>
        </Alert>
        <Link href="/">
          <Button variant="outline">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const asset = data.asset;
  const ownerDisplay = asset.owner?.name ||
    (asset.owner?.walletAddress ? `${asset.owner.walletAddress.slice(0, 6)}...${asset.owner.walletAddress.slice(-4)}` : 'Unknown');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{asset.title}</h1>
          <p className="text-muted-foreground mt-2">
            Registered on {new Date(asset.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to Marketplace</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1">{asset.description}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-500">Owner</h4>
              <p className="mt-1 font-mono text-sm">{ownerDisplay}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${asset.isListed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {asset.isListed ? 'Listed' : 'Unlisted'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* IPFS Info */}
        <Card>
          <CardHeader>
            <CardTitle>IPFS Storage</CardTitle>
            <CardDescription>Decentralized content identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Data CID</h4>
              <code className="mt-1 block text-xs bg-gray-100 p-2 rounded break-all">
                {asset.ipfsCid}
              </code>
              <a
                href={`https://ipfs.io/ipfs/${asset.ipfsCid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                View on IPFS Gateway
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Metadata CID</h4>
              <code className="mt-1 block text-xs bg-gray-100 p-2 rounded break-all">
                {asset.metadataCid}
              </code>
              <a
                href={`https://ipfs.io/ipfs/${asset.metadataCid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                View Metadata
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Story Protocol Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Story Protocol Registration</CardTitle>
            <CardDescription>On-chain intellectual property registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">IP Asset ID</h4>
                {asset.ipAssetId ? (
                  <div className="mt-1">
                    {isRealHash(asset.ipAssetId) ? (
                      <ExplorerLink hash={asset.ipAssetId} type="address" />
                    ) : (
                      <code className="block text-xs bg-gray-100 p-2 rounded break-all">
                        {asset.ipAssetId}
                      </code>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-400">Not registered</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Chain ID</h4>
                <p className="mt-1 font-mono">
                  {asset.storyChainId ?? 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Transaction Hash</h4>
                {asset.storyTxHash ? (
                  <div className="mt-1">
                    {isRealHash(asset.storyTxHash) ? (
                      <ExplorerLink hash={asset.storyTxHash} type="tx" />
                    ) : (
                      <code className="block text-xs bg-gray-100 p-2 rounded break-all">
                        {asset.storyTxHash}
                      </code>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-400">No transaction</p>
                )}
              </div>
            </div>
            {/* Additional blockchain fields */}
            {(asset.tokenId || asset.licenseTermsId) && (
              <div className="grid gap-4 md:grid-cols-3 mt-4 pt-4 border-t">
                {asset.tokenId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Token ID</h4>
                    <p className="mt-1 font-mono text-sm">{asset.tokenId}</p>
                  </div>
                )}
                {asset.licenseTermsId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">License Terms ID</h4>
                    <p className="mt-1 font-mono text-sm">{asset.licenseTermsId}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* License This Asset */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>License This Asset</CardTitle>
            <CardDescription>
              Acquire a license to use this data asset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {licenseSuccess && (
              <Alert>
                <AlertDescription>
                  License created successfully!{' '}
                  <Link href="/licenses" className="text-primary underline">
                    View your licenses
                  </Link>
                </AlertDescription>
              </Alert>
            )}
            {createLicense.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to create license: {createLicense.error.message}
                </AlertDescription>
              </Alert>
            )}
            {isConnected ? (
              <Button
                onClick={handleLicense}
                disabled={createLicense.isPending}
              >
                {createLicense.isPending ? 'Creating License...' : 'License This Asset'}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Connect your wallet to license this asset.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
