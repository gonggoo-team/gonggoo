/**
 * TermsSection Styles
 *
 * 결제 페이지 약관 동의 섹션 스타일
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1114-11973
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  termsRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#006242',
    borderColor: '#006242',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.4,
    color: '#9FA7B1',    
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  contentWrapper: {
    paddingTop: 12,
    // paddingLeft: 26, // checkbox 너비 + margin 맞춤
  },
  expandedText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: '#9FA7B1',
  },
});
