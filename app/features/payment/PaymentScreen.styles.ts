/**
 * Payment Screen Styles
 *
 * 결제 화면 스타일 정의
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  productSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  bottomContainer: {
    // borderTopWidth: 1,
    // borderTopColor: '#E1E1E1',
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#9FA7B1',
  },
});
