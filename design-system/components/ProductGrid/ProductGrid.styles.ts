/**
 * ProductGrid Styles
 *
 * 상품 그리드의 스타일을 정의합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createProductGridStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    columnWrapper: {
      paddingHorizontal: 20,
    },
    listContent: {
      paddingBottom: 20,
    },
    listContentSingle: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
  });
