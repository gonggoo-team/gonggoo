/**
 * DropdownOverlay Component
 *
 * 드롭다운 메뉴를 위한 오버레이 컴포넌트입니다.
 * React Native Modal을 사용하여 독립적인 레이어에 렌더링합니다.
 * 드롭다운 외부 영역 클릭 시 닫기 기능을 제공합니다.
 *
 * 사용 예시:
 * <DropdownOverlay visible={isOpen} onClose={() => setIsOpen(false)}>
 *   <View style={styles.dropdownContainer}>
 *     <DropdownMenu ... />
 *   </View>
 * </DropdownOverlay>
 */

import React from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * DropdownOverlay Props
 */
export interface DropdownOverlayProps {
  /** 오버레이 표시 여부 */
  visible: boolean;

  /** 닫기 핸들러 (외부 클릭 시 호출) */
  onClose: () => void;

  /** 드롭다운 메뉴 컴포넌트 */
  children: React.ReactNode;

  /** 컨테이너 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;
}

/**
 * DropdownOverlay Component
 *
 * Modal을 사용하여 완전히 독립적인 네이티브 레이어에 렌더링합니다.
 * 이를 통해 모든 UI 요소 위에 드롭다운을 표시할 수 있습니다.
 */
export const DropdownOverlay: React.FC<DropdownOverlayProps> = ({
  visible,
  onClose,
  children,
  style,
}) => {
  // 드롭다운 메뉴 영역 클릭 시 닫기 방지
  const handleDropdownPress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, style]}>
          {/* 드롭다운 메뉴 (절대 위치) - 이 영역 클릭 시 닫기 방지 */}
          <TouchableWithoutFeedback onPress={handleDropdownPress}>
            {children}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
