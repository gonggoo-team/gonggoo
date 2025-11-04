/**
 * CountdownTimer Component
 *
 * 마감 시간까지 남은 시간을 실시간으로 표시하는 카운트다운 타이머입니다.
 * HH:MM:SS 형식으로 표시되며, 알람 아이콘과 함께 렌더링됩니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6490&m=dev
 * 마지막 동기화: 2025-10-09
 *
 * 사용 예시:
 * ```tsx
 * <CountdownTimer
 *   targetTime={new Date('2025-10-10T23:59:59')}
 *   onExpire={() => console.log('마감되었습니다!')}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import { createCountdownTimerStyles } from './CountdownTimer.styles';
import type { CountdownTimerProps } from './CountdownTimer.types';

/**
 * 남은 시간 계산 함수
 */
const calculateTimeRemaining = (targetTime: Date | string): string => {
  const now = new Date().getTime();
  const target = typeof targetTime === 'string' ? new Date(targetTime).getTime() : targetTime.getTime();
  const difference = target - now;

  // 마감된 경우
  if (difference <= 0) {
    return '00:00:00';
  }

  // 시간, 분, 초 계산
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // 2자리 포맷팅
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
};

/**
 * CountdownTimer Component
 */
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTime,
  onExpire,
  textColor,
  iconColor,
}) => {
  const { theme } = useTheme();
  const styles = createCountdownTimerStyles(theme);

  // 기본 색상을 테마에서 가져오기 (Figma 기준: 오늘 마감 타이머는 빨간색)
  const defaultColor = theme.colors.surface.env.accent;
  const finalTextColor = textColor || defaultColor;
  const finalIconColor = iconColor || defaultColor;

  const [timeString, setTimeString] = useState<string>(calculateTimeRemaining(targetTime));
  const hasExpired = useRef(false);

  useEffect(() => {
    // 1초마다 업데이트
    const intervalId = setInterval(() => {
      const newTimeString = calculateTimeRemaining(targetTime);
      setTimeString(newTimeString);

      // 마감되었고 아직 콜백이 호출되지 않았다면
      if (newTimeString === '00:00:00' && !hasExpired.current && onExpire) {
        hasExpired.current = true;
        onExpire();
      }
    }, 1000);

    // 컴포넌트 언마운트 시 cleanup (메모리 누수 방지)
    return () => {
      clearInterval(intervalId);
    };
  }, [targetTime, onExpire]);

  return (
    <View
      style={styles.container}
      accessibilityRole="timer"
      accessibilityLabel={`마감까지 ${timeString} 남음`}
    >
      {/* 알람 아이콘 */}
      <View style={styles.iconContainer}>
        <Icon name="alarm-fill" size={24} color={finalIconColor} />
      </View>

      {/* 시간 표시 */}
      <Text style={[styles.timeText, { color: finalTextColor }]}>
        {timeString}
      </Text>
    </View>
  );
};
