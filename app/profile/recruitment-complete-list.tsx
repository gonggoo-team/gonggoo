/**
 * 모집 완료 화면
 * Route: /profile/recruitment-complete-list
 */

import { ProfileProductListScreen } from '@/app/features/profile-product-list';
import { RECRUITMENT_COMPLETE_CONFIG } from '@/app/features/profile-product-list/configs/screenConfigs';

export default function RecruitmentCompleteListScreen() {
  return <ProfileProductListScreen config={RECRUITMENT_COMPLETE_CONFIG} />;
}
