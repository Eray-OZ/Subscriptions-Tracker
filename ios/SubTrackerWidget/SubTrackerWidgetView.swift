import SwiftUI
import WidgetKit

/// Minimal, clean widget design
struct SubTrackerWidgetView: View {
    var entry: SubTrackerEntry
    
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        if family == .systemLarge {
            CalendarWidgetView(entry: entry)
        } else {
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack {
                    Text(entry.data?.translations?.upcoming ?? "UPCOMING")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color.gray)
                        .tracking(1)
                    Spacer()
                    Image(systemName: "creditcard.circle.fill")
                        .font(.system(size: 14))
                        .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9)) // Muted purple
                }
                .padding(.bottom, 10)
                
                if let data = entry.data, !data.upcomingPayments.isEmpty {
                    // Determine items and layout based on family
                    let isSmall = family == .systemSmall
                    let maxItems = isSmall ? 3 : 5
                    
                    VStack(spacing: isSmall ? 10 : 6) {
                        ForEach(Array(data.upcomingPayments.prefix(maxItems).enumerated()), id: \.element.name) { index, payment in
                            HStack(spacing: 0) {
                                // Name - Takes all remaining space
                                Text(payment.name)
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(.white)
                                    .lineLimit(1)
                                
                                Spacer()
                                
                                // Amount - Hidden on small widget to prevent truncation
                                if !isSmall {
                                    Text("\(data.currency)\(Int(payment.amount))")
                                        .font(.system(size: 12, weight: .regular))
                                        .foregroundColor(.gray)
                                        .frame(width: 50, alignment: .trailing)
                                        .padding(.trailing, 8)
                                }
                                
                                // Badge
                                Text(paymentDateText(payment.daysLeft, translations: data.translations))
                                    .font(.system(size: 8, weight: .bold)) // Slightly smaller font for date
                                    .foregroundColor(.black)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(daysColor(payment.daysLeft))
                                    .cornerRadius(4)
                            }
                        }
                    }
                    
                    Spacer(minLength: 0)
                } else {
                    Spacer()
                    VStack(spacing: 6) {
                        Image(systemName: "checkmark.circle")
                            .font(.system(size: 20))
                            .foregroundColor(.gray)
                        Text(entry.data?.translations?.noPayments ?? "No upcoming payments")
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    Spacer()
                }
            }
            .padding(14)
            .containerBackground(for: .widget) {
                Color(red: 0.1, green: 0.1, blue: 0.1) // Simple dark gray, almost black
            }
        }
    }
    

    
    // Payment date text for the badge
    private func paymentDateText(_ days: Int, translations: WidgetTranslations?) -> String {
        if days == 0 {
            return translations?.today ?? "TODAY"
        }
        
        // Calculate date from days left
        let date = Calendar.current.date(byAdding: .day, value: days, to: Date()) ?? Date()
        let formatter = DateFormatter()
        
        // Check if turkish
        if let t = translations, t.today == "BUGÜN" {
             formatter.locale = Locale(identifier: "tr_TR")
        }
        
        formatter.dateFormat = "d MMM"
        return formatter.string(from: date).uppercased()
    }
    
    // Badge background colors - pastel/muted
    private func daysColor(_ days: Int) -> Color {
        switch days {
        case 0: return Color(red: 1.0, green: 0.4, blue: 0.4) // Pastel Red
        case 1...3: return Color(red: 1.0, green: 0.8, blue: 0.4) // Pastel Orange
        default: return Color(red: 0.4, green: 0.9, blue: 0.6) // Pastel Green
        }
    }
}

struct SubTrackerWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        SubTrackerWidgetView(entry: .placeholder)
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

/// Calendar view for Large widget
struct CalendarWidgetView: View {
    var entry: SubTrackerEntry
    
