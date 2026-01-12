package com.erayoz.subtracker.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import com.erayoz.subtracker.R
import org.json.JSONObject
import org.json.JSONArray

class SubTrackerWidget : AppWidgetProvider() {
    
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        private const val PREFS_NAME = "subtracker_widget"
        private const val KEY_PAYMENTS = "upcoming_payments"
        
        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.widget_layout)
            
            try {
                val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                val dataJson = prefs.getString(KEY_PAYMENTS, "{}") ?: "{}"
                
                // Parse the full data object
                val data = JSONObject(dataJson)
                val currency = data.optString("currency", "₺")
                val language = data.optString("language", "tr")
                val payments = data.optJSONArray("upcomingPayments") ?: JSONArray()
                
                // Set title based on language
                val title = if (language == "tr") "Yaklaşan Ödemeler" else "Upcoming Payments"
                views.setTextViewText(R.id.widget_title, title)
                
                views.removeAllViews(R.id.payment_list)
                
                val maxRows = minOf(payments.length(), 5)
                for (i in 0 until maxRows) {
                    val payment = payments.getJSONObject(i)
                    val rowView = RemoteViews(context.packageName, R.layout.widget_payment_row)
                    
                    val name = payment.getString("name")
                    val amount = payment.optDouble("amount", 0.0)
                    val daysLeft = payment.optInt("daysLeft", 0)
                    
                    // Format amount with currency
                    val amountStr = "$currency${String.format("%.2f", amount)}"
                    
                    // Format days - handle Turkish/English
                    val daysStr = if (daysLeft == 0) {
                        if (language == "tr") "Bugün" else "Today"
                    } else if (daysLeft < 0) {
                        val overdue = Math.abs(daysLeft)
                        if (language == "tr") "$overdue gün gecikti" else "$overdue days late"
                    } else {
                        if (language == "tr") "$daysLeft gün" else "$daysLeft days"
                    }
                    
                    rowView.setTextViewText(R.id.payment_name, name)
                    rowView.setTextViewText(R.id.payment_amount, amountStr)
                    rowView.setTextViewText(R.id.payment_date, daysStr)
                    
                    // Set badge background based on days left (iOS style)
                    val badgeDrawable = when {
                        daysLeft < 0 -> R.drawable.badge_red      // Red for overdue
                        daysLeft == 0 -> R.drawable.badge_orange  // Orange for today
                        daysLeft <= 3 -> R.drawable.badge_yellow  // Yellow for 1-3 days
                        else -> R.drawable.badge_green            // Green for 4+ days
                    }
                    rowView.setInt(R.id.payment_date, "setBackgroundResource", badgeDrawable)
                    
                    views.addView(R.id.payment_list, rowView)
                }
                
                if (payments.length() == 0) {
                    val emptyView = RemoteViews(context.packageName, R.layout.widget_payment_row)
                    val noPaymentsText = if (language == "tr") "Yaklaşan ödeme yok" else "No upcoming payments"
                    emptyView.setTextViewText(R.id.payment_name, noPaymentsText)
                    emptyView.setTextViewText(R.id.payment_amount, "")
                    emptyView.setTextViewText(R.id.payment_date, "")
                    views.addView(R.id.payment_list, emptyView)
                }
                
            } catch (e: Exception) {
                e.printStackTrace()
            }
            
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
