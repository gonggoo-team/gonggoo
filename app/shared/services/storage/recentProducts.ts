/**
 * Recent Products Storage Service
 *
 * AsyncStorage를 사용하여 최근 본 상품 ID 목록을 관리합니다.
 *
 * 특징:
 * - 최대 50개의 상품 ID 저장
 * - 최신순으로 정렬 (가장 최근에 본 상품이 맨 앞)
 * - 중복 제거 (같은 상품을 다시 보면 맨 앞으로 이동)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@gonggoo/recent_products';
const MAX_RECENT_PRODUCTS = 50;

/**
 * 최근 본 상품 ID 목록 조회
 */
export async function getRecentProductIds(): Promise<string[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('[RecentProducts] Failed to load recent products:', error);
    return [];
  }
}

/**
 * 최근 본 상품 ID 추가
 * - 이미 존재하는 상품이면 맨 앞으로 이동
 * - 새로운 상품이면 맨 앞에 추가
 * - 최대 50개 유지
 */
export async function addRecentProductId(productId: string): Promise<void> {
  try {
    const currentIds = await getRecentProductIds();

    // 기존 ID 제거 (중복 방지)
    const filteredIds = currentIds.filter((id) => id !== productId);

    // 맨 앞에 새 ID 추가
    const newIds = [productId, ...filteredIds].slice(0, MAX_RECENT_PRODUCTS);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
  } catch (error) {
    console.error('[RecentProducts] Failed to add recent product:', error);
  }
}

/**
 * 최근 본 상품 ID 삭제
 */
export async function removeRecentProductId(productId: string): Promise<void> {
  try {
    const currentIds = await getRecentProductIds();
    const newIds = currentIds.filter((id) => id !== productId);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
  } catch (error) {
    console.error('[RecentProducts] Failed to remove recent product:', error);
  }
}

/**
 * 최근 본 상품 전체 삭제
 */
export async function clearRecentProducts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[RecentProducts] Failed to clear recent products:', error);
  }
}

/**
 * 최근 본 상품 개수 조회
 */
export async function getRecentProductsCount(): Promise<number> {
  try {
    const ids = await getRecentProductIds();
    return ids.length;
  } catch (error) {
    console.error('[RecentProducts] Failed to get count:', error);
    return 0;
  }
}
