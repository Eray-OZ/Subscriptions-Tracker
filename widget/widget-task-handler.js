import React from 'react';
import { SubscriptionWidget } from './SubscriptionWidget';

export async function widgetTaskHandler(props) {
  const widgetInfo = props.widgetInfo;
  
  if (widgetInfo.widgetName === 'SubscriptionWidget') {
    // Props are passed via renderWidgetRequest
    // They can be at props level OR inside props.renderWidgetRequest depending on action
    const data = props.renderWidgetRequest || props;

    // Extract values with safe defaults
    const upcomingPayments = data.upcomingPayments || [];
    const translations = data.translations || {};
    const currencySymbol = data.currencySymbol ?? "₺";

    return (
      <SubscriptionWidget 
        upcomingPayments={upcomingPayments}
        translations={translations}
        currencySymbol={currencySymbol}
      />
    );
  }

  return null;
}
