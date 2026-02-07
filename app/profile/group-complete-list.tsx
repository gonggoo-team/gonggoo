/**
 * 공구 완료 화면
 * Route: /profile/group-complete-list
 */

import { ProfileProductListScreen } from '@/app/features/profile-product-list';
import { GROUP_COMPLETE_CONFIG } from '@/app/features/profile-product-list/configs/screenConfigs';

export default function GroupCompleteListScreen() {
  return <ProfileProductListScreen config={GROUP_COMPLETE_CONFIG} />;
}
