import React from 'react';
import { SubscriptionWidget } from './SubscriptionWidget';

export async function widgetTaskHandler(props) {
  const widgetInfo = props.widgetInfo;
  
  if (widgetInfo.widgetName === 'SubscriptionWidget') {
    // Props are passed via renderWidgetRequest
    // They can be at props level OR inside props.renderWidgetRequest depending on action
    const data = props.renderWidgetRequest || props;

    // Extract values with safe defaults
    const totalMonthly = data.totalMonthly ?? "0.00";
    const nextPaymentName = data.nextPaymentName ?? null;
    const nextPaymentDate = data.nextPaymentDate ?? null;
    const currencySymbol = data.currencySymbol ?? "₺";

    return (
      <SubscriptionWidget 
        totalMonthly={totalMonthly}
        nextPaymentName={nextPaymentName}
        nextPaymentDate={nextPaymentDate}
        currencySymbol={currencySymbol}
      />
    );
  }

  return null;
}
