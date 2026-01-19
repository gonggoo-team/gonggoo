/**
 * FAB (Floating Action Button) Visibility Context
 *
 * 플로팅 액션 버튼의 가시성을 전역으로 관리합니다.
 * 드롭다운, 모달 등이 열렸을 때 FAB를 숨기는 데 사용됩니다.
 *
 * 사용 예시:
 * ```tsx
 * // Provider 설정 (HomeScreen 등)
 * <FABProvider>
 *   <Content />
 *   <FloatingActionButton visible={isFABVisible} ... />
 * </FABProvider>
 *
 * // 사용처 (SortFilterBar 등)
 * const { hideFAB, showFAB } = useFAB();
 * useEffect(() => {
 *   if (isDropdownOpen) hideFAB();
 *   else showFAB();
 * }, [isDropdownOpen]);
 * ```
 */

import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface FABContextType {
  /** FAB 표시 여부 */
  isFABVisible: boolean;
  /** FAB 숨기기 */
  hideFAB: () => void;
  /** FAB 보이기 */
  showFAB: () => void;
  /** FAB 가시성 토글 */
  toggleFAB: () => void;
}

const FABContext = createContext<FABContextType | undefined>(undefined);

interface FABProviderProps {
  children: ReactNode;
  /** 초기 가시성 (기본값: true) */
  initialVisible?: boolean;
}

/**
 * FAB Provider
 */
export const FABProvider: React.FC<FABProviderProps> = ({
  children,
  initialVisible = true,
}) => {
  const [isFABVisible, setIsFABVisible] = useState(initialVisible);

  const hideFAB = useCallback(() => setIsFABVisible(false), []);
  const showFAB = useCallback(() => setIsFABVisible(true), []);
  const toggleFAB = useCallback(() => setIsFABVisible(prev => !prev), []);

  const value = useMemo<FABContextType>(
    () => ({ isFABVisible, hideFAB, showFAB, toggleFAB }),
    [isFABVisible, hideFAB, showFAB, toggleFAB]
  );

  return (
    <FABContext.Provider value={value}>
      {children}
    </FABContext.Provider>
  );
};

/**
 * FAB Hook
 */
export const useFAB = (): FABContextType => {
  const context = useContext(FABContext);
  if (!context) {
    // Context가 없으면 기본값 반환 (에러 방지)
    return {
      isFABVisible: true,
      hideFAB: () => {},
      showFAB: () => {},
      toggleFAB: () => {},
    };
  }
  return context;
};
