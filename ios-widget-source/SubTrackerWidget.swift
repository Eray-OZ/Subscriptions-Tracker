import WidgetKit
import SwiftUI

/// Timeline provider that supplies data to the widget
struct SubTrackerProvider: TimelineProvider {
    
    /// App Group identifier - MUST match the one in WidgetModule.swift and Xcode setup
    private let appGroupId = "group.com.erayoz.subtracker"
    
    /// Placeholder shown in widget gallery
    func placeholder(in context: Context) -> SubTrackerEntry {
        return .placeholder
    }

    /// Snapshot for widget gallery preview
    func getSnapshot(in context: Context, completion: @escaping (SubTrackerEntry) -> ()) {
        let entry = loadDataEntry()
        completion(entry)
    }

    /// Timeline for widget updates
    func getTimeline(in context: Context, completion: @escaping (Timeline<SubTrackerEntry>) -> ()) {
        let entry = loadDataEntry()
        
        // Refresh every hour
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        
        completion(timeline)
    }
    
    /// Load data from App Groups shared UserDefaults
    private func loadDataEntry() -> SubTrackerEntry {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupId),
              let jsonString = sharedDefaults.string(forKey: "widgetData"),
              let jsonData = jsonString.data(using: .utf8) else {
            return .empty
        }
        
        do {
            let widgetData = try JSONDecoder().decode(WidgetData.self, from: jsonData)
            return SubTrackerEntry(date: Date(), data: widgetData)
        } catch {
            print("SubTrackerWidget: Failed to decode widget data: \(error)")
            return .empty
        }
    }
}

/// Main widget configuration
@main
struct SubTrackerWidget: Widget {
    let kind: String = "SubTrackerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SubTrackerProvider()) { entry in
            SubTrackerWidgetView(entry: entry)
        }
        .configurationDisplayName("SubTracker")
        .description("Track your monthly subscriptions")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
