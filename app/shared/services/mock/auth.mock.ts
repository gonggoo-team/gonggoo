/**
 * Mock Auth Data
 * Mock data for authentication testing
 */

import type { AuthUser, LocationData } from '../../types';
import { generateRandomNickname } from '../../utils/nicknameUtils';

/**
 * Mock verification code (always returns "123456")
 */
export const getMockVerificationCode = (phone: string): string => '123456';

/**
 * Generate mock JWT token
 */
export const generateMockAuthToken = (phone: string): string => {
  const timestamp = Date.now();
  return `mock_token_${phone.replace(/-/g, '')}_${timestamp}`;
};

/**
 * Mock registered phone numbers (for testing existing users)
 */
const MOCK_REGISTERED_PHONES = [
  '010-1234-5678',
  '010-9999-8888',
  '010-5555-6666',
];

/**
 * Check if phone number is already registered (mock)
 */
export const isPhoneRegistered = (phone: string): boolean => {
  return MOCK_REGISTERED_PHONES.includes(phone);
};

/**
 * Mock user database
 */
const MOCK_USERS: Record<string, AuthUser> = {
  '010-1234-5678': {
    id: 'user_01012345678',
    phone: '010-1234-5678',
    nickname: '테스트유저',
    profileImageUri: undefined,
    location: {
      address: '서울시 강남구 역삼동',
      latitude: 37.5012767241426,
      longitude: 127.03958123605,
      verified: true,
    },
  },
  '010-9999-8888': {
    id: 'user_01099998888',
    phone: '010-9999-8888',
    nickname: '공구왕',
    profileImageUri: undefined,
    location: {
      address: '서울시 서초구 서초동',
      latitude: 37.4838,
      longitude: 127.0323,
      verified: true,
    },
  },
};

/**
 * Get mock user by phone number
 * If user doesn't exist, creates a new mock user
 */
export const getMockUserByPhone = (phone: string): AuthUser => {
  // Return existing user if found
  if (MOCK_USERS[phone]) {
    return MOCK_USERS[phone];
  }

  // Create new user for signup with random Korean nickname
  const userId = `user_${phone.replace(/-/g, '')}`;
  return {
    id: userId,
    phone,
    nickname: generateRandomNickname(),
    profileImageUri: undefined,
    location: undefined,
  };
};

/**
 * Mock location data
 */
export const MOCK_LOCATIONS: LocationData[] = [
  {
    address: '서울시 강남구 역삼동',
    latitude: 37.5012767241426,
    longitude: 127.03958123605,
    verified: false,
  },
  {
    address: '서울시 서초구 서초동',
    latitude: 37.4838,
    longitude: 127.0323,
    verified: false,
  },
  {
    address: '서울시 송파구 잠실동',
    latitude: 37.5133,
    longitude: 127.1028,
    verified: false,
  },
  {
    address: '서울시 마포구 상암동',
    latitude: 37.5791,
    longitude: 126.8895,
    verified: false,
  },
];

/**
 * Update mock user data (for testing)
 */
export const updateMockUser = (phone: string, updates: Partial<AuthUser>): void => {
  if (MOCK_USERS[phone]) {
    MOCK_USERS[phone] = { ...MOCK_USERS[phone], ...updates };
  } else {
    const newUser = getMockUserByPhone(phone);
    MOCK_USERS[phone] = { ...newUser, ...updates };
  }
};
