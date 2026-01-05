/**
 * Auth Service
 *
 * 인증 관련 API 서비스 (Mock 구현)
 * 실제 백엔드 연동 시 이 파일의 함수들을 실제 API 호출로 교체
 */

import type {
  PhoneAuthResult,
  SendCodeResult,
  VerifyCodeResult,
  AuthUser,
  LocationData,
} from '../types';
import * as AuthStorage from './storage/authStorage';
import {
  getMockVerificationCode,
  generateMockAuthToken,
  isPhoneRegistered,
  getMockUserByPhone,
  updateMockUser,
} from './mock/auth.mock';
import { migrateLocationData } from '../utils/locationParser';

/**
 * 인증코드 전송 (Mock)
 *
 * @param phone - 전화번호 (010-XXXX-XXXX)
 * @returns 전송 성공 여부
 */
export async function sendVerificationCode(
  phone: string
): Promise<SendCodeResult> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/auth/send-code', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone }),
    // });

    // Mock: 항상 성공
    await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 딜레이 시뮬레이션

    console.log(`[AuthService] Verification code sent to ${phone}: 123456`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('[AuthService] Failed to send verification code:', error);
    return {
      success: false,
      error: '인증코드 전송에 실패했습니다.',
    };
  }
}

/**
 * 인증코드 검증 (Mock)
 *
 * @param phone - 전화번호
 * @param code - 6자리 인증코드
 * @returns 검증 결과
 */
export async function verifyCode(
  phone: string,
  code: string
): Promise<VerifyCodeResult> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/auth/verify-code', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone, code }),
    // });

    // Mock: 항상 "123456"만 허용
    await new Promise((resolve) => setTimeout(resolve, 300)); // 네트워크 딜레이 시뮬레이션

    const mockCode = getMockVerificationCode(phone);

    if (code !== mockCode) {
      return {
        success: false,
        error: '인증코드가 일치하지 않습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('[AuthService] Failed to verify code:', error);
    return {
      success: false,
      error: '인증코드 검증에 실패했습니다.',
    };
  }
}

/**
 * 전화번호 등록 여부 확인 (Mock)
 *
 * @param phone - 전화번호
 * @returns 등록 여부
 */
export async function checkPhoneExists(phone: string): Promise<boolean> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`/api/auth/check-phone?phone=${phone}`);

    // Mock: 미리 등록된 전화번호 목록 확인
    await new Promise((resolve) => setTimeout(resolve, 200));

    return isPhoneRegistered(phone);
  } catch (error) {
    console.error('[AuthService] Failed to check phone:', error);
    return false;
  }
}

/**
 * 회원가입 (Mock)
 *
 * @param phone - 전화번호
 * @param location - 위치 정보 (선택)
 * @returns 인증 결과 (토큰 및 사용자 정보)
 */
export async function signup(
  phone: string,
  location?: LocationData
): Promise<PhoneAuthResult> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone, location }),
    // });

    // Mock: 새 사용자 생성
    await new Promise((resolve) => setTimeout(resolve, 400));

    const token = generateMockAuthToken(phone);
    const user = getMockUserByPhone(phone);

    // 위치 정보가 있으면 업데이트
    if (location) {
      user.location = location;
      updateMockUser(phone, { location });
    }

    // AsyncStorage에 저장
    await AuthStorage.setIsLoggedIn(true);
    await AuthStorage.setAuthToken(token);
    await AuthStorage.setUserPhone(phone);
    if (location) {
      await AuthStorage.setUserLocation(location);
    }

    console.log('[AuthService] Signup successful:', user);

    return {
      success: true,
      token,
      user,
    };
  } catch (error) {
    console.error('[AuthService] Signup failed:', error);
    return {
      success: false,
      error: '회원가입에 실패했습니다.',
    };
  }
}

/**
 * 로그인 (Mock)
 *
 * @param phone - 전화번호
 * @returns 인증 결과 (토큰 및 사용자 정보)
 */
