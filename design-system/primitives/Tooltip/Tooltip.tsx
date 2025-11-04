/**
 * Tooltip Component
 *
 * 정보를 표시하는 툴팁 오버레이 컴포넌트입니다.
 * 모달 형태로 화면 중앙에 표시되며, 어두운 배경과 함께 나타납니다.
 *
 * 사용 예시:
 * <Tooltip
 *   visible={isVisible}
 *   title="슬롯이란?"
 *   description="슬롯은 공구 참여 단위예요.\n1슬롯은 내가 맡을 상품 몫을 의미합니다."
 *   example="예: 티슈 8개를 4슬롯으로 나누면,\n1슬롯 = 티슈 2개, 2슬롯을 구매하면 총 티슈 4개를 구매할 수 있어요."
 *   onClose={() => setIsVisible(false)}
 * />
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import { createTooltipStyles } from './Tooltip.styles';

/**
 * Tooltip Props
 */
export interface TooltipProps {
  /** 표시 여부 */
  visible: boolean;

  /** 제목 */
  title: string;

  /** 주요 설명 */
  description: string;

  /** 예시 설명 (선택적, 회색 텍스트) */
  example?: string;

  /** 닫기 핸들러 */
  onClose: () => void;

  /** 커스텀 스타일 (컨텐츠 컨테이너) */
  style?: StyleProp<ViewStyle>;

  /** 테스트 ID */
  testID?: string;
}

/**
 * Tooltip Component
 */
export const Tooltip: React.FC<TooltipProps> = ({
  visible,
  title,
  description,
  example,
  onClose,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = createTooltipStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      {/* 배경 (어두운 오버레이) */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          {/* 툴팁 컨텐츠 */}
          <TouchableWithoutFeedback>
            <View style={[styles.container, style]}>
              {/* 닫기 버튼 */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="닫기"
              >
                <Icon name="x" size={24} color={theme.colors.surface.texticon.onnormal.icon.black} />
              </TouchableOpacity>

              {/* 제목 */}
              <Text style={styles.title}>{title}</Text>

              {/* 주요 설명 */}
              <Text style={styles.description}>{description}</Text>

              {/* 예시 설명 (선택적) */}
              {example && <Text style={styles.example}>{example}</Text>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
