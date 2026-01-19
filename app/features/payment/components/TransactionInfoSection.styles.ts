/**
 * TransactionInfoSection Styles
 *
 * 결제 페이지 거래 정보 섹션 스타일
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1114-11948
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16.8,
  },
  infoContainer: {
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.4,
    width: 56, // 고정 너비로 정렬
  },
  value: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.4,
  },
  timeChipsWrapper: {
    flex: 1,
    gap: 9,
  },
  timeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  timeChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.4,
    textAlign: 'center',
  },
});
