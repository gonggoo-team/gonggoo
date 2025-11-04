import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptics 유틸리티
 *
 * 햅틱 피드백을 쉽게 사용할 수 있도록 래핑한 함수들
 * 플랫폼별 fallback 처리 포함
 */

/**
 * 가벼운 진동 피드백
 * 용도: 버튼 클릭, 드래그 시작 등 가벼운 인터랙션
 */
export const triggerLightImpact = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Silently fail if haptics not supported
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 중간 강도 진동 피드백
 * 용도: 드래그 완료, 중요한 액션 완료
 */
export const triggerMediumImpact = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 강한 진동 피드백
 * 용도: 에러 발생, 경고 등 강조가 필요한 경우
 */
export const triggerHeavyImpact = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 선택 피드백 (미세한 진동)
 * 용도: 슬라이더 step 변경, 리스트 스크롤 등
 */
export const triggerSelection = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.selectionAsync();
  } catch (error) {
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 성공 알림
 * 용도: 작업 완료, 저장 성공 등
 */
export const triggerSuccess = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 경고 알림
 * 용도: 유효하지 않은 입력, 경고 메시지 등
 */
export const triggerWarning = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 에러 알림
 * 용도: 에러 발생, 실패 등
 */
export const triggerError = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.debug('Haptics not supported:', error);
  }
};

/**
 * 햅틱 지원 여부 확인
 */
export const isHapticsSupported = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};
