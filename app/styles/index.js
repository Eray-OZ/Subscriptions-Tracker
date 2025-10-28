
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#00F0A0',
  secondary: '#9C27B0',
  backgroundLight: '#f6f7f8',
  backgroundDark: '#0D0C1D',
  surfaceDark: '#16152C',
  textLight: '#f6f7f8',
  textDark: '#0D0C1D',
  slate100: '#f1f5f9',
  slate200: '#E2E8F0',
  slate400: '#94A3B8',
  slate800: '#1e293b',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    color: colors.slate100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: colors.backgroundDark,
  },
  headerTitle: {
    color: colors.slate100,
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 16,
    backgroundColor: colors.surfaceDark,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.slate800,
    marginBottom: 12,
  },
  subscriptionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  subscriptionNextPayment: {
    fontSize: 14,
    color: colors.slate400,
  },
  subscriptionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(13, 12, 29, 0.8)',
    borderTopWidth: 1,
    borderColor: colors.slate800,
  },
  addButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.backgroundDark,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
