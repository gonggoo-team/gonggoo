/**
 * 찜 목록 화면
 * Route: /profile/wishlist
 */

import { ProfileProductListScreen } from '@/app/features/profile-product-list';
import { WISHLIST_CONFIG } from '@/app/features/profile-product-list/configs/screenConfigs';

export default function WishlistScreen() {
  return <ProfileProductListScreen config={WISHLIST_CONFIG} />;
}
