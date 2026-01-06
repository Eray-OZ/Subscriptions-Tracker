#import <React/RCTBridgeModule.h>

/// Objective-C bridge header to expose Swift WidgetModule to React Native
/// This tells React Native that WidgetModule exists and has the updateWidgetData method
@interface RCT_EXTERN_MODULE(WidgetModule, NSObject)

RCT_EXTERN_METHOD(updateWidgetData:(NSString *)jsonString)

@end
