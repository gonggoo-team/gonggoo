/**
 * ProductOptionsMenu Component
 *
 * 상품 상세 화면에서 소유자만 볼 수 있는 옵션 메뉴 (모집 취소, 수정하기)
 * - 드롭다운 형태로 표시
 * - 다양한 디바이스 크기에서 적절하게 작동
 *
 * Figma: node-id=1431-15088
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks';
import type { ProductOptionsMenuProps } from './ProductOptionsMenu.types';

/**
 * Options 아이콘 (세로 점 3개)
 */
const OptionsIcon: React.FC<{ color?: string }> = ({ color = 'white' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12ZM10 6C10 6.53043 10.2107 7.03914 10.5858 7.41421C10.9609 7.78929 11.4696 8 12 8C12.5304 8 13.0391 7.78929 13.4142 7.41421C13.7893 7.03914 14 6.53043 14 6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4C11.4696 4 10.9609 4.21071 10.5858 4.58579C10.2107 4.96086 10 5.46957 10 6ZM10 18C10 18.5304 10.2107 19.0391 10.5858 19.4142C10.9609 19.7893 11.4696 20 12 20C12.5304 20 13.0391 19.7893 13.4142 19.4142C13.7893 19.0391 14 18.5304 14 18C14 17.4696 13.7893 16.9609 13.4142 16.5858C13.0391 16.2107 12.5304 16 12 16C11.4696 16 10.9609 16.2107 10.5858 16.5858C10.2107 16.9609 10 17.4696 10 18Z"
      fill={color}
    />
  </Svg>
);

/**
 * 페이딩 옵션 아이콘 (스크롤에 따라 색상 변경)
 */
const FadingOptionsIcon: React.FC<{
  blackOpacity?: Animated.AnimatedInterpolation<number>;
  whiteOpacity?: Animated.AnimatedInterpolation<number>;
  blackIconColor?: string;
}> = ({ blackOpacity, whiteOpacity, blackIconColor = '#000000' }) => {
  if (!blackOpacity || !whiteOpacity) {
    // 애니메이션이 없으면 기본 흰색 아이콘
    return <OptionsIcon color="white" />;
  }

  return (
    <View style={{ width: 24, height: 24 }}>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, opacity: blackOpacity }}>
        <OptionsIcon color={blackIconColor} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, opacity: whiteOpacity }}>
        <OptionsIcon color="white" />
      </Animated.View>
    </View>
  );
};

export const ProductOptionsMenu: React.FC<ProductOptionsMenuProps> = ({
  onCancel,
  onEdit,
  iconColor,
  blackOpacity,
  whiteOpacity,
  blackIconColor,
}) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  /**
   * 메뉴 열기/닫기
   */
  const toggleMenu = () => {
    if (!visible && buttonRef.current) {
      // 버튼 위치 측정
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setPosition({
          top: pageY + height + 4, // 버튼 아래 4px 간격
          right: 20, // 화면 오른쪽 끝에서 20px
        });
        setVisible(true);
      });
    } else {
      setVisible(false);
    }
  };

  /**
   * 메뉴 닫기
   */
  const closeMenu = () => {
    setVisible(false);
  };

  /**
   * 모집 취소 핸들러
   */
  const handleCancel = () => {
    closeMenu();
    onCancel();
  };

  /**
   * 수정하기 핸들러
   */
  const handleEdit = () => {
    closeMenu();
    onEdit();
  };

  return (
    <>
      {/* 옵션 버튼 */}
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <FadingOptionsIcon
            blackOpacity={blackOpacity}
            whiteOpacity={whiteOpacity}
            blackIconColor={blackIconColor}
          />
        </TouchableOpacity>
      </View>

      {/* 드롭다운 메뉴 */}
      {visible && (
        <Modal
          transparent
          visible={visible}
          onRequestClose={closeMenu}
          animationType="fade"
        >
          {/* 배경 터치 시 닫기 */}
          <Pressable style={styles.overlay} onPress={closeMenu}>
            {/* 메뉴 박스 */}
            <View
              style={[
                styles.menuContainer,
                {
                  top: position.top,
                  right: position.right,
                },
              ]}
            >
              {/* 모집 취소 */}
              <TouchableOpacity
                style={[styles.menuItemTop, { backgroundColor: theme.colors.surface.normal.bg1 }]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.surface.texticon.onnormal.text.black,
                    },
                  ]}
                >
                  모집 취소
                </Text>
              </TouchableOpacity>

              {/* 수정하기 */}
              <TouchableOpacity
                style={[styles.menuItemBottom, { backgroundColor: theme.colors.surface.normal.bg1 }]}
                onPress={handleEdit}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.surface.texticon.onnormal.text.black,
                    },
                  ]}
                >
                  수정하기
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    width: 102,
    borderRadius: 4,
    // Figma 기준 box shadow
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(100, 100, 111, 0.2)',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 1,
        shadowRadius: 29,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuItemTop: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  menuItemBottom: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  menuItemText: {
    lineHeight: 15.5, // 13 * 1.193359375
    letterSpacing: -0.325, // 13 * -0.025
  },
});
