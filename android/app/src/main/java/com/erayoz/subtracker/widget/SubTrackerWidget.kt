package com.erayoz.subtracker.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.SharedPreferences
import android.widget.RemoteViews
import com.erayoz.subtracker.R
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
                val paymentsJson = prefs.getString(KEY_PAYMENTS, "[]") ?: "[]"
                val payments = JSONArray(paymentsJson)
                
                views.removeAllViews(R.id.payment_list)
                
                val maxRows = minOf(payments.length(), 5)
                for (i in 0 until maxRows) {
                    val payment = payments.getJSONObject(i)
                    val rowView = RemoteViews(context.packageName, R.layout.widget_payment_row)
                    
                    rowView.setTextViewText(R.id.payment_name, payment.getString("name"))
                    rowView.setTextViewText(R.id.payment_amount, payment.getString("amount"))
                    rowView.setTextViewText(R.id.payment_date, payment.getString("date"))
                    
                    views.addView(R.id.payment_list, rowView)
                }
                
                if (payments.length() == 0) {
                    val emptyView = RemoteViews(context.packageName, R.layout.widget_payment_row)
                    emptyView.setTextViewText(R.id.payment_name, "No upcoming payments")
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
