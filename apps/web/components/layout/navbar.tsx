'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';

export function Navbar() {
  const { isConnected } = useWallet();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Story Trials
          </Link>
          <div className="flex gap-4">
            <Link href="/marketplace">
              <Button variant="ghost">Marketplace</Button>
            </Link>
            <Link href="/trials">
              <Button variant="ghost">Trials</Button>
            </Link>
            {isConnected && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/licenses">
                  <Button variant="ghost">Licenses</Button>
                </Link>
                <Link href="/royalties">
                  <Button variant="ghost">Royalties</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
}
