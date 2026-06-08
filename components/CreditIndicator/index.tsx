'use client';

import React from 'react';
import * as paymentLogic from '@/lib/paymentLogic';

interface CreditIndicatorProps {
  credits: number;
  size?: 'small' | 'medium' | 'large';
}

/**
 * CreditIndicator Component
 * Visual indicator for credit status (green/red/yellow)
 */
export const CreditIndicator: React.FC<CreditIndicatorProps> = ({
  credits,
  size = 'medium',
}) => {
  const indicatorType = paymentLogic.getCreditIndicatorType(credits);
  const creditsDisplay = paymentLogic.formatCredits(credits);

  const sizeClasses = {
    small: 'w-4 h-4 text-xs',
    medium: 'w-5 h-5 text-sm',
    large: 'w-6 h-6 text-base',
  };

  const colorClasses = {
    positive: 'bg-green-500',
    negative: 'bg-red-500',
    neutral: 'bg-yellow-500',
  };

  return (
    <div
      className={`credit-indicator ${indicatorType} ${sizeClasses[size]}`}
      title={`Credits: ${creditsDisplay}`}
    >
      <span className="text-white font-bold text-xs">
        {credits > 0 ? '+' : ''}
        {credits}
      </span>
    </div>
  );
};
