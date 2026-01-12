# iOS Widget Implementation Plan

## Overview

Add a native iOS home screen widget using SwiftUI and WidgetKit that displays:

- Total monthly subscription spend
- Next upcoming payment (name, amount, date)

---

## Prerequisites

- [x] Xcode installed
- [x] iOS Simulator runtime downloaded
- [x] Basic Swift/SwiftUI knowledge (I'll guide you)

---

## Phase 1: Project Setup

### 1.1 Generate Native iOS Project

```bash
# Generate native iOS project files
npx expo prebuild --platform ios
```

This creates an `ios/` folder with the native Xcode project.

### 1.2 Open in Xcode

```bash
open ios/SubTracker.xcworkspace
```

---

## Phase 2: Add Widget Extension

### 2.1 Create Widget Target in Xcode

1. [x] File → New → Target
2. [x] Search for "Widget Extension"
3. [x] Name it: `SubTrackerWidget`
4. [x] Language: Swift
5. [x] Uncheck "Include Configuration App Intent" (we'll use static config)

### 2.2 Configure App Groups

App Groups let the main app share data with the widget.

1. [x] Select main app target → Signing & Capabilities
2. [x] Add "App Groups" capability
3. [x] Create group: `group.com.erayoz.subtracker` (Updated to match code)
4. [x] Add same App Group to widget target

---

## Phase 3: Data Sharing

### 3.1 Update React Native Code

Create a native module to write data to App Groups:

```javascript
// src/utils/iosWidget.js
import { NativeModules, Platform } from "react-native";

export const updateiOSWidget = async (data) => {
  if (Platform.OS !== "ios") return;

  try {
    await NativeModules.WidgetModule.updateWidgetData(JSON.stringify(data));
  } catch (error) {
    console.log("iOS widget update failed:", error);
  }
};
```

### 3.2 Create Native Bridge Module

```swift
// ios/SubTracker/WidgetModule.swift
import Foundation
import WidgetKit

@objc(WidgetModule)
class WidgetModule: NSObject {

  @objc
  func updateWidgetData(_ jsonString: String) {
    let sharedDefaults = UserDefaults(suiteName: "group.com.yourname.subtracker")
    sharedDefaults?.set(jsonString, forKey: "widgetData")

    // Refresh widget
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

---

## Phase 4: Widget UI (SwiftUI)

### 4.1 Widget Entry Model

```swift
// SubTrackerWidget/WidgetData.swift
import Foundation
import WidgetKit

struct WidgetData: Codable {
    let totalMonthly: Double
    let currency: String
    let nextPayment: NextPayment?
}

struct NextPayment: Codable {
    let name: String
    let amount: Double
    let daysLeft: Int
}

struct SubTrackerEntry: TimelineEntry {
    let date: Date
    let data: WidgetData?
}
```

### 4.2 Widget View

```swift
// SubTrackerWidget/SubTrackerWidgetView.swift
import SwiftUI
import WidgetKit

struct SubTrackerWidgetView: View {
    var entry: SubTrackerEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Header
            HStack {
                Image(systemName: "creditcard.fill")
                    .foregroundColor(.purple)
                Text("SubTracker")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Total
            Text("\(entry.data?.currency ?? "$")\(String(format: "%.2f", entry.data?.totalMonthly ?? 0))")
                .font(.title2)
                .fontWeight(.bold)

            Text("monthly")
                .font(.caption2)
                .foregroundColor(.secondary)

            Spacer()

            // Next Payment
            if let next = entry.data?.nextPayment {
                HStack {
                    VStack(alignment: .leading) {
                        Text(next.name)
                            .font(.caption)
                            .lineLimit(1)
                        Text("\(next.daysLeft) days")
                            .font(.caption2)
                            .foregroundColor(.orange)
                    }
                    Spacer()
                    Text("\(entry.data?.currency ?? "$")\(String(format: "%.2f", next.amount))")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
            }
        }
        .padding()
    }
}
```

---

## Phase 5: Timeline Provider

```swift
// SubTrackerWidget/SubTrackerWidget.swift
import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SubTrackerEntry {
        SubTrackerEntry(date: Date(), data: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (SubTrackerEntry) -> ()) {
        let entry = SubTrackerEntry(date: Date(), data: loadData())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SubTrackerEntry>) -> ()) {
        let entry = SubTrackerEntry(date: Date(), data: loadData())
        let timeline = Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(3600)))
        completion(timeline)
    }

    private func loadData() -> WidgetData? {
        let sharedDefaults = UserDefaults(suiteName: "group.com.yourname.subtracker")
        guard let jsonString = sharedDefaults?.string(forKey: "widgetData"),
              let data = jsonString.data(using: .utf8) else {
            return nil
        }
        return try? JSONDecoder().decode(WidgetData.self, from: data)
    }
}

@main
struct SubTrackerWidget: Widget {
    let kind: String = "SubTrackerWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            SubTrackerWidgetView(entry: entry)
        }
        .configurationDisplayName("SubTracker")
        .description("Track your subscriptions")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
```

---

## Phase 6: Integration

### 6.1 Update Widget on Data Change

In `app/index.jsx`, call the iOS widget update:

```javascript
import { updateiOSWidget } from "../src/utils/iosWidget";

// After fetching subscriptions
useEffect(() => {
  updateiOSWidget({
    totalMonthly: stats.displayTotal,
    currency: getCurrency(language),
    nextPayment: nextSub
      ? {
          name: nextSub.name,
          amount: nextSub.amount,
          daysLeft: nextSub.daysLeft,
        }
      : null,
  });
}, [subscriptions]);
```

---

## Timeline

| Phase     | Task              | Time           |
| --------- | ----------------- | -------------- |
| 1         | Project Setup     | 15 min         |
| 2         | Widget Extension  | 20 min         |
| 3         | Data Sharing      | 30 min         |
| 4         | Widget UI         | 45 min         |
| 5         | Timeline Provider | 20 min         |
| 6         | Integration       | 30 min         |
| **Total** |                   | **~2.5 hours** |

---

## Notes

- iOS 14+ required for widgets
- Widgets are read-only (no buttons/interactions in small size)
- Widget refreshes on timeline schedule, not real-time
- Deep linking can open specific app screens when widget is tapped
