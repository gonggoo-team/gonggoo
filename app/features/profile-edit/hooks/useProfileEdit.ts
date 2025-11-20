/**
 * Profile Edit Hook
 *
 * 프로필 수정 화면의 상태 관리 및 로직을 담당하는 Hook
 * - 닉네임 관리
 * - 프로필 이미지 관리
 * - 에러 상태 관리
 * - 저장 로직
 */

import { useState, useCallback } from 'react';
import { useImagePicker } from '@/app/shared/hooks';

export function useProfileEdit() {
  // 닉네임 상태
  const [nickname, setNickname] = useState('만댱'); // 초기값: 기존 닉네임
  const [hasError, setHasError] = useState(false);

  // 프로필 이미지 (useImagePicker 재사용)
  const { profileImageUri, handleImagePick } = useImagePicker();

  /**
   * 닉네임 변경 핸들러
   * 에러가 있었다면 입력 시 에러 해제
   */
  const handleNicknameChange = useCallback((text: string) => {
    setNickname(text);

    // 입력이 있으면 에러 해제
    if (hasError && text.trim().length > 0) {
      setHasError(false);
    }
  }, [hasError]);

  /**
   * 닉네임 초기화 핸들러
   */
  const handleNicknameClear = useCallback(() => {
    setNickname('');
    setHasError(false);
  }, []);

  /**
   * 저장 핸들러
   * 닉네임이 비어있으면 에러 표시
   */
  const handleSave = useCallback(() => {
    const trimmedNickname = nickname.trim();

    // 닉네임 유효성 검사
    if (!trimmedNickname) {
      setHasError(true);
      return false;
    }

    // TODO: API 호출하여 프로필 저장
    console.log('[useProfileEdit] 프로필 저장:', {
      nickname: trimmedNickname,
      profileImageUri,
    });

    // 저장 성공
    setHasError(false);
    return true;
  }, [nickname, profileImageUri]);

  return {
    // 상태
    nickname,
    profileImageUri,
    hasError,

    // 핸들러
    handleNicknameChange,
    handleNicknameClear,
    handleImagePick,
    handleSave,
  };
}
