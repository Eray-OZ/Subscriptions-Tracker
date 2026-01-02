import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function SubscriptionWidget({ totalMonthly, nextPaymentName, nextPaymentDate, currencySymbol }) {
  // Ensure we have fallback values
  const displayTotal = totalMonthly || '0.00';
  const displayCurrency = currencySymbol || '₺';
  const displayName = nextPaymentName || 'No upcoming';
  const displayDate = nextPaymentDate || '';

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0a0a0a',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="SubTracker"
        style={{
          color: '#818cf8',
          fontSize: 12,
        }}
      />
      
      <TextWidget
        text={`${displayCurrency}${displayTotal}`}
        style={{
          color: '#ffffff',
          fontSize: 32,
          fontWeight: 'bold',
        }}
      />
      
      <TextWidget
        text="per month"
        style={{
          color: '#64748b',
          fontSize: 12,
        }}
      />

      <FlexWidget
        style={{
          marginTop: 12,
          backgroundColor: '#1a1a2e',
          padding: 8,
          borderRadius: 8,
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={`Next: ${displayName}`}
          style={{
            color: '#10b981',
            fontSize: 12,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
