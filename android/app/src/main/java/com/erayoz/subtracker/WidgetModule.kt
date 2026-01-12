package com.erayoz.subtracker

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.content.Intent
import android.appwidget.AppWidgetManager
import com.erayoz.subtracker.widget.SubTrackerWidget

/**
 * React Native Native Module to bridge JS widget data to native Android widget
 * Matches iOS WidgetModule.swift functionality
 */
class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName() = "WidgetModule"
    
    /**
     * Updates widget data in SharedPreferences
     * Called from React Native via NativeModules.WidgetModule.updateWidgetData()
     */
    @ReactMethod
    fun updateWidgetData(jsonString: String) {
        val context = reactApplicationContext
        
        // Save to SharedPreferences (equivalent to iOS App Groups UserDefaults)
        val prefs = context.getSharedPreferences("SubTrackerWidget", Context.MODE_PRIVATE)
        // Use commit() to write synchronously to disk to ensure data is available for widget immediately
        prefs.edit()
            .putString("widgetData", jsonString)
            .commit()
        
        // Trigger widget update broadcast
        val intent = Intent(context, SubTrackerWidget::class.java)
        intent.action = "com.erayoz.subtracker.UPDATE_WIDGET"
        
        // Get all widget IDs
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val widgetIds = appWidgetManager.getAppWidgetIds(
            android.content.ComponentName(context, SubTrackerWidget::class.java)
        )
        
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds)
        context.sendBroadcast(intent)
        
        android.util.Log.d("WidgetModule", "Widget data updated and broadcast sent for ${widgetIds.size} widgets")
    }
}
