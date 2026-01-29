'use client';

import { useAccount } from 'wagmi';

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected: !isConnected,
  };
}
