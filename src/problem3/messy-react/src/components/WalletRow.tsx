import React from 'react';

interface Props {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}

const WalletRow: React.FC<Props> = ({ amount, usdValue, formattedAmount, className }) => {
  return (
    <div className={className}>
      <strong>{formattedAmount}</strong> — ${usdValue.toFixed(2)} (raw: {amount})
    </div>
  );
};

export default WalletRow;
