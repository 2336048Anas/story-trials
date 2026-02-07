'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubmissionFormProps {
  onSubmit: (data: { dataCid: string; assetId?: string }) => void;
  isSubmitting: boolean;
  error?: string;
}

export function SubmissionForm({ onSubmit, isSubmitting, error }: SubmissionFormProps) {
  const [dataCid, setDataCid] = useState('');
  const [assetId, setAssetId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ dataCid, assetId: assetId || undefined });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Submit Data</CardTitle>
          <CardDescription>
            Submit your data to this trial for review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="dataCid">Data CID (IPFS)</Label>
            <Input
              id="dataCid"
              value={dataCid}
              onChange={(e) => setDataCid(e.target.value)}
              placeholder="Qm... or bafy..."
              required
            />
            <p className="text-xs text-gray-500">
              The IPFS content identifier for your data
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetId">Link to Existing Asset (Optional)</Label>
            <Input
              id="assetId"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="Asset ID"
            />
            <p className="text-xs text-gray-500">
              If this data is already registered as an asset, enter its ID
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Data'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
