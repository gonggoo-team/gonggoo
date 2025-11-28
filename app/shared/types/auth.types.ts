/**
 * Auth Type Definitions
 * Authentication and user-related type definitions
 */

/**
 * Authentication state
 */
export interface AuthState {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the user is in guest mode */
  isGuest: boolean;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Current authenticated user */
  user: AuthUser | null;
  /** Authentication token */
  token: string | null;
}

/**
 * Authenticated user information
 */
export interface AuthUser {
  /** Unique user identifier */
  id: string;
  /** User's phone number */
  phone: string;
  /** User's nickname (optional) */
  nickname?: string;
  /** Profile image URI (optional) */
  profileImageUri?: string;
  /** User's location data */
  location?: LocationData;
}

/**
 * Location data
 */
export interface LocationData {
  /** Location address */
  address: string;
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Whether location is verified */
  verified: boolean;
  /** Whether location was detected via GPS (optional) */
  gpsVerified?: boolean;
  /** Timestamp when location was detected (ISO format, optional) */
  detectedAt?: string;
  /** GPS accuracy in meters (optional) */
  accuracy?: number;
}

/**
 * Login step (phone or code verification)
 */
export type LoginStep = 'phone' | 'code';

/**
 * Signup step (phone, code, or location)
 */
export type SignupStep = 'phone' | 'code' | 'location';

/**
 * Phone authentication result
 */
export interface PhoneAuthResult {
  /** Whether authentication succeeded */
  success: boolean;
  /** Authentication token (on success) */
  token?: string;
  /** User data (on success) */
  user?: AuthUser;
  /** Error message (on failure) */
  error?: string;
}

/**
 * Verification code send result
 */
export interface SendCodeResult {
  /** Whether code was sent successfully */
  success: boolean;
  /** Error message (on failure) */
  error?: string;
}

/**
 * Code verification result
 */
export interface VerifyCodeResult {
  /** Whether verification succeeded */
  success: boolean;
  /** Error message (on failure) */
  error?: string;
}
