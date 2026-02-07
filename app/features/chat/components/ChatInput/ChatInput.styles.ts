/**
 * ChatInput Styles
 */

import { StyleSheet, Platform } from 'react-native';
import type { Theme } from '@/design-system';
import { CHAT_INPUT } from '@/app/shared/constants/layout';

export const createStyles = (theme: Theme, bottomInset: number = 0) =>
  StyleSheet.create({
    container: {
      paddingVertical: 8,
      // 동적 paddingBottom: 기본 8px + SafeArea bottom (키보드 상태에 따라 변경)
      // - 키보드 올라옴: 8px (bottomInset = 0)
      // - 키보드 내려감: 8px + insets.bottom (iPhone: ~42px)
      // paddingBottom: 8 + bottomInset,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface.normal.bg1,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.lowEmp,
    },
    attachButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#006242',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.xs,
      // marginBottom: 6, // 입력창이 멀티라인이 되어도 버튼을 하단에 고정하기 위한 여백 조정
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end', // 중요: 입력창이 커질 때 아이콘들을 바닥에 붙임
      backgroundColor: theme.colors.surface.normal.bg2,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingBottom: 8,
      // paddingVertical: 8, 
      minHeight: 44, // 최소 높이 보장
      
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22, // 줄 간격 명시
      fontWeight: '400',
      color: theme.colors.surface.texticon.onnormal.text.black,
      marginHorizontal: theme.spacing.xs,      
      paddingBottom: 4,      
    },
    sendButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.normal.bg3, // 비활성 상태 배경색 (예시)
      // marginBottom: 6, // 입력창이 멀티라인이 되어도 버튼을 하단에 고정하기 위한 여백 조정
    },
    sendButtonActive: {
      backgroundColor: '#006242',
    },
  });