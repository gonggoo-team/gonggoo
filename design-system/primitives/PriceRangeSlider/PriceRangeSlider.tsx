/**
 * PriceRangeSlider Component
 *
 * 가격 범위를 선택할 수 있는 듀얼 핸들 슬라이더 컴포넌트입니다.
 * Pan Responder를 사용하여 두 개의 핸들을 독립적으로 드래그할 수 있습니다.
 *
 * 사용 예시:
 * <PriceRangeSlider
 *   min={100}
 *   max={4000000}
 *   value={[10000, 500000]}
 *   onValueChange={(values) => setPriceRange(values)}
 * />
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  PanResponder,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { triggerLightImpact, triggerMediumImpact, triggerSelection } from '../../utils/haptics';
import { createPriceRangeSliderStyles } from './PriceRangeSlider.styles';
import { ValueTooltip } from './components/ValueTooltip';

/**
 * PriceRangeSlider Props
 */
export interface PriceRangeSliderProps {
  /** 최소값 (원) */
  min: number;

  /** 최대값 (원) */
  max: number;

  /** 현재 선택된 범위 [최소가격, 최대가격] */
  value: [number, number];

  /** 값 변경 핸들러 */
  onValueChange: (value: [number, number]) => void;

  /** 가격 변동 단위 (원). 기본값: 10000 */
  step?: number;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 커스텀 스타일 (컨테이너) */
  style?: StyleProp<ViewStyle>;

  /** 테스트 ID */
  testID?: string;

  /** 드래그 시작 콜백 (스크롤 비활성화용) */
  onDragStart?: () => void;

  /** 드래그 종료 콜백 (스크롤 재활성화용) */
  onDragEnd?: () => void;
}

/**
 * 가격 포맷팅 유틸리티
 * 예: 1000 -> "1,000원", 4000000 -> "4,000,000원"
 */
const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ko-KR')}원`;
};

/**
 * PriceRangeSlider Component
 */
