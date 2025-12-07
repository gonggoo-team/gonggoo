/**
 * Timer Display Component
 *
 * 인증코드 입력 제한 시간 표시 (5분 = 300초)
 */

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';

interface TimerDisplayProps {
  /** 타이머 시작 여부 */
  isRunning: boolean;
  /** 제한 시간 (초) */
  duration?: number;
  /** 타이머 만료 시 콜백 */
  onExpire?: () => void;
}

export function TimerDisplay({
  isRunning,
  duration = 300, // 5분
  onExpire,
}: TimerDisplayProps) {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (isRunning) {
      setTimeLeft(duration); // 타이머 시작 시 리셋
    }
  }, [isRunning, duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onExpire]);

  /**
   * 시간 포맷팅 (MM:SS)
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTextColor = () => {
    // 1분 미만일 때 빨간색
    if (timeLeft < 60) {
      return theme.colors.surface.env.accent;
    }
    return theme.colors.surface.texticon.onnormal.text.midEmp;
  };

  if (!isRunning) {
    return null;
  }

  return (
    <Text
      style={[
        styles.timer,
        {
          color: getTextColor(),
          fontFamily: theme.typography.fontFamily.primary,
        },
      ]}
    >
      {formatTime(timeLeft)}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginVertical: 8,
  },
});