    private let calendar = Calendar.current
    private let daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Month/Year header
            Text(monthYearString)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.white)
            
            // Days of week header
            HStack(spacing: 0) {
                ForEach(daysOfWeek, id: \.self) { day in
                    Text(day)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.gray)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.bottom, 4)
            
            // Calendar grid (compact)
            VStack(spacing: 2) {
                ForEach(Array(calendarWeeks.enumerated()), id: \.offset) { _, week in
                    HStack(spacing: 0) {
                        ForEach(Array(week.enumerated()), id: \.offset) { _, day in
                            dayView(day)
                                .frame(maxWidth: .infinity)
                        }
                    }
                }
            }
            
            // Divider
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .frame(height: 1)
                .padding(.vertical, 6)
            
            // This month's payments
            if let data = entry.data {
                let monthPayments = getMonthPayments(data: data)
                
                if !monthPayments.isEmpty {
                    Text("THIS MONTH")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.gray)
                        .tracking(1)
                        .padding(.bottom, 4)
                    
                    VStack(spacing: 4) {
                        ForEach(monthPayments.prefix(4), id: \.name) { payment in
                            HStack {
                                Text(payment.name)
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(.white)
                                    .lineLimit(1)
                                
                                Spacer()
                                
                                Text(paymentDateText(payment.daysLeft, translations: data.translations))
                                    .font(.system(size: 8, weight: .bold))
                                    .foregroundColor(.black)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(daysColor(payment.daysLeft))
                                    .cornerRadius(4)
                            }
                        }
                    }
                }
            }
            
            Spacer(minLength: 0)
        }
        .padding(14)
        .containerBackground(for: .widget) {
            Color(red: 0.1, green: 0.1, blue: 0.1)
        }
    }
    
    private func dayView(_ day: Int?) -> some View {
        Group {
            if let day = day {
                ZStack {
                    Text("\(day)")
                        .font(.system(size: 12, weight: hasPayment(day) ? .bold : .regular))
                        .foregroundColor(hasPayment(day) ? .white : .gray)
                    
                    if hasPayment(day) {
                        Circle()
                            .fill(Color(red: 0.6, green: 0.4, blue: 0.9))
                            .frame(width: 6, height: 6)
                            .offset(y: 12)
                    }
                }
                .frame(height: 28)
            } else {
                Text("")
                    .frame(height: 28)
            }
        }
    }
    
    private var monthYearString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        return formatter.string(from: Date())
    }
    
    private var calendarWeeks: [[Int?]] {
        let date = Date()
        let components = calendar.dateComponents([.year, .month], from: date)
        guard let firstDayOfMonth = calendar.date(from: components),
              let range = calendar.range(of: .day, in: .month, for: firstDayOfMonth) else {
            return []
        }
        
        let firstWeekday = calendar.component(.weekday, from: firstDayOfMonth) - 1
        let daysInMonth = range.count
        
        var weeks: [[Int?]] = []
        var currentWeek: [Int?] = Array(repeating: nil, count: firstWeekday)
        
        for day in 1...daysInMonth {
            currentWeek.append(day)
            if currentWeek.count == 7 {
                weeks.append(currentWeek)
                currentWeek = []
            }
        }
        
        if !currentWeek.isEmpty {
            while currentWeek.count < 7 {
                currentWeek.append(nil)
            }
            weeks.append(currentWeek)
        }
        
        return weeks
    }
    
    private func hasPayment(_ day: Int) -> Bool {
        guard let data = entry.data else { return false }
        
        let components = calendar.dateComponents([.year, .month], from: Date())
        guard let firstDayOfMonth = calendar.date(from: components),
              let checkDate = calendar.date(byAdding: .day, value: day - 1, to: firstDayOfMonth) else {
            return false
        }
        
        let today = Date()
        
        return data.upcomingPayments.contains { payment in
            // Calculate payment date from daysLeft
            guard let paymentDate = calendar.date(byAdding: .day, value: payment.daysLeft, to: today) else {
                return false
            }
            
            let paymentDay = calendar.component(.day, from: paymentDate)
            let paymentMonth = calendar.component(.month, from: paymentDate)
            let checkDay = calendar.component(.day, from: checkDate)
            let checkMonth = calendar.component(.month, from: checkDate)
            
            return paymentDay == checkDay && paymentMonth == checkMonth
        }
    }
    
    // Get all payments for current month
    private func getMonthPayments(data: WidgetData) -> [UpcomingPayment] {
        let today = Date()
        let currentMonth = calendar.component(.month, from: today)
        let currentYear = calendar.component(.year, from: today)
        
        return data.upcomingPayments.filter { payment in
            guard let paymentDate = calendar.date(byAdding: .day, value: payment.daysLeft, to: today) else {
                return false
            }
            
            let paymentMonth = calendar.component(.month, from: paymentDate)
            let paymentYear = calendar.component(.year, from: paymentDate)
            
            return paymentMonth == currentMonth && paymentYear == currentYear
        }
    }
    
    // Payment date text for the badge
    private func paymentDateText(_ days: Int, translations: WidgetTranslations?) -> String {
        if days == 0 {
            return translations?.today ?? "TODAY"
        }
        
        // Calculate date from days left
        let date = Calendar.current.date(byAdding: .day, value: days, to: Date()) ?? Date()
        let formatter = DateFormatter()
        
        // Check if turkish
        if let t = translations, t.today == "BUGÜN" {
             formatter.locale = Locale(identifier: "tr_TR")
        }
        
        formatter.dateFormat = "d MMM"
        return formatter.string(from: date).uppercased()
    }
    
    // Badge background colors
    private func daysColor(_ days: Int) -> Color {
        switch days {
        case 0: return Color(red: 1.0, green: 0.4, blue: 0.4)
        case 1...3: return Color(red: 1.0, green: 0.8, blue: 0.4)
        default: return Color(red: 0.4, green: 0.9, blue: 0.6)
        }
    }
}
