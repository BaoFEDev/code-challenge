import React, { useMemo } from 'react';
// import { BoxProps } from '@mui/system';
import WalletRow from './WalletRow';
import { useWalletBalances } from '../hooks/useWalletBalances';
import { usePrices } from '../hooks/usePrices';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// The line below is not used and can be safely removed.
// interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances(); // fetch wallet balances
  const prices = usePrices(); // fetch token prices

  //  Declared INSIDE the component
  //  Re-created every render — wastes memory and breaks memoization
  //  Should be moved OUTSIDE or wrapped in useCallback()
  const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  //  Very inefficient data transformation
  //  Runs 3 separate loops (filter → sort → map)
  //  Repeatedly calls getPriority() for each balance
  //  Uses an undefined variable lhsPriority (bug!)
  //  Filters out valid balances (<= 0 logic reversed)
  //  Should combine filtering and sorting more cleanly
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        //  lhsPriority doesn’t exist, logic broken
        //  Keeps negative or zero balances, likely unintended
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // getPriority() called twice per comparison
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]); // prices not used, unnecessary dependency

  // Another pass through array to format balances
  // Creates formattedBalances but never used later
  // Could merge formatting into next map
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(), // No decimals — rounds down everything
    };
  });

  // Another map immediately after — redundant work
  // Inline math computed per render
  // Key uses array index — unstable if order changes
  // Should map over formattedBalances instead, with better key
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className="wallet-row"
          key={index} // unstable, use unique key (currency/blockchain)
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  // Renders all wallet rows
  // Children prop is unused
  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
