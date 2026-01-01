import React from 'react';
import { SubscriptionWidget } from './SubscriptionWidget';

export async function widgetTaskHandler(props) {
  const widgetInfo = props.widgetInfo;
  
  if (widgetInfo.widgetName === 'SubscriptionWidget') {
    // Props passed via requestWidgetUpdate are available here
    const { totalMonthly, nextPaymentName, nextPaymentDate, currencySymbol } = props;

    // Default values if data hasn't been synced yet
    const displayTotal = totalMonthly ?? "0.00";
    const displayNextName = nextPaymentName ?? null;
    const displayNextDate = nextPaymentDate ?? null;
    const displayCurrency = currencySymbol ?? "$";

    return (
      <SubscriptionWidget 
        totalMonthly={displayTotal}
        nextPaymentName={displayNextName}
        nextPaymentDate={displayNextDate}
        currencySymbol={displayCurrency}
      />
    );
  }

  return null;
}
