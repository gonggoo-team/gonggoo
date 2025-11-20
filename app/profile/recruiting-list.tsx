/**
 * 모집 중 화면
 * Route: /profile/recruiting-list
 */

import { ProfileProductListScreen } from '@/app/features/profile-product-list';
import { RECRUITING_CONFIG } from '@/app/features/profile-product-list/configs/screenConfigs';

export default function RecruitingListScreen() {
  return <ProfileProductListScreen config={RECRUITING_CONFIG} />;
}
