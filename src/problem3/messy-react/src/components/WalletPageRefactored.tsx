import React, { useMemo } from 'react';
import { useWalletBalances } from '../hooks/useWalletBalances';
import { usePrices } from '../hooks/usePrices';
import WalletRow from './WalletRow';

// Move helper OUTSIDE component to avoid re-creation each render
// This improves performance and keeps useMemo stable.
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa':
    case 'Neo': return 20;
    default: return -99;
  }
};

const WalletPageRefactored: React.FC<Props> = (props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // useMemo ensures this only recalculates when balances or prices change
  // Combines filtering, sorting, formatting, and rendering in one pass
  const rows = useMemo(() => {
    return balances
      // Filter valid balances only once
      .filter((b) => getPriority(b.blockchain) > -99 && b.amount > 0)

      // Sort by priority descending
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))

      // Format and render in the same pass (no redundant loops)
      .map((balance) => {
        const formatted = balance.amount.toFixed(2); // Proper 2 decimal formatting
        const usdValue = (prices[balance.currency] ?? 0) * balance.amount; // Safe lookup with fallback

        return (
          <WalletRow
            key={balance.currency} // Stable unique key
            className="wallet-row"
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={formatted}
          />
        );
      });
  }, [balances, prices]);

  // Clear, semantic, and efficient rendering
  return (
    <div {...rest}>
      <h2>💰 Refactored Wallet Page</h2>
      {rows}
    </div>
  );
};

export default WalletPageRefactored;
