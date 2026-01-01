import { StyleSheet } from 'react-native';

export const colors = {
  // Core colors matching design.html
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
  slate700: '#334155',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(5, 5, 5, 0.9)',
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: colors.surfaceLighter,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  labelContainer: {
    marginBottom: 24,
  },
  labelText: {
    color: colors.slate400,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  input: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceLighter,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 20,
    color: colors.white,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  billingCycleContainer: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: colors.surfaceLighter,
    borderRadius: 16,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingCycleOption: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  billingCycleOptionSelected: {
    backgroundColor: colors.primary,
  },
  billingCycleText: {
    color: colors.slate300,
    fontSize: 14,
    fontWeight: '600',
  },
  billingCycleTextSelected: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridColumn: {
    flex: 1,
  },
  dateInputContainer: {
    position: 'relative',
  },
  dateIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    color: colors.primary,
  },
  picker: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceLighter,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    color: colors.white,
    justifyContent: 'center',
  },
  pickerItem: {
    backgroundColor: colors.surfaceDark,
    color: colors.white,
  },
  pickerIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    color: colors.primary,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  addButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  addButtonText: {
    color: colors.backgroundDark,
    fontSize: 17,
    fontWeight: '700',
  },
  
  // Billing Cycle
  billingCycleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 4,
  },
  billingCycleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  billingCycleOptionSelected: {
    backgroundColor: colors.primary,
  },
  billingCycleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate500,
  },
  billingCycleTextSelected: {
    color: colors.white,
  },
});
