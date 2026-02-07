/**
 * HostProfile Types
 */

import type { HostInfo, Participant } from '@/app/shared/types/product.types';

export interface HostProfileProps {
  /** 공구장 정보 */
  host: HostInfo;
  /** 참여자 목록 (최대 4명) */
  participants?: Participant[];
}
