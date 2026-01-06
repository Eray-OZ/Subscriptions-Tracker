import Foundation
import WidgetKit

/// Native module to bridge React Native data to iOS Widget
/// This file should be added to the main app target after running `npx expo prebuild`
@objc(WidgetModule)
class WidgetModule: NSObject {

  /// Updates widget data in shared UserDefaults (App Groups)
  /// Called from React Native via NativeModules.WidgetModule.updateWidgetData()
  @objc
  func updateWidgetData(_ jsonString: String) {
    // App Group identifier - MUST match the one configured in Xcode
    let appGroupId = "group.com.erayoz.subtracker"
    
    guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
      print("WidgetModule: Failed to access App Group UserDefaults")
      return
    }
    
    sharedDefaults.set(jsonString, forKey: "widgetData")
    sharedDefaults.synchronize()
    
    // Trigger widget refresh
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
      print("WidgetModule: Widget data updated and timeline reloaded")
    }
  }

  /// Required for React Native native modules
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
