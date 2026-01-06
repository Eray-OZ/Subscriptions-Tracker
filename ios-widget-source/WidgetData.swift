import Foundation
import WidgetKit

/// Data structure matching the JSON sent from React Native
struct WidgetData: Codable {
    let totalMonthly: Double
    let currency: String
    let nextPayment: NextPayment?
}

/// Next payment information
struct NextPayment: Codable {
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
                totalMonthly: 49.99,
                currency: "$",
                nextPayment: NextPayment(
                    name: "Netflix",
                    amount: 15.99,
                    daysLeft: 3
                )
            )
        )
    }
    
    /// Empty entry when no data available
    static var empty: SubTrackerEntry {
        SubTrackerEntry(date: Date(), data: nil)
    }
}
