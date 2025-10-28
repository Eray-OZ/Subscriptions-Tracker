
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#00F0A0',
  secondary: '#9C27B0',
  backgroundLight: '#f6f7f8',
  backgroundDark: '#0D0C1D',
  surfaceDark: '#16152C',
  textLight: '#f6f7f8',
  textDark: '#0D0C1D',
  slate200: '#E2E8F0',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate700: '#334155',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: colors.backgroundDark,
  },
  headerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.slate200,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 48, // to compensate for the back button
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  labelContainer: {
    marginBottom: 24,
  },
  labelText: {
    color: colors.slate400,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.surfaceDark,
    borderColor: colors.slate700,
    borderWidth: 1,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.primary,
    ringWidth: 2,
    ringColor: 'rgba(0, 240, 160, 0.5)',
  },
  billingCycleContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: colors.surfaceDark,
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingCycleOption: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  billingCycleOptionSelected: {
    backgroundColor: colors.primary,
  },
  billingCycleText: {
    color: colors.slate200,
    fontSize: 14,
    fontWeight: '500',
  },
  billingCycleTextSelected: {
    color: colors.backgroundDark,
  },
  grid: {
    flexDirection: 'row',
    gap: 24,
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
    borderRadius: 12,
    backgroundColor: colors.surfaceDark,
    borderColor: colors.slate700,
    borderWidth: 1,
    color: 'white',
    justifyContent: 'center',
  },
  pickerItem: {
    backgroundColor: colors.surfaceDark,
    color: 'white',
  },
pickerIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(13, 12, 29, 0.8)',
    borderTopWidth: 1,
    borderColor: colors.slate700,
  },
  addButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.backgroundDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
