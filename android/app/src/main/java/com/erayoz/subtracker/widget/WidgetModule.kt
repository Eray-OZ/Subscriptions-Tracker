package com.erayoz.subtracker.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String = "WidgetModule"
    
    @ReactMethod
    fun updateWidgetData(paymentsJson: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val prefs: SharedPreferences = context.getSharedPreferences("subtracker_widget", Context.MODE_PRIVATE)
            prefs.edit().putString("upcoming_payments", paymentsJson).apply()
            
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val widgetComponent = ComponentName(context, SubTrackerWidget::class.java)
            val widgetIds = appWidgetManager.getAppWidgetIds(widgetComponent)
            
            for (widgetId in widgetIds) {
                SubTrackerWidget.updateAppWidget(context, appWidgetManager, widgetId)
            }
            
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
