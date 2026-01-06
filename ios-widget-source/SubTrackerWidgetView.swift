import SwiftUI
import WidgetKit

/// Main widget view that displays subscription summary
struct SubTrackerWidgetView: View {
    var entry: SubTrackerEntry
    
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        ZStack {
            // Gradient background matching app theme
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.1, green: 0.1, blue: 0.2),
                    Color(red: 0.05, green: 0.05, blue: 0.15)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            VStack(alignment: .leading, spacing: 8) {
                // Header
                HStack {
                    Image(systemName: "creditcard.fill")
                        .foregroundColor(.purple)
                        .font(.caption)
                    Text("SubTracker")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.gray)
                    Spacer()
                }
                
                if let data = entry.data {
                    // Total monthly spend
                    Text("\(data.currency)\(String(format: "%.2f", data.totalMonthly))")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text("monthly")
                        .font(.caption2)
                        .foregroundColor(.gray)
                    
                    Spacer()
                    
                    // Next payment (if available)
                    if let next = data.nextPayment {
                        Divider()
                            .background(Color.gray.opacity(0.3))
                        
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(next.name)
                                    .font(.caption)
                                    .fontWeight(.medium)
                                    .foregroundColor(.white)
                                    .lineLimit(1)
                                
                                Text(daysLeftText(next.daysLeft))
                                    .font(.caption2)
                                    .foregroundColor(daysLeftColor(next.daysLeft))
                            }
                            
                            Spacer()
                            
                            Text("\(data.currency)\(String(format: "%.2f", next.amount))")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }
                    }
                } else {
                    // No data state
                    Spacer()
                    Text("Open app to sync")
                        .font(.caption)
                        .foregroundColor(.gray)
                    Spacer()
                }
            }
            .padding()
        }
    }
    
    /// Returns appropriate text for days left
    private func daysLeftText(_ days: Int) -> String {
        switch days {
        case 0: return "Today"
        case 1: return "Tomorrow"
        default: return "\(days) days"
        }
    }
    
    /// Returns color based on urgency
    private func daysLeftColor(_ days: Int) -> Color {
        switch days {
        case 0...2: return .red
        case 3...7: return .orange
        default: return .green
        }
    }
}

/// Preview for SwiftUI canvas
struct SubTrackerWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        SubTrackerWidgetView(entry: .placeholder)
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
