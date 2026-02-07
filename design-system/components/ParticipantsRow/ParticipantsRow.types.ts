/**
 * ParticipantsRow Types
 */

export interface Participant {
  /** 참여자 ID */
  id: string;

  /** 프로필 이미지 URI */
  profileImageUri?: string;
}

export interface Host {
  /** 공구장 ID */
  id: string;

  /** 프로필 이미지 URI */
  profileImageUri?: string;
}

export interface ParticipantsRowProps {
  /** 공구장 정보 */
  host: Host;

  /** 참여자 목록 */
  participants?: Participant[];
}
