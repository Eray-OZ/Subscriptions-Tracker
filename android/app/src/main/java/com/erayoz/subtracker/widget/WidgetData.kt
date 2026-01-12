package com.erayoz.subtracker.widget

import com.google.gson.annotations.SerializedName

/**
 * Data classes for widget data
 * Matches iOS WidgetData.swift structure
 */

data class WidgetData(
    @SerializedName("currency")
    val currency: String,
    
    @SerializedName("upcomingPayments")
    val upcomingPayments: List<UpcomingPayment>,
    
    @SerializedName("translations")
    val translations: WidgetTranslations,

    @SerializedName("language")
    val language: String?
)

data class UpcomingPayment(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("amount")
    val amount: Double,
    
    @SerializedName("daysLeft")
    val daysLeft: Int
)

data class WidgetTranslations(
    @SerializedName("upcoming")
    val upcoming: String,
    
    @SerializedName("noPayments")
    val noPayments: String,
    
    @SerializedName("today")
    val today: String,
    
    @SerializedName("dayChar")
    val dayChar: String
)
