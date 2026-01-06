import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function SubscriptionWidget({ upcomingPayments, translations, currencySymbol }) {
  const t = translations || {};
  const currentCurrency = currencySymbol || '₺';

  // Badge Logic
  const getBadgeColor = (days) => {
    if (days === 0) return '#ff6b6b'; // Red
    if (days <= 3) return '#ffcc66';  // Orange
    return '#69db96';                 // Green
  };

  const getBadgeText = (days) => {
    if (days === 0) return t.today || 'TODAY';
    const char = t.dayChar || 'd';
    return `${days}${char}`;
  };

  // Render List Item
  const renderItem = (item, index) => (
    <FlexWidget
      key={index}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: 'match_parent',
      }}
    >
      {/* Name */}
      <TextWidget
        text={item.name}
        style={{
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          flex: 1,
        }}
        maxLines={1}
      />

      {/* Right Side: Amount + Badge */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Amount */}
        <TextWidget
          text={`${currentCurrency}${Math.round(item.amount)}`}
          style={{
            color: '#9ca3af', // Gray 400
            fontSize: 14,
            marginRight: 8,
          }}
        />

        {/* Badge */}
        <FlexWidget
          style={{
            backgroundColor: getBadgeColor(item.daysLeft),
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 2,
            minWidth: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={getBadgeText(item.daysLeft)}
            style={{
              color: '#000000',
              fontSize: 10,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#111111', // Dark background
        padding: 14,
        flexDirection: 'column',
        borderRadius: 16,
      }}
    >
      {/* Header */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={t.upcoming || 'UPCOMING'}
          style={{
            color: '#9ca3af', // Gray
            fontSize: 12,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        />
        {/* Simple Icon Representation */}
        <TextWidget
          text="💳" 
          style={{
            fontSize: 14,
          }}
        />
      </FlexWidget>

      {/* Content */}
      {upcomingPayments && upcomingPayments.length > 0 ? (
        <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
          {upcomingPayments.map((item, index) => renderItem(item, index))}
        </FlexWidget>
      ) : (
        /* Empty State */
        <FlexWidget
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 'match_parent',
          }}
        >
          <TextWidget
            text="✓"
            style={{
              color: '#4b5563', // Gray 600
              fontSize: 24,
              marginBottom: 4,
            }}
          />
          <TextWidget
            text={t.noPayments || 'No upcoming payments'}
            style={{
              color: '#6b7280', // Gray 500
              fontSize: 12,
            }}
          />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
