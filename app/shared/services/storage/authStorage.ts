/**
 * Auth Storage Service
 *
 * AsyncStorage를 사용하여 인증 관련 데이터를 관리합니다.
 *
 * 저장되는 데이터:
 * - hasLaunched: 앱 최초 실행 여부
 * - isLoggedIn: 로그인 상태
 * - isGuest: 게스트 모드 여부
 * - authToken: 인증 토큰
 * - userPhone: 사용자 전화번호
 * - userLocation: 사용자 위치 정보
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LocationData } from '../../types';

// Storage keys
const STORAGE_KEYS = {
  HAS_LAUNCHED: '@gonggoo/hasLaunched',
  IS_LOGGED_IN: '@gonggoo/isLoggedIn',
  IS_GUEST: '@gonggoo/isGuest',
  AUTH_TOKEN: '@gonggoo/authToken',
  USER_PHONE: '@gonggoo/userPhone',
  USER_LOCATION: '@gonggoo/userLocation',
} as const;

/**
 * 앱 최초 실행 여부 조회
 */
export async function getHasLaunched(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED);
    return value === 'true';
  } catch (error) {
    console.error('[AuthStorage] Failed to get hasLaunched:', error);
    return false;
  }
}

/**
 * 앱 최초 실행 플래그 설정
 */
export async function setHasLaunched(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, value.toString());
  } catch (error) {
    console.error('[AuthStorage] Failed to set hasLaunched:', error);
  }
}

/**
 * 로그인 상태 조회
 */
export async function getIsLoggedIn(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return value === 'true';
  } catch (error) {
    console.error('[AuthStorage] Failed to get isLoggedIn:', error);
    return false;
  }
}

/**
 * 로그인 상태 설정
 */
export async function setIsLoggedIn(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, value.toString());
  } catch (error) {
    console.error('[AuthStorage] Failed to set isLoggedIn:', error);
  }
}

/**
 * 게스트 모드 상태 조회
 */
export async function getIsGuest(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_GUEST);
    return value === 'true';
  } catch (error) {
    console.error('[AuthStorage] Failed to get isGuest:', error);
    return false;
  }
}

/**
 * 게스트 모드 설정
 */
export async function setIsGuest(value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_GUEST, value.toString());
  } catch (error) {
    console.error('[AuthStorage] Failed to set isGuest:', error);
  }
}

/**
 * 인증 토큰 조회
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('[AuthStorage] Failed to get authToken:', error);
    return null;
  }
}

/**
 * 인증 토큰 설정
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('[AuthStorage] Failed to set authToken:', error);
  }
}

/**
 * 사용자 전화번호 조회
 */
export async function getUserPhone(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
  } catch (error) {
    console.error('[AuthStorage] Failed to get userPhone:', error);
    return null;
  }
}

/**
 * 사용자 전화번호 설정
 */
export async function setUserPhone(phone: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
  } catch (error) {
    console.error('[AuthStorage] Failed to set userPhone:', error);
  }
}

/**
 * 사용자 위치 정보 조회
 */
export async function getUserLocation(): Promise<LocationData | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('[AuthStorage] Failed to get userLocation:', error);
    return null;
  }
}

/**
 * 사용자 위치 정보 설정
 */
export async function setUserLocation(location: LocationData): Promise<void> {
  try {
    const jsonValue = JSON.stringify(location);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_LOCATION, jsonValue);
  } catch (error) {
    console.error('[AuthStorage] Failed to set userLocation:', error);
  }
}

/**
 * 모든 인증 데이터 삭제 (로그아웃)
 * hasLaunched도 함께 삭제하여 온보딩 화면으로 돌아갈 수 있도록 함
 */
export async function clearAuthData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HAS_LAUNCHED,
      STORAGE_KEYS.IS_LOGGED_IN,
      STORAGE_KEYS.IS_GUEST,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_PHONE,
      STORAGE_KEYS.USER_LOCATION,
    ]);
  } catch (error) {
    console.error('[AuthStorage] Failed to clear auth data:', error);
  }
}

/**
 * 모든 앱 데이터 삭제 (초기화)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.HAS_LAUNCHED,
      STORAGE_KEYS.IS_LOGGED_IN,
      STORAGE_KEYS.IS_GUEST,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_PHONE,
      STORAGE_KEYS.USER_LOCATION,
    ]);
  } catch (error) {
    console.error('[AuthStorage] Failed to clear all data:', error);
  }
}