export async function login(phone: string): Promise<PhoneAuthResult> {
  try {
    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone }),
    // });

    // Mock: 기존 사용자 조회
    await new Promise((resolve) => setTimeout(resolve, 400));

    const exists = isPhoneRegistered(phone);
    if (!exists) {
      return {
        success: false,
        error: '등록되지 않은 전화번호입니다.',
      };
    }

    const token = generateMockAuthToken(phone);
    const user = getMockUserByPhone(phone);

    // AsyncStorage에 저장
    await AuthStorage.setIsLoggedIn(true);
    await AuthStorage.setAuthToken(token);
    await AuthStorage.setUserPhone(phone);
    if (user.location) {
      await AuthStorage.setUserLocation(user.location);
    }

    console.log('[AuthService] Login successful:', user);

    return {
      success: true,
      token,
      user,
    };
  } catch (error) {
    console.error('[AuthService] Login failed:', error);
    return {
      success: false,
      error: '로그인에 실패했습니다.',
    };
  }
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  try {
    // TODO: 실제 API 호출로 교체 (서버에 로그아웃 알림)
    // await fetch('/api/auth/logout', { method: 'POST' });

    // AsyncStorage 정리
    await AuthStorage.clearAuthData();

    console.log('[AuthService] Logout successful');
  } catch (error) {
    console.error('[AuthService] Logout failed:', error);
  }
}

/**
 * 게스트 모드 활성화
 */
export async function enableGuestMode(): Promise<void> {
  try {
    await AuthStorage.setIsGuest(true);
    await AuthStorage.setHasLaunched(true);

    console.log('[AuthService] Guest mode enabled');
  } catch (error) {
    console.error('[AuthService] Failed to enable guest mode:', error);
  }
}

/**
 * 인증 상태 확인
 *
 * @returns 현재 인증 상태
 */
export async function checkAuthStatus(): Promise<{
  hasLaunched: boolean;
  isLoggedIn: boolean;
  isGuest: boolean;
  authToken: string | null;
  userPhone: string | null;
  userLocation: LocationData | null;
}> {
  try {
    const [hasLaunched, isLoggedIn, isGuest, authToken, userPhone, userLocation] =
      await Promise.all([
        AuthStorage.getHasLaunched(),
        AuthStorage.getIsLoggedIn(),
        AuthStorage.getIsGuest(),
        AuthStorage.getAuthToken(),
        AuthStorage.getUserPhone(),
        AuthStorage.getUserLocation(),
      ]);

    return {
      hasLaunched,
      isLoggedIn,
      isGuest,
      authToken,
      userPhone,
      userLocation,
    };
  } catch (error) {
    console.error('[AuthService] Failed to check auth status:', error);
    return {
      hasLaunched: false,
      isLoggedIn: false,
      isGuest: false,
      authToken: null,
      userPhone: null,
      userLocation: null,
    };
  }
}

/**
 * 현재 사용자 정보 조회
 *
 * @returns 현재 로그인된 사용자 정보
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const phone = await AuthStorage.getUserPhone();
    if (!phone) {
      return null;
    }

    // TODO: 실제 API 호출로 교체
    // const response = await fetch('/api/auth/me', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });

    // Mock: AsyncStorage에서 정보 조합
    let location = await AuthStorage.getUserLocation();
    const user = getMockUserByPhone(phone);

    // 위치 정보 마이그레이션
    if (location) {
      const migratedLocation = migrateLocationData(location);
      if (migratedLocation && JSON.stringify(migratedLocation) !== JSON.stringify(location)) {
        console.log('[AuthService] Migrating location data for user:', phone);
        await AuthStorage.setUserLocation(migratedLocation);
        location = migratedLocation;
      }
      user.location = location;
    }

    return user;
  } catch (error) {
    console.error('[AuthService] Failed to get current user:', error);
    return null;
  }
}

/**
 * 위치 정보 업데이트
 *
 * @param location - 위치 정보
 */
export async function updateUserLocation(
  location: LocationData
): Promise<boolean> {
  try {
    const phone = await AuthStorage.getUserPhone();
    if (!phone) {
      return false;
    }

    // TODO: 실제 API 호출로 교체
    // await fetch('/api/user/location', {
    //   method: 'PUT',
    //   body: JSON.stringify({ location }),
    // });

    // Mock: AsyncStorage에 저장
    await AuthStorage.setUserLocation(location);
    updateMockUser(phone, { location });

    console.log('[AuthService] Location updated:', location);

    return true;
  } catch (error) {
    console.error('[AuthService] Failed to update location:', error);
    return false;
  }
}
