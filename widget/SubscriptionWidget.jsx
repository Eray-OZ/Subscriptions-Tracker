import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function SubscriptionWidget({ totalMonthly, nextPaymentName, nextPaymentDate, currencySymbol }) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#050505',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 16
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 'match_parent' }}>
        <TextWidget
            text="SubTracker"
            style={{
            color: '#818cf8', // indigo-400
            fontSize: 14,
            fontWeight: 'bold'
            }}
        />
      </FlexWidget>
      
      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text="Monthly Spend"
          style={{
            color: '#94a3b8', // slate-400
            fontSize: 12,
            marginBottom: 4
          }}
        />
        <TextWidget
          text={`${currencySymbol}${totalMonthly}`}
          style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 'bold'
          }}
        />
      </FlexWidget>

      {nextPaymentName ? (
        <FlexWidget style={{ flexDirection: 'column', backgroundColor: '#1e1e2e', padding: 8, borderRadius: 8, width: 'match_parent' }}>
          <TextWidget
            text="Upcoming"
            style={{
              color: '#94a3b8',
              fontSize: 10,
              marginBottom: 2
            }}
          />
           <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 'match_parent' }}>
             <TextWidget
              text={nextPaymentName}
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 'bold',
                width: '60%'
              }}
              maxLines={1}
            />
             <TextWidget
              text={nextPaymentDate}
              style={{
                color: '#fbbf24', // amber-400
                fontSize: 12,
                textAlign: 'right'
              }}
            />
           </FlexWidget>
        </FlexWidget>
      ) : (
        <TextWidget 
            text="No upcoming payments" 
            style={{ color: '#64748b', fontSize: 12 }} 
        />
      )}
    </FlexWidget>
  );
}
