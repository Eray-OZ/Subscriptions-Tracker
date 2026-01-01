import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  // Core colors from design.html
  primary: '#6366f1',
  primaryDark: '#4338ca',
  backgroundDark: '#050505',
  surfaceDark: '#0f0f11',
  surfaceLighter: '#18181b',
  
  // Text colors
  white: '#ffffff',
  slate100: '#f1f5f9',
  slate200: '#E2E8F0',
  slate300: '#cbd5e1',
  slate400: '#94A3B8',
  slate500: '#64748b',
  slate800: '#1e293b',
  
  // Status colors
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  emerald400: '#34d399',
  emerald500: '#10b981',
  purple400: '#c084fc',
  purple500: '#a855f7',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
};

export const shadows = {
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  float: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: 'rgba(5, 5, 5, 0.8)',
  },
  headerContent: {
    flexDirection: 'column',
  },
  headerLabel: {
    color: colors.slate400,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Summary Card Styles
  summaryCardContainer: {
    marginBottom: 32,
  },
  summaryCard: {
    borderRadius: 32,
    backgroundColor: colors.surfaceDark,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    ...shadows.glow,
  },
  summaryCardGradient: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  summaryBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.indigo400,
  },
  summaryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.slate300,
    letterSpacing: 0.5,
  },
  summaryAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  summaryAmountMain: {
    fontSize: 40,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.white,
  },
  summaryAmountDecimal: {
    fontSize: 22,
    fontStyle: 'italic',
    color: colors.slate400,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.slate500,
    fontWeight: '500',
    marginTop: 4,
  },
  summaryTrend: {
    alignItems: 'flex-end',
  },
  summaryTrendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryTrendText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.indigo400,
  },
  summaryStats: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryStat: {
    flex: 1,
  },
  summaryStatBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.05)',
    paddingLeft: 16,
  },
  summaryStatLabel: {
    fontSize: 10,
    color: colors.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },

  // Main List
  main: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Subscription Item Styles
  subscriptionItem: {
    backgroundColor: colors.surfaceLighter,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    ...shadows.subtle,
  },
  subscriptionItemIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    borderRadius: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  subscriptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.subtle,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  subscriptionName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  subscriptionFrequency: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.slate400,
  },
  subscriptionAmountInput: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    backgroundColor: colors.surfaceDark,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  subscriptionMeta: {
    fontSize: 11,
    color: colors.slate500,
    fontWeight: '500',
    marginBottom: 6,
  },
  subscriptionNextPayment: {
    fontSize: 11,
    color: colors.slate500,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotUrgent: {
    backgroundColor: colors.red500,
  },
  statusDotWarning: {
    backgroundColor: '#f59e0b',
  },
  statusDotGood: {
    backgroundColor: colors.emerald500,
  },
  statusDotNeutral: {
    backgroundColor: colors.slate500,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTextUrgent: {
    color: colors.red400,
  },
  statusTextWarning: {
    color: '#fbbf24',
  },
  statusTextGood: {
    color: colors.emerald400,
  },
  statusTextNeutral: {
    color: colors.slate400,
  },
  
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.emerald400,
  },
  
  // Button Styles
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    color: colors.red400,
    fontSize: 12,
    fontWeight: '600',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  updateButtonText: {
    color: colors.indigo400,
    fontSize: 12,
    fontWeight: '600',
  },
  confirmPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  confirmPaymentButtonText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },

  // FAB Button
  fabContainer: {
    position: 'absolute',
    bottom: 32,
    right: 24,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.float,
  },

  // Footer (legacy - keeping for compatibility)
  footer: {
    padding: 16,
    backgroundColor: 'rgba(5, 5, 5, 0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  addButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.float,
  },
  addButtonText: {
    color: colors.backgroundDark,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: colors.surfaceDark,
    borderRadius: 24,
    padding: 28,
    gap: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...shadows.glow,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  datePickerContainer: {
    gap: 8,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.slate400,
  },
  datePickerInputContainer: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.surfaceLighter,
    paddingHorizontal: 20,
  },
  datePickerInput: {
    fontSize: 16,
    color: colors.slate100,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    ...shadows.glow,
  },
  cancelButton: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  // Summary Toggle
  summaryToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  summaryToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  summaryToggleBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate500,
  },
  summaryToggleTextActive: {
    color: colors.white,
  },
  
  // Filter Modal
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  filterModalContainer: {
    backgroundColor: colors.surfaceDark,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  filterModalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  filterSection: {
    marginBottom: 28,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate400,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLighter,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterSearchIcon: {
    marginRight: 12,
  },
  filterSearchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate300,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  languageToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
  },
  languageToggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  languageToggleBtnActive: {
    backgroundColor: colors.primary,
  },
  languageToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.slate400,
  },
  languageToggleTextActive: {
    color: colors.white,
  },
  filterModalFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  clearFiltersBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.red400,
  },
});
