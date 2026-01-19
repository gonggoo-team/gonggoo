/**
 * GNB (Global Navigation Bar) Component
 *
 * 동적 3섹션 시스템으로 모든 화면에서 재사용 가능한 GNB 컴포넌트입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6474&m=dev
 * 마지막 동기화: 2025-10-08
 *
 * 사용 예시:
 * ```tsx
 * // 홈 화면
 * <GNB
 *   leftSection={{ type: 'logo-text', text: '공구팟' }}
 *   rightIcons={[
 *     { type: 'search', onPress: () => {} },
 *     { type: 'cart', badge: { count: 3 }, onPress: () => {} },
 *   ]}
 * />
 *
 * // 상세 페이지
 * <GNB
 *   leftSection={{ type: 'back', onPress: () => router.back() }}
 *   centerSection={{ type: 'title', text: '상품 상세' }}
 *   rightIcons={[{ type: 'share', onPress: () => {} }]}
 * />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
import { SearchBar } from '../../primitives/SearchBar';

import { createGNBStyles } from './GNB.styles';
import type { GNBProps, RightIconConfig } from './GNB.types';

/**
 * 아이콘 타입별 IconName 매핑
 */
const ICON_TYPE_MAP = {
  search: 'search',
  cart: 'cart',
  notification: 'bell-off',
  share: 'share',
  menu: 'hamburger',
  filter: 'filter',
  more: 'hamburger',
  x: 'x',
  back: 'back',
  close: 'x',
  settings: 'settings',
} as const;

/** 터치 영역 확대를 위한 hitSlop */
const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 };

/** Pressable 스타일 헬퍼: pressed 상태에서 opacity 적용 */
const createPressedStyle = (
  baseStyle?: StyleProp<ViewStyle>,
  pressed?: boolean
): StyleProp<ViewStyle> => [baseStyle, pressed && { opacity: 0.7 }];

/**
 * GNB Component
 */
