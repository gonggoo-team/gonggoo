/**
 * Payment Complete Screen Styles
 *
 * 참여완료 화면 스타일
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19.09,
    letterSpacing: -0.4,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16.71,
    letterSpacing: -0.35,
    textAlign: 'center',
    marginTop: 11,
  },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 15,
  },
});
