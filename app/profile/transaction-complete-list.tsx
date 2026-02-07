/**
 * 거래 완료 화면
 * Route: /profile/transaction-complete-list
 */

import { ProfileProductListScreen } from '@/app/features/profile-product-list';
import { TRANSACTION_COMPLETE_CONFIG } from '@/app/features/profile-product-list/configs/screenConfigs';

export default function TransactionCompleteListScreen() {
  return <ProfileProductListScreen config={TRANSACTION_COMPLETE_CONFIG} />;
}
