import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/types';
import { scaleFontSize } from '../../utils/responsive';

export const createGNBStyles = (theme: Theme) => {
  // 반응형 폰트 크기
  const fontSize16 = scaleFontSize(theme.typography.scalableFontSize.md); // 16px → 16-18px
  const fontSize20 = scaleFontSize(theme.typography.scalableFontSize.xl); // 20px → 20-23px

  return StyleSheet.create({
    container: {
      // minHeight 제거: 패딩으로 높이 조정
      backgroundColor: theme.colors.surface.normal.bg1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md, // 16px
      paddingHorizontal: theme.spacing.lg, // 20px
    },

    // ===== 왼쪽 섹션 =====
    leftSection: {
      minWidth: 30,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    leftButton: {
      padding: theme.spacing.xxs,
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftLogoText: {
      fontSize: fontSize20, // 반응형: 20px → 20-23px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      lineHeight: fontSize20 * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(fontSize20),
      color: theme.colors.surface.texticon.onnormal.text.black,
    },
    leftLogoImage: {
      width: 120,
      height: 32,
      resizeMode: 'contain',
    },
    addressButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      maxWidth: 200, // 긴 주소명 대응
    },
    addressText: {
      fontSize: fontSize20, // 반응형: 20px → 20-23px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      lineHeight: fontSize20 * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(fontSize20),
      color: theme.colors.surface.texticon.onnormal.text.black,
      flexShrink: 1, // 긴 텍스트 시 아이콘 영역 보호
    },

    // ===== 중앙 섹션 =====
    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.sm, // 12px
    },
    centerLogoText: {
      fontSize: fontSize20, // 반응형: 20px → 20-23px
      fontWeight: theme.typography.fontWeight.semiBold,
      lineHeight: fontSize20 * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(fontSize20),
      color: theme.colors.surface.texticon.onnormal.text.black,
      textAlign: 'center',
    },
    centerLogoImage: {
      width: 140,
      height: 36,
      resizeMode: 'contain',
    },
    centerTitle: {
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold,
      lineHeight: fontSize16 * 1.5,
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
      color: theme.colors.surface.texticon.onnormal.text.black,
      textAlign: 'center',
      maxWidth: '100%',
    },
    centerSearchBar: {
      width: '100%',
      maxWidth: 500, // 큰 화면에서 너무 늘어나지 않도록      
    },

    // ===== 오른쪽 섹션 =====
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xl, // 24px
    },
    iconButton: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xxs, // 4px 터치 영역 확보
    },

    // ===== 배지 =====
    dotBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.surface.env.accent, // #F7514D
    },
    countBadge: {
      position: 'absolute',
      top: -5,
      right: -8,
      minWidth: 16,
      height: 16,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xxs,
      backgroundColor: theme.colors.surface.env.accent,
    },
    badgeText: {
      color: theme.colors.surface.texticon.onnormal.text.white,
      fontSize: theme.typography.fixedFontSize.badgeCount, // 고정: 10px (배지)
      fontWeight: '600',
      lineHeight: 16,
    },
  });
};
