/**
 * Chat Types
 * 채팅 관련 타입 정의
 */

/**
 * 채팅 참여자 정보
 */
export interface ChatParticipant {
  id: string;
  nickname: string;
  profileImageUri?: string;
}

/**
 * 공구 진행 상태 정보 (공구장 채팅 목록에서 사용)
 */
export interface GroupBuyProgress {
  /** 총 슬롯 수 */
  totalSlots: number;
  /** 현재 참여자 수 */
  currentParticipants: number;
  /** 달성률 (0-100) */
  progressPercentage: number;
  /** 모집 상태 */
  status: '모집 중' | '모집 마감';
  /** 마감일 */
  deadline: string;
}

/**
 * 채팅 연결된 상품 정보
 */
export interface ChatProduct {
  id: string;
  title: string;
  thumbnailUri: string;
  /** 연결된 공구 진행 정보 (공구장일 경우 필수) */
  groupBuyProgress?: GroupBuyProgress;
}

/**
 * 채팅 필터 타입
 * - all: 전체
 * - host: 공구장 (내가 호스트인 채팅)
 * - participant: 공구원 (내가 참여자인 채팅)
 * - unread: 안 읽은 메시지가 있는 채팅
 */
export type ChatFilterType = 'all' | 'host' | 'participant' | 'unread';

/**
 * 채팅방에서의 사용자 역할
 */
export type ChatUserRole = 'host' | 'participant';

/**
 * 거래 완료 상태
 */
export type TransactionStatus = 'pending' | 'requested' | 'completed';

/**
 * 채팅방 목록 아이템
 */
export interface ChatRoomItem {
  /** 채팅방 ID */
  id: string;
  /** 대화 상대 정보 */
  participant: ChatParticipant;
  /** 연결된 상품 정보 */
  product: ChatProduct;
  /** 마지막 메시지 정보 */
  lastMessage: {
    content: string;
    timestamp: number;
  };
  /** 안 읽은 메시지 개수 */
  unreadCount: number;
  /** 현재 사용자의 역할 */
  userRole: ChatUserRole;
  /** 채팅방 생성 시간 */
  createdAt: number;
  /** 거래 완료 상태 (공구장일 경우) */
  transactionStatus?: TransactionStatus;
}

/**
 * 메시지 발신자 타입
 * - me: 내가 보낸 메시지
 * - other: 상대방이 보낸 메시지
 * - system: 시스템 메시지
 */
export type MessageSender = 'me' | 'other' | 'system';

/**
 * 메시지 그룹 내 위치
 * - single: 단독 메시지 (그룹 내 1개)
 * - first: 그룹의 첫 메시지
 * - middle: 그룹의 중간 메시지
 * - last: 그룹의 마지막 메시지
 */
export type BorderRadiusPosition = 'single' | 'first' | 'middle' | 'last';

/**
 * 시스템 메시지 타입
 * - transaction_complete_request: 거래 완료 요청 메시지
 */
export type SystemMessageType = 'transaction_complete_request';

/**
 * 기본 채팅 메시지 (일반 텍스트 메시지)
 */
export interface TextChatMessage {
  /** 메시지 타입 */
  type: 'text';
  /** 메시지 ID */
  id: string;
  /** 채팅방 ID */
  chatRoomId: string;
  /** 발신자 */
  sender: MessageSender;
  /** 메시지 내용 */
  content: string;
  /** 전송 시간 (timestamp) */
  timestamp: number;
  /** 읽음 여부 */
  read: boolean;
}

/**
 * 시스템 메시지 (거래 완료 요청 등)
 */
export interface SystemChatMessage {
  /** 메시지 타입 */
  type: 'system';
  /** 메시지 ID */
  id: string;
  /** 채팅방 ID */
  chatRoomId: string;
  /** 발신자 (항상 'system') */
  sender: 'system';
  /** 시스템 메시지 타입 */
  systemMessageType: SystemMessageType;
  /** 전송 시간 (timestamp) */
  timestamp: number;
  /** 읽음 여부 */
  read: boolean;
}

/**
 * 채팅 메시지 (텍스트 또는 시스템 메시지)
 */
export type ChatMessage = TextChatMessage | SystemChatMessage;

/**
 * 메시지 그룹 (5분 이내 같은 발신자)
 */
export interface MessageGroup {
  /** 그룹 ID */
  id: string;
  /** 발신자 */
  sender: MessageSender;
  /** 그룹 내 메시지들 (위치 정보 포함) */
  messages: Array<{
    message: ChatMessage;
    position: BorderRadiusPosition;
  }>;
  /** 그룹의 마지막 메시지 시간 */
  timestamp: number;
}

/**
 * 날짜별 메시지 섹션
 */
export interface MessageSection {
  /** 날짜 ("2025. 9. 8." 형식) */
  date: string;
  /** 해당 날짜의 메시지 그룹들 */
  groups: MessageGroup[];
}
