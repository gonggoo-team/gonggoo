/**
 * 참여 완료 화면
 * Route: /profile/joined-list
 */

import { ProfileProductListScreen } from '@/app/features/profile-product-list';
import { JOINED_CONFIG } from '@/app/features/profile-product-list/configs/screenConfigs';

export default function JoinedListScreen() {
  return <ProfileProductListScreen config={JOINED_CONFIG} />;
}