export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onValueChange,
  step = 10000,
  disabled = false,
  style,
  testID,
  onDragStart,
  onDragEnd,
}) => {
  const { theme } = useTheme();
  const styles = createPriceRangeSliderStyles(theme);

  // 슬라이더 트랙 너비를 미리 계산 (containerPaddingHorizontal = 24 * 2 = 48)
  const screenWidth = Dimensions.get('window').width;
  const initialTrackWidth = screenWidth - 48; // 48 = paddingHorizontal 24 * 2

  // 슬라이더 트랙 너비 (초기값을 계산된 값으로 설정)
  const [trackWidth, setTrackWidth] = useState(initialTrackWidth);

  // 로컬 state로 드래그 중 값 관리 (부드러운 드래그 경험)
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  // 드래그 중인 핸들 ('min' | 'max' | null)
  const [activeHandle, setActiveHandle] = useState<'min' | 'max' | null>(null);

  // 드래그 시작 시의 로컬 값 저장
  const dragStartValue = useRef<[number, number]>([0, 0]);

  // Step 변경 감지를 위한 이전 값
  const previousValue = useRef<[number, number]>(value);

  // 애니메이션: 핸들 scale
  const minHandleScale = useRef(new Animated.Value(1)).current;
  const maxHandleScale = useRef(new Animated.Value(1)).current;

  // 클로저 문제 해결: 최신 값을 참조하기 위한 ref
  const localValueRef = useRef(localValue);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const stepRef = useRef(step);

  // props value 변경 시 로컬 값 동기화
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 최신 값을 ref에 동기화
  useEffect(() => {
    localValueRef.current = localValue;
    minRef.current = min;
    maxRef.current = max;
    stepRef.current = step;
  }, [localValue, min, max, step]);

  // 값을 픽셀 위치로 변환 (useCallback으로 메모이제이션)
  const valueToPosition = useCallback((val: number): number => {
    if (trackWidth === 0) return 0;
    const percentage = (val - min) / (max - min);
    return percentage * trackWidth;
  }, [trackWidth, min, max]);

  // 픽셀 위치를 값으로 변환 (useCallback으로 메모이제이션)
  const positionToValue = useCallback((position: number): number => {
    if (trackWidth === 0) return min;
    const percentage = Math.max(0, Math.min(1, position / trackWidth));

    // 양 끝에서는 정확한 min/max 값 반환 (step 무시)
    if (percentage === 0) return min;
    if (percentage === 1) return max;

    const rawValue = min + percentage * (max - min);

    // step 단위로 반올림
    const steppedValue = Math.round(rawValue / step) * step;

    // min, max 범위 내로 제한
    return Math.max(min, Math.min(max, steppedValue));
  }, [trackWidth, min, max, step]);

  // 최소 핸들 Pan Responder (trackWidth, disabled만 의존)
  const minPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
          setActiveHandle('min');
          // 드래그 시작 시 현재 로컬 값 저장
          dragStartValue.current = [localValueRef.current[0], localValueRef.current[1]];
          previousValue.current = [localValueRef.current[0], localValueRef.current[1]];

          // 햅틱 피드백: 드래그 시작
          triggerLightImpact();

          // 스크롤 비활성화 콜백 호출
          onDragStart?.();

          // 애니메이션: 핸들 확대
          Animated.spring(minHandleScale, {
            toValue: 1.2,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          // 시작 값의 픽셀 위치 + 이동 거리로 새로운 위치 계산
          const startPosition = valueToPosition(dragStartValue.current[0]);
          const newPosition = startPosition + gestureState.dx;
          const newValue = positionToValue(newPosition);

          // 최소값이 최대값을 넘지 않도록 제한
          const maxLimit = dragStartValue.current[1] - stepRef.current;
          const clampedValue = Math.max(minRef.current, Math.min(newValue, maxLimit));

          // 로컬 state만 업데이트 (부드러운 드래그)
          if (clampedValue !== localValueRef.current[0]) {
            // Step 변경 감지 → 햅틱 피드백
            if (clampedValue !== previousValue.current[0]) {
              triggerSelection();
              previousValue.current = [clampedValue, previousValue.current[1]];
            }

            const newLocalValue: [number, number] = [clampedValue, localValueRef.current[1]];
            setLocalValue(newLocalValue);
          }
        },
        onPanResponderRelease: () => {
          setActiveHandle(null);

          // 햅틱 피드백: 드래그 완료
          triggerMediumImpact();

          // 스크롤 재활성화 콜백 호출
          onDragEnd?.();

          // 애니메이션: 핸들 원래 크기로
          Animated.spring(minHandleScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();

          // 드래그 완료 시 부모에 최종 값 전달
          onValueChange([localValueRef.current[0], localValueRef.current[1]]);
        },
        onPanResponderTerminate: () => {
          setActiveHandle(null);

          // 스크롤 재활성화 콜백 호출
          onDragEnd?.();

          // 애니메이션: 핸들 원래 크기로
          Animated.spring(minHandleScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();

          // 드래그 취소 시에도 부모에 현재 값 전달
          onValueChange([localValueRef.current[0], localValueRef.current[1]]);
        },
      }),
    [trackWidth, disabled, valueToPosition, positionToValue, minHandleScale, onDragStart, onDragEnd]
  );

  // 최대 핸들 Pan Responder (trackWidth, disabled만 의존)
  const maxPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
          setActiveHandle('max');
          // 드래그 시작 시 현재 로컬 값 저장
          dragStartValue.current = [localValueRef.current[0], localValueRef.current[1]];
          previousValue.current = [localValueRef.current[0], localValueRef.current[1]];

          // 햅틱 피드백: 드래그 시작
          triggerLightImpact();

          // 스크롤 비활성화 콜백 호출
          onDragStart?.();

          // 애니메이션: 핸들 확대
          Animated.spring(maxHandleScale, {
            toValue: 1.2,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          // 시작 값의 픽셀 위치 + 이동 거리로 새로운 위치 계산
          const startPosition = valueToPosition(dragStartValue.current[1]);
          const newPosition = startPosition + gestureState.dx;
          const newValue = positionToValue(newPosition);

          // 최대값이 최소값보다 작아지지 않도록 제한
          const minLimit = dragStartValue.current[0] + stepRef.current;
          const clampedValue = Math.min(maxRef.current, Math.max(newValue, minLimit));

          // 로컬 state만 업데이트 (부드러운 드래그)
          if (clampedValue !== localValueRef.current[1]) {
            // Step 변경 감지 → 햅틱 피드백
            if (clampedValue !== previousValue.current[1]) {
              triggerSelection();
              previousValue.current = [previousValue.current[0], clampedValue];
            }

            const newLocalValue: [number, number] = [localValueRef.current[0], clampedValue];
            setLocalValue(newLocalValue);
          }
        },
        onPanResponderRelease: () => {
          setActiveHandle(null);

          // 햅틱 피드백: 드래그 완료
          triggerMediumImpact();

          // 스크롤 재활성화 콜백 호출
          onDragEnd?.();

          // 애니메이션: 핸들 원래 크기로
          Animated.spring(maxHandleScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();

          // 드래그 완료 시 부모에 최종 값 전달
          onValueChange([localValueRef.current[0], localValueRef.current[1]]);
        },
        onPanResponderTerminate: () => {
          setActiveHandle(null);

          // 스크롤 재활성화 콜백 호출
          onDragEnd?.();

          // 애니메이션: 핸들 원래 크기로
          Animated.spring(maxHandleScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();

          // 드래그 취소 시에도 부모에 현재 값 전달
          onValueChange([localValueRef.current[0], localValueRef.current[1]]);
        },
      }),
    [trackWidth, disabled, valueToPosition, positionToValue, maxHandleScale, onDragStart, onDragEnd]
  );

  // 트랙 레이아웃 측정
  const handleTrackLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
  };

  // 핸들 위치 계산 (로컬 값 기준)
  const minPosition = useMemo(() => {
    return valueToPosition(localValue[0]);
  }, [trackWidth, localValue, valueToPosition]);

  const maxPosition = useMemo(() => {
    return valueToPosition(localValue[1]);
  }, [trackWidth, localValue, valueToPosition]);

  // 컨테이너 스타일
  const containerStyle = [
    styles.container,
    disabled && styles.disabled,
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      {/* 가격 범위 레이블 (슬라이더 위로 이동) */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{formatPrice(min)}</Text>
        <Text style={styles.labelText}>{formatPrice(max)}</Text>
      </View>

      {/* 슬라이더 트랙 */}
      <View style={styles.trackContainer}>
        {/* 배경 트랙 */}
        <View
          style={styles.trackBackground}
          onLayout={handleTrackLayout}
        />

        {/* 선택된 범위 트랙 */}
        <View
          style={[
            styles.trackSelected,
            {
              left: minPosition,
              width: maxPosition - minPosition,
            },
          ]}
        />

        {/* 최소값 핸들 */}
        <Animated.View
          {...minPanResponder.panHandlers}
          style={[
            styles.handle,
            {
              left: minPosition,
              transform: [
                { translateX: -22 }, // 중앙 정렬
                { scale: minHandleScale }, // 애니메이션
              ],
            },
            activeHandle === 'min' && styles.handleActive,
          ]}
        >
          <View style={styles.handleInner} />
        </Animated.View>

        {/* 최대값 핸들 */}
        <Animated.View
          {...maxPanResponder.panHandlers}
          style={[
            styles.handle,
            {
              left: maxPosition,
              transform: [
                { translateX: -22 }, // 중앙 정렬
                { scale: maxHandleScale }, // 애니메이션
              ],
            },
            activeHandle === 'max' && styles.handleActive,
          ]}
        >
          <View style={styles.handleInner} />
        </Animated.View>

        {/* ValueTooltip: 최소값 */}
        <ValueTooltip
          value={localValue[0]}
          position={minPosition}
          visible={activeHandle === 'min'}
          type="min"
        />

        {/* ValueTooltip: 최대값 */}
        <ValueTooltip
          value={localValue[1]}
          position={maxPosition}
          visible={activeHandle === 'max'}
          type="max"
        />
      </View>
    </View>
  );
};
