/**
 * AuthContext
 *
 * 전역 인증 상태를 관리하기 위한 Context입니다.
 * - 로그인/로그아웃 상태 관리
 * - 게스트 모드 지원
 * - 사용자 정보 저장
 * - 인증 관련 메서드 제공
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AuthState, AuthUser, LocationData, PhoneAuthResult } from '../types';
import * as AuthService from '../services/authService';

/**
 * Context 타입 정의
 */
interface AuthContextValue extends AuthState {
  /** 회원가입 */
  signup: (phone: string, location?: LocationData) => Promise<PhoneAuthResult>;
  /** 로그인 */
  login: (phone: string) => Promise<PhoneAuthResult>;
  /** 로그아웃 */
  logout: () => Promise<void>;
  /** 게스트 모드 활성화 */
  enableGuestMode: () => Promise<void>;
  /** 인증 상태 확인 */
  checkAuth: () => Promise<void>;
  /** 사용자 정보 업데이트 */
  updateUser: (user: AuthUser) => void;
  /** 위치 정보 업데이트 */
  updateLocation: (location: LocationData) => Promise<boolean>;
}

/**
 * Context 생성
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isGuest: false,
    isLoading: true,
    user: null,
    token: null,
  });

  /**
   * 인증 상태 확인 (앱 시작 시 호출)
   */
  const checkAuth = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const status = await AuthService.checkAuthStatus();

      if (status.isLoggedIn && status.authToken) {
        // 로그인된 사용자
        const user = await AuthService.getCurrentUser();

        setAuthState({
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
          user,
          token: status.authToken,
        });
      } else if (status.isGuest) {
        // 게스트 모드
        setAuthState({
          isAuthenticated: false,
          isGuest: true,
          isLoading: false,
          user: null,
          token: null,
        });
      } else {
        // 로그인 안 됨
        setAuthState({
          isAuthenticated: false,
          isGuest: false,
          isLoading: false,
          user: null,
          token: null,
        });
      }
    } catch (error) {
      console.error('[AuthContext] Failed to check auth:', error);
      setAuthState({
        isAuthenticated: false,
        isGuest: false,
        isLoading: false,
        user: null,
        token: null,
      });
    }
  }, []);

  /**
   * 회원가입
   */
  const signup = useCallback(
    async (phone: string, location?: LocationData): Promise<PhoneAuthResult> => {
      try {
        const result = await AuthService.signup(phone, location);

        if (result.success && result.token && result.user) {
          setAuthState({
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
            user: result.user,
            token: result.token,
          });
        }

        return result;
      } catch (error) {
        console.error('[AuthContext] Signup failed:', error);
        return {
          success: false,
          error: '회원가입에 실패했습니다.',
        };
      }
    },
    []
  );

  /**
   * 로그인
   */
  const login = useCallback(async (phone: string): Promise<PhoneAuthResult> => {
    try {
      const result = await AuthService.login(phone);

      if (result.success && result.token && result.user) {
        setAuthState({
          isAuthenticated: true,
          isGuest: false,
          isLoading: false,
          user: result.user,
          token: result.token,
        });
      }

      return result;
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      return {
        success: false,
        error: '로그인에 실패했습니다.',
      };
    }
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();

      setAuthState({
        isAuthenticated: false,
        isGuest: false,
        isLoading: false,
        user: null,
        token: null,
      });
    } catch (error) {
      console.error('[AuthContext] Logout failed:', error);
    }
  }, []);

  /**
   * 게스트 모드 활성화
   */
  const enableGuestMode = useCallback(async () => {
    try {
      await AuthService.enableGuestMode();

      setAuthState({
        isAuthenticated: false,
        isGuest: true,
        isLoading: false,
        user: null,
        token: null,
      });
    } catch (error) {
      console.error('[AuthContext] Failed to enable guest mode:', error);
    }
  }, []);

  /**
   * 사용자 정보 업데이트 (로컬 상태만)
   */
  const updateUser = useCallback((user: AuthUser) => {
    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  }, []);

  /**
   * 위치 정보 업데이트
   */
  const updateLocation = useCallback(
    async (location: LocationData): Promise<boolean> => {
      try {
        const success = await AuthService.updateUserLocation(location);

        if (success && authState.user) {
          setAuthState((prev) => ({
            ...prev,
            user: prev.user
              ? {
                  ...prev.user,
                  location,
                }
              : null,
          }));
        }

        return success;
      } catch (error) {
        console.error('[AuthContext] Failed to update location:', error);
        return false;
      }
    },
    [authState.user]
  );

  /**
   * 앱 시작 시 인증 상태 확인
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Context value (메모이제이션)
   */
  const value = useMemo(
    () => ({
      ...authState,
      signup,
      login,
      logout,
      enableGuestMode,
      checkAuth,
      updateUser,
      updateLocation,
    }),
    [authState, signup, login, logout, enableGuestMode, checkAuth, updateUser, updateLocation]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * AuthContext를 사용하는 커스텀 훅
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