export const GNB: React.FC<GNBProps> = ({
  leftSection,
  centerSection,
  rightIcons = [],
  rightTextButton,
}) => {
  const { theme } = useTheme();
  const styles = createGNBStyles(theme);
  const insets = useSafeAreaInsets();

  /**
   * 왼쪽 섹션 렌더링
   */
  const renderLeftSection = () => {
    if (!leftSection) return <View style={styles.leftSection} />;

    switch (leftSection.type) {
      case 'logo-text':
        return (
          <View style={styles.leftSection}>
            <Pressable
              onPress={leftSection.onPress}
              disabled={!leftSection.onPress}
              delayPressIn={0}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => createPressedStyle(undefined, leftSection.onPress ? pressed : false)}
            >
              <Text style={styles.leftLogoText}>{leftSection.text}</Text>
            </Pressable>
          </View>
        );

      case 'logo-image':
        return (
          <View style={styles.leftSection}>
            <Pressable
              onPress={leftSection.onPress}
              disabled={!leftSection.onPress}
              delayPressIn={0}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => createPressedStyle(undefined, leftSection.onPress ? pressed : false)}
            >
              <Image
                source={{ uri: leftSection.uri }}
                style={styles.leftLogoImage}
              />
            </Pressable>
          </View>
        );

      case 'back':
      case 'close':
      case 'menu':
        return (
          <View style={styles.leftSection}>
            <Pressable
              onPress={leftSection.onPress}
              delayPressIn={0}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => createPressedStyle(styles.leftButton, pressed)}
              accessibilityRole="button"
              accessibilityLabel={
                leftSection.type === 'back'
                  ? '뒤로가기'
                  : leftSection.type === 'close'
                  ? '닫기'
                  : '메뉴'
              }
            >
              <Icon
                name={ICON_TYPE_MAP[leftSection.type]}
                size={theme.dimensions.iconSize.md}
                color={theme.colors.surface.texticon.onnormal.icon.black}
              />
            </Pressable>
          </View>
        );

      case 'address':
        return (
          <View style={styles.leftSection}>
            <Pressable
              onPress={leftSection.onPress}
              delayPressIn={0}
              hitSlop={HIT_SLOP}
              style={({ pressed }) => createPressedStyle(styles.addressButton, pressed)}
              accessibilityRole="button"
              accessibilityLabel={`현재 위치: ${leftSection.text}`}
            >
              <Text
                style={styles.addressText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {leftSection.text}
              </Text>
              <Icon
                name="drop"
                size={theme.dimensions.iconSize.sm}
                color={theme.colors.surface.texticon.onnormal.icon.black}
              />
            </Pressable>
          </View>
        );

      case 'back-with-title':
        return (
          <View style={styles.leftSection}>
            <View style={styles.backWithTitleContainer}>
              <Pressable
                onPress={leftSection.onPress}
                delayPressIn={0}
                hitSlop={HIT_SLOP}
                style={({ pressed }) => createPressedStyle(styles.leftButton, pressed)}
                accessibilityRole="button"
                accessibilityLabel="뒤로가기"
              >
                <Icon
                  name={ICON_TYPE_MAP.back}
                  size={theme.dimensions.iconSize.md}
                  color={theme.colors.surface.texticon.onnormal.icon.black}
                />
              </Pressable>
              <Text style={styles.leftSectionTitle} numberOfLines={1}>
                {leftSection.title}
              </Text>
            </View>
          </View>
        );

      default:
        return <View style={styles.leftSection} />;
    }
  };

  /**
   * 중앙 섹션 렌더링
   */
  const renderCenterSection = () => {
    if (!centerSection || centerSection.type === 'none') {
      return <View style={styles.centerSection} />;
    }

    switch (centerSection.type) {
      case 'logo-text':
        return (
          <View style={styles.centerSection}>
            <Text style={styles.centerLogoText} numberOfLines={1}>
              {centerSection.text}
            </Text>
          </View>
        );

      case 'logo-image':
        return (
          <View style={styles.centerSection}>
            <Image
              source={{ uri: centerSection.uri }}
              style={styles.centerLogoImage}
            />
          </View>
        );

      case 'title':
        return (
          <View style={styles.centerSection}>
            <Text style={styles.centerTitle} numberOfLines={1}>
              {centerSection.text}
            </Text>
          </View>
        );

      case 'search-bar':
        return (
          <View style={[styles.centerSection, styles.centerSearchBar]}>
            <SearchBar
              value={centerSection.value}
              onChangeText={centerSection.onChangeText}
              placeholder={centerSection.placeholder || '검색'}
              onSubmitEditing={centerSection.onSubmit}
            />
          </View>
        );

      case 'custom':
        return (
          <View style={styles.centerSection}>
            {centerSection.component}
          </View>
        );

      default:
        return <View style={styles.centerSection} />;
    }
  };

  /**
   * 배지 렌더링
   */
  const renderBadge = (badge?: RightIconConfig['badge'], iconType?: string) => {
    if (!badge) return null;

    // 점 배지
    if (badge.dot) {
      return <View style={styles.dotBadge} />;
    }

    // 숫자 배지
    if (badge.count !== undefined && badge.count > 0) {
      const displayCount = badge.count > 99 ? '99+' : badge.count.toString();
      return (
        <View style={styles.countBadge}>
          <Text style={styles.badgeText}>{displayCount}</Text>
        </View>
      );
    }

    return null;
  };

  /**
   * 개별 아이콘 렌더링
   */
  const renderIcon = (iconConfig: RightIconConfig, index: number) => {
    const iconName = iconConfig.type === 'notification' && iconConfig.badge?.dot
      ? 'bell-on'
      : ICON_TYPE_MAP[iconConfig.type];

    return (
      <Pressable
        key={`${iconConfig.type}-${index}`}
        onPress={iconConfig.onPress}
        delayPressIn={0}
        hitSlop={HIT_SLOP}
        style={({ pressed }) => createPressedStyle(styles.iconButton, pressed)}
        accessibilityRole="button"
        accessibilityLabel={iconConfig.accessibilityLabel || iconConfig.type}
      >
        <Icon
          name={iconName}
          size={theme.dimensions.iconSize.md}
          color={theme.colors.surface.texticon.onnormal.icon.black}
        />
        {renderBadge(iconConfig.badge, iconConfig.type)}
      </Pressable>
    );
  };

  /**
   * 오른쪽 섹션 렌더링
   */
  const renderRightSection = () => {
    // 텍스트 버튼이 있으면 텍스트 버튼 렌더링 (아이콘 대신)
    if (rightTextButton) {
      const variant = rightTextButton.variant || 'primary';
      const variantStyle =
        variant === 'secondary' ? styles.rightTextButtonSecondary :
        variant === 'danger' ? styles.rightTextButtonDanger :
        styles.rightTextButtonPrimary;

      return (
        <View style={styles.rightSection}>
          <Pressable
            onPress={rightTextButton.onPress}
            disabled={rightTextButton.disabled}
            delayPressIn={0}
            hitSlop={HIT_SLOP}
            style={({ pressed }) => createPressedStyle(undefined, pressed)}
            accessibilityRole="button"
            accessibilityLabel={rightTextButton.accessibilityLabel || rightTextButton.text}
            accessibilityState={{ disabled: rightTextButton.disabled }}
          >
            <Text
              style={[
                styles.rightTextButton,
                variantStyle,
                rightTextButton.disabled && styles.rightTextButtonDisabled,
              ]}
            >
              {rightTextButton.text}
            </Text>
          </Pressable>
        </View>
      );
    }

    // 아이콘 렌더링
    if (rightIcons.length === 0) {
      return <View style={styles.rightSection} />;
    }

    return (
      <View style={styles.rightSection}>
        {rightIcons.map((icon, index) => renderIcon(icon, index))}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          // paddingTop: insets.top // + theme.spacing.md, // Safe Area + 16px
        },
      ]}
      accessibilityRole="header"
    >
      {renderLeftSection()}
      {renderCenterSection()}
      {renderRightSection()}
    </View>
  );
};
