package com.erayoz.subtracker.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.util.Log
import com.erayoz.subtracker.R
import com.google.gson.Gson
import java.text.SimpleDateFormat
import java.util.*

/**
 * Android Widget Provider
 * Matches iOS SubTrackerWidget.swift functionality
 */
class SubTrackerWidget : AppWidgetProvider() {

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
    
    override fun onEnabled(context: Context) {
        Log.d("SubTrackerWidget", "Widget enabled")
    }
    
    override fun onDisabled(context: Context) {
        Log.d("SubTrackerWidget", "Widget disabled")
    }
    
    companion object {
        private fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_layout)
            
            // Load data from SharedPreferences
            val widgetData = loadWidgetData(context)
            
            if (widgetData != null && widgetData.upcomingPayments.isNotEmpty()) {
                // DEBUG: Just show count first
                val debugText = "Found ${widgetData.upcomingPayments.size} payments:\n\n" +
                    widgetData.upcomingPayments.joinToString("\n") { payment ->
                        "${payment.name} ${widgetData.currency}${payment.amount.toInt()}"
                    }
                
                views.setTextViewText(R.id.widget_empty_text, debugText)
                views.setViewVisibility(R.id.widget_empty_state, android.view.View.VISIBLE)
                
                Log.d("SubTrackerWidget", "Showing: $debugText")
                
            } else {
                // Show empty state
                val emptyText = widgetData?.translations?.noPayments ?: "No upcoming payments"
                views.setTextViewText(R.id.widget_empty_text, emptyText)
                views.setViewVisibility(R.id.widget_empty_state, android.view.View.VISIBLE)
                
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
