import Foundation
import WidgetKit

/// Data structure matching the JSON sent from React Native
struct WidgetData: Codable {
    let currency: String
    let upcomingPayments: [UpcomingPayment]
    let translations: WidgetTranslations?
}

/// Translations for widget UI
struct WidgetTranslations: Codable {
    let upcoming: String
    let noPayments: String
    let today: String
    let dayChar: String
}

/// Upcoming payment information
struct UpcomingPayment: Codable {
    let name: String
    let amount: Double
    let daysLeft: Int
}

/// Timeline entry for the widget
struct SubTrackerEntry: TimelineEntry {
    let date: Date
    let data: WidgetData?
    
    /// Placeholder entry for widget gallery
    static var placeholder: SubTrackerEntry {
        SubTrackerEntry(
            date: Date(),
            data: WidgetData(
                currency: "$",
                upcomingPayments: [
                    UpcomingPayment(name: "Netflix", amount: 15.99, daysLeft: 2),
                    UpcomingPayment(name: "Spotify", amount: 9.99, daysLeft: 5),
                    UpcomingPayment(name: "iCloud", amount: 2.99, daysLeft: 8)
                ],
                translations: WidgetTranslations(
                    upcoming: "UPCOMING",
                    noPayments: "No upcoming payments",
                    today: "TODAY",
                    dayChar: "d"
                )
            )
        )
    }
    
    /// Empty entry when no data available
    static var empty: SubTrackerEntry {
        SubTrackerEntry(date: Date(), data: nil)
    }
}
