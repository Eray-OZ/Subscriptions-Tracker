package com.erayoz.subtracker.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.RemoteViews
import com.erayoz.subtracker.R
import com.google.gson.Gson
import java.text.SimpleDateFormat
import java.util.*

/**
 * Android Widget Provider
 * Matches iOS SubTrackerWidget.swift functionality
 */
class SubTrackerWidget : AppWidgetProvider() {

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        
        // Handle custom update action
        if (intent.action == "com.erayoz.subtracker.UPDATE_WIDGET") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisAppWidget = android.content.ComponentName(context, SubTrackerWidget::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(thisAppWidget)
            
            Log.d("SubTrackerWidget", "Received custom update broadcast for ${appWidgetIds.size} widgets")
            onUpdate(context, appWidgetManager, appWidgetIds)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        Log.d("SubTrackerWidget", "onUpdate called for ${appWidgetIds.size} widgets")
        
        // Update each widget instance
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }
    override fun onAppWidgetOptionsChanged(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int,
        newOptions: android.os.Bundle?
    ) {
        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions)
        updateAppWidget(context, appWidgetManager, appWidgetId)
    }

    companion object {
        private fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_layout)
            
            // Get widget options to determine size
            val options = appWidgetManager.getAppWidgetOptions(appWidgetId)
            val minHeight = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT)
            val minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH)
            
            Log.d("SubTrackerWidget", "Widget size: ${minWidth}dp x ${minHeight}dp")
            
            // Load data from SharedPreferences
            val widgetData = loadWidgetData(context)
            
            if (widgetData != null && widgetData.upcomingPayments.isNotEmpty()) {
                // Show payment list container
                views.setTextViewText(R.id.widget_header, widgetData.translations.upcoming)
                views.setViewVisibility(R.id.widget_empty_state, android.view.View.GONE)
                views.setViewVisibility(R.id.widget_payments_container, android.view.View.VISIBLE)
                
                // Clear existing views
                views.removeAllViews(R.id.widget_payments_container)
                
                // Removed unreliable height calculation
                // Just show up to 6 items and let the widget layout handle clipping vs showing
                val maxItems = 6
                
                Log.d("SubTrackerWidget", "Displaying max $maxItems items")

                // Add payments
                val paymentsToShow = widgetData.upcomingPayments.take(maxItems)
                
                for (payment in paymentsToShow) {
                    val row = RemoteViews(context.packageName, R.layout.widget_payment_row)
                    
                    // Set Name
                    row.setTextViewText(R.id.payment_name, payment.name)
                    
                    // Set Amount
                    val amountText = "${widgetData.currency}${if (payment.amount % 1.0 == 0.0) payment.amount.toInt() else payment.amount}"
                    row.setTextViewText(R.id.payment_amount, amountText)
                    
                    // Set Date Badge
                    val badgeText = formatDateBadge(payment.daysLeft, widgetData.translations)
                    row.setTextViewText(R.id.payment_date, badgeText)
                    
                    // Set Badge Color
                    val badgeColor = getBadgeColor(payment.daysLeft)
                    row.setInt(R.id.payment_date, "setBackgroundColor", badgeColor)
                    
                    // Add row to container
                    views.addView(R.id.widget_payments_container, row)
                }
                
            } else {
                // Show empty state
                val emptyText = widgetData?.translations?.noPayments ?: "No upcoming payments"
                views.setTextViewText(R.id.widget_empty_text, emptyText)
                views.setTextColor(R.id.widget_empty_text, 0xFF6b7280.toInt()) // Gray text
                views.setViewVisibility(R.id.widget_empty_state, android.view.View.VISIBLE)
                views.setViewVisibility(R.id.widget_payments_container, android.view.View.GONE)
                
                Log.d("SubTrackerWidget", "No data - showing empty state")
            }
            
            appWidgetManager.updateAppWidget(appWidgetId, views)
            Log.d("SubTrackerWidget", "Widget updated")
        }
        
        private fun loadWidgetData(context: Context): WidgetData? {
            return try {
                val prefs = context.getSharedPreferences("SubTrackerWidget", Context.MODE_PRIVATE)
                val jsonString = prefs.getString("widgetData", null)
                
                if (jsonString != null) {
                    Gson().fromJson(jsonString, WidgetData::class.java)
                } else {
                    Log.d("SubTrackerWidget", "No widget data found")
                    null
                }
            } catch (e: Exception) {
                Log.e("SubTrackerWidget", "Failed to load widget data", e)
                null
            }
        }
        
        private fun formatDateBadge(daysLeft: Int, translations: WidgetTranslations): String {
            if (daysLeft == 0) return translations.today
            
            // Calculate future date
            val calendar = Calendar.getInstance()
            calendar.add(Calendar.DAY_OF_YEAR, daysLeft)
            
            // Format as "15 JAN"
            val formatter = SimpleDateFormat("d MMM", Locale.ENGLISH)
            return formatter.format(calendar.time).uppercase()
        }
        
        private fun getBadgeColor(daysLeft: Int): Int {
            return when {
                daysLeft == 0 -> 0xFFFF6B6B.toInt() // Red
                daysLeft <= 3 -> 0xFFFFCC66.toInt()  // Orange
                else -> 0xFF69DB96.toInt()           // Green
            }
        }
    }
}
