/**
 * Chat Mock Data
 *
 * 채팅 목록 화면용 Mock 데이터입니다.
 */

import type { ChatRoomItem, ChatFilterType, ChatMessage, SystemChatMessage } from '@/app/shared/types';

/**
 * 메시지 ID 생성을 위한 카운터
 * Date.now()만으로는 같은 밀리초에 여러 메시지가 생성될 때 중복 ID가 발생할 수 있음
 */
let messageIdCounter = 0;

/**
 * 채팅방 Mock 데이터
 * - products.mock.ts의 실제 상품 데이터를 기반으로 구성
 * - 공구원 시점(participant)과 공구장 시점(host) 데이터 모두 포함
 * - currentParticipants 수와 채팅방 수가 일치
 */
const MOCK_CHAT_ROOMS: ChatRoomItem[] = [
  // ===== 공구원 시점 채팅 3개 =====
  // 공구원 시점 1: 삼성 갤럭시 버즈2 프로 (Product ID: 1)
  {
    id: 'participant-chat-1',
    participant: {
      id: 'host-1',
      nickname: '믿음직한공구장',
      profileImageUri: 'https://i.pravatar.cc/150?img=1',
    },
    product: {
      id: '1',
      title: '삼성 갤럭시 버즈2 프로',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
    },
    lastMessage: {
      content: '개인정보 이용내역 안내  ㅇㅇ님 안녕하세요. 어플을 사용하시면서 어쩌구저쩌구',
      timestamp: Date.now() - 1000 * 30, // 30초 전
    },
    unreadCount: 2,
    userRole: 'participant',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1일 전
  },
  // 공구원 시점 2: 코스트코 크리넥스 티슈 (Product ID: 27)
  {
    id: 'participant-chat-2',
    participant: {
      id: 'host-27',
      nickname: '공구프로',
      profileImageUri: 'https://i.pravatar.cc/150?img=27',
    },
    product: {
      id: '27',
      title: '코스트코 크리넥스 티슈 250매 x 8팩',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
    },
    lastMessage: {
      content: '재고 확인해보고 연락드리겠습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1일 전
    },
    unreadCount: 0,
    userRole: 'participant',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2일 전
  },
  // 공구원 시점 3: LG 그램 노트북 (Product ID: 3)
  {
    id: 'participant-chat-3',
    participant: {
      id: 'host-3',
      nickname: '공구달인',
      profileImageUri: 'https://i.pravatar.cc/150?img=3',
    },
    product: {
      id: '3',
      title: 'LG 그램 노트북 15인치',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
    },
    lastMessage: {
      content: '오늘 출발해서 내일 도착 예정이에요!',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2일 전
    },
    unreadCount: 3,
    userRole: 'participant',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3일 전
  },

  // ===== 공구장 시점: Product 2 (에어팟 프로 2세대) - 5명 참여 =====
  {
    id: 'chat-2-0',
    participant: {
      id: 'participant-2-0',
      nickname: '행복한구매자',
      profileImageUri: 'https://i.pravatar.cc/150?img=20',
    },
    product: {
      id: '2',
      title: '에어팟 프로 2세대',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 5,
        progressPercentage: 100,
        status: '모집 마감',
        deadline: '12/24',
      },
    },
    lastMessage: {
      content: '언제 배송되나요?',
      timestamp: Date.now() - 1000 * 60 * 1, // 1분 전
    },
    unreadCount: 2,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2시간 전
  },
  {
    id: 'chat-2-1',
    participant: {
      id: 'participant-2-1',
      nickname: '알뜰살뜰',
      profileImageUri: 'https://i.pravatar.cc/150?img=21',
    },
    product: {
      id: '2',
      title: '에어팟 프로 2세대',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 5,
        progressPercentage: 100,
        status: '모집 마감',
        deadline: '12/24',
      },
    },
    lastMessage: {
      content: '네 감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 2, // 2분 전
    },
    unreadCount: 1,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5시간 전
  },
  {
    id: 'chat-2-2',
    participant: {
      id: 'participant-2-2',
      nickname: '공구러버',
      profileImageUri: undefined,
    },
    product: {
      id: '2',
      title: '에어팟 프로 2세대',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 5,
        progressPercentage: 100,
        status: '모집 마감',
        deadline: '12/24',
      },
    },
    lastMessage: {
      content: '확인했습니다',
      timestamp: Date.now() - 1000 * 60 * 3, // 3분 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 6, // 6시간 전
  },
  {
    id: 'chat-2-3',
    participant: {
      id: 'participant-2-3',
      nickname: '절약왕',
      profileImageUri: 'https://i.pravatar.cc/150?img=23',
    },
    product: {
      id: '2',
      title: '에어팟 프로 2세대',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 5,
        progressPercentage: 100,
        status: '모집 마감',
        deadline: '12/24',
      },
    },
    lastMessage: {
      content: '참여하고 싶어요',
      timestamp: Date.now() - 1000 * 60 * 4, // 4분 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 7, // 7시간 전
  },
  {
    id: 'chat-2-4',
    participant: {
      id: 'participant-2-4',
      nickname: '똑똑이',
      profileImageUri: 'https://i.pravatar.cc/150?img=24',
    },
    product: {
      id: '2',
      title: '에어팟 프로 2세대',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 5,
        progressPercentage: 100,
        status: '모집 마감',
        deadline: '12/24',
      },
    },
    lastMessage: {
      content: '감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 5, // 5분 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 8, // 8시간 전
  },

  // ===== 공구장 시점: Product 21 (유기농 쌀 10kg) - 3명 참여 =====
  {
    id: 'chat-21-0',
    participant: {
      id: 'participant-21-0',
      nickname: '공구매니저',
      profileImageUri: 'https://i.pravatar.cc/150?img=210',
    },
    product: {
      id: '21',
      title: '유기농 쌀 10kg',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 3,
        progressPercentage: 60,
        status: '모집 중',
        deadline: '12/28',
      },
    },
    lastMessage: {
      content: '배송은 언제쯤 받을 수 있나요?',
      timestamp: Date.now() - 1000 * 60 * 10, // 10분 전
    },
    unreadCount: 1,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 12, // 12시간 전
  },
  {
    id: 'chat-21-1',
    participant: {
      id: 'participant-21-1',
      nickname: '실속파',
      profileImageUri: 'https://i.pravatar.cc/150?img=211',
    },
    product: {
      id: '21',
      title: '유기농 쌀 10kg',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 3,
        progressPercentage: 60,
        status: '모집 중',
        deadline: '12/28',
      },
    },
    lastMessage: {
      content: '쌀 품질이 좋나요?',
      timestamp: Date.now() - 1000 * 60 * 30, // 30분 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 15, // 15시간 전
  },
  {
    id: 'chat-21-2',
    participant: {
      id: 'participant-21-2',
      nickname: '합리적소비',
      profileImageUri: undefined,
    },
    product: {
      id: '21',
      title: '유기농 쌀 10kg',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 3,
        progressPercentage: 60,
        status: '모집 중',
        deadline: '12/28',
      },
    },
    lastMessage: {
      content: '참여 완료했습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1시간 전
    },
    unreadCount: 1,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 18, // 18시간 전
  },

  // ===== 공구장 시점: Product 4 (로지텍 무선 마우스) - 3명 참여 =====
  {
    id: 'chat-4-0',
    participant: {
      id: 'participant-4-0',
      nickname: '공구참여자',
      profileImageUri: 'https://i.pravatar.cc/150?img=40',
    },
    product: {
      id: '4',
      title: '로지텍 무선 마우스 MX Master 3',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 3,
        progressPercentage: 60,
        status: '모집 중',
        deadline: '12/26',
      },
    },
    lastMessage: {
      content: '마우스 색상은 어떻게 되나요?',
      timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3시간 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1일 전
  },
  {
    id: 'chat-4-1',
    participant: {
      id: 'participant-4-1',
      nickname: '현명한선택',
      profileImageUri: 'https://i.pravatar.cc/150?img=41',
    },
    product: {
      id: '4',
      title: '로지텍 무선 마우스 MX Master 3',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 3,
        progressPercentage: 60,
        status: '모집 중',
        deadline: '12/26',
      },
    },
    lastMessage: {
      content: '잘 받았습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5시간 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2일 전
  },
  {
    id: 'chat-4-2',
    participant: {
      id: 'participant-4-2',
      nickname: '행복한구매자',
      profileImageUri: 'https://i.pravatar.cc/150?img=42',
    },
    product: {
      id: '4',
      title: '로지텍 무선 마우스 MX Master 3',
      thumbnailUri: 'https://gonggoo-product.netlify.app/product-47.png',
      groupBuyProgress: {
        totalSlots: 5,
        currentParticipants: 3,
        progressPercentage: 60,
        status: '모집 중',
        deadline: '12/26',
      },
    },
    lastMessage: {
      content: '좋은 제품 감사합니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8시간 전
    },
    unreadCount: 0,
    userRole: 'host',
    transactionStatus: 'requested',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3일 전
  },
];

/**
 * 필터 타입에 따라 채팅방 목록 조회
 * @param filter 채팅 필터 타입 (all, host, participant, unread)
 * @returns 필터링된 채팅방 목록 (최신순)
 */
export function getMockChatRooms(filter?: ChatFilterType): ChatRoomItem[] {
  let filteredRooms = [...MOCK_CHAT_ROOMS];

  // 필터 적용
  if (filter && filter !== 'all') {
    switch (filter) {
      case 'host': {
        // 공구장 시점: 상품별로 그룹화
        const hostRooms = filteredRooms.filter((room) => room.userRole === 'host');
        const groupedByProduct = new Map<string, ChatRoomItem[]>();

        // productId별로 그룹화
        hostRooms.forEach((room) => {
          const productId = room.product.id;
          if (!groupedByProduct.has(productId)) {
            groupedByProduct.set(productId, []);
          }
          groupedByProduct.get(productId)!.push(room);
        });

        // 각 상품별로 대표 채팅 아이템 생성
        filteredRooms = Array.from(groupedByProduct.values()).map((rooms) => {
          // 가장 최신 메시지를 가진 채팅을 기준으로
          const sortedRooms = rooms.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
          const latestRoom = sortedRooms[0];

          // 그룹 내 모든 안 읽은 메시지 합산
          const totalUnread = rooms.reduce((sum, room) => sum + room.unreadCount, 0);

          return {
            ...latestRoom,
            unreadCount: totalUnread,
            // id는 productId로 변경 (라우팅용)
            id: latestRoom.product.id,
          };
        });
        break;
      }
      case 'participant':
        filteredRooms = filteredRooms.filter((room) => room.userRole === 'participant');
        break;
      case 'unread': {
        // 안 읽은 메시지가 있는 채팅만 필터링
        const participantRooms = filteredRooms.filter(
          (room) => room.userRole === 'participant' && room.unreadCount > 0
        );
        const hostRooms = filteredRooms.filter((room) => room.userRole === 'host');

        // 공구장 채팅 그룹화
        const groupedByProduct = new Map<string, ChatRoomItem[]>();
        hostRooms.forEach((room) => {
          const productId = room.product.id;
          if (!groupedByProduct.has(productId)) {
            groupedByProduct.set(productId, []);
          }
          groupedByProduct.get(productId)!.push(room);
        });

        const groupedHostRooms = Array.from(groupedByProduct.values())
          .map((rooms) => {
            const sortedRooms = rooms.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
            const latestRoom = sortedRooms[0];
            const totalUnread = rooms.reduce((sum, room) => sum + room.unreadCount, 0);

            return {
              ...latestRoom,
              unreadCount: totalUnread,
              id: latestRoom.product.id,
            };
          })
          .filter((room) => room.unreadCount > 0); // 안 읽은 메시지가 있는 것만

        filteredRooms = [...participantRooms, ...groupedHostRooms];
        break;
      }
    }
  }

  // 'all' 필터일 때도 공구장 채팅은 상품별로 그룹화
  if (!filter || filter === 'all') {
    const participantRooms = filteredRooms.filter((room) => room.userRole === 'participant');
    const hostRooms = filteredRooms.filter((room) => room.userRole === 'host');

    // 공구장 채팅 그룹화
    const groupedByProduct = new Map<string, ChatRoomItem[]>();
    hostRooms.forEach((room) => {
      const productId = room.product.id;
      if (!groupedByProduct.has(productId)) {
        groupedByProduct.set(productId, []);
      }
      groupedByProduct.get(productId)!.push(room);
    });

    const groupedHostRooms = Array.from(groupedByProduct.values()).map((rooms) => {
      const sortedRooms = rooms.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
      const latestRoom = sortedRooms[0];
      const totalUnread = rooms.reduce((sum, room) => sum + room.unreadCount, 0);

      return {
        ...latestRoom,
        unreadCount: totalUnread,
        id: latestRoom.product.id,
      };
    });

    filteredRooms = [...participantRooms, ...groupedHostRooms];
  }

  // 각 채팅방의 lastMessage를 실제 메시지에서 동적으로 업데이트
  const roomsWithUpdatedMessages = filteredRooms.map((room) => ({
    ...room,
    lastMessage: getLastMessageFromMessages(room.id),
  }));

  // 마지막 메시지 시간 기준 최신순 정렬
  return roomsWithUpdatedMessages.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
}

/**
 * 전체 안 읽은 메시지 개수 조회
 * @returns 모든 채팅방의 안 읽은 메시지 총합
 */
export function getTotalUnreadCount(): number {
  return MOCK_CHAT_ROOMS.reduce((total, room) => total + room.unreadCount, 0);
}

/**
 * 공구장 시점: 특정 공구 상품의 공구원들과의 채팅 목록 조회
 * @param productId 공구 상품 ID
 * @returns 해당 공구의 공구원들과의 채팅 목록 (최신순)
 */
export function getMockGroupBuyerChats(productId: string): ChatRoomItem[] {
  const filteredRooms = MOCK_CHAT_ROOMS.filter(
    (room) => room.userRole === 'host' && room.product.id === productId
  );

  // 각 채팅방의 lastMessage를 실제 메시지에서 동적으로 업데이트
  const roomsWithUpdatedMessages = filteredRooms.map((room) => ({
    ...room,
    lastMessage: getLastMessageFromMessages(room.id),
  }));

  // 마지막 메시지 시간 기준 최신순 정렬
  return roomsWithUpdatedMessages.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
}

/**
 * 특정 채팅방의 메시지를 읽음 처리
 * @param chatId 채팅방 ID
 */
export function markChatAsRead(chatId: string): void {
  const room = MOCK_CHAT_ROOMS.find((r) => r.id === chatId);
  if (room) {
    room.unreadCount = 0;
  }
}

/**
 * ID로 원본 채팅방 조회 (그룹화 없이)
 * @param chatId 채팅방 ID
 * @returns 채팅방 정보 또는 null
 */
export function getChatRoomById(chatId: string): ChatRoomItem | null {
  const room = MOCK_CHAT_ROOMS.find((r) => r.id === chatId);
  return room || null;
}

/**
 * 채팅 메시지 Mock 데이터
 * chatRoomId별로 메시지들을 저장
 * - products.mock.ts의 실제 상품과 연동
 */
const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  // Room participant-chat-1: 공구원 시점 - 삼성 갤럭시 버즈2 프로
  'participant-chat-1': [
    {
      type: 'text',
      id: 'msg-1-1',
      chatRoomId: 'participant-chat-1',
      sender: 'other',
      content: '안녕하세요! 갤럭시 버즈2 프로 공구 참여하고 싶어요',
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-1-2',
      chatRoomId: 'participant-chat-1',
      sender: 'me',
      content: '네 환영합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 2, // 2시간 전 + 2분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-1-3',
      chatRoomId: 'participant-chat-1',
      sender: 'other',
      content: '색상은 어떻게 되나요?',
      timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-1-4',
      chatRoomId: 'participant-chat-1',
      sender: 'me',
      content: '확인했습니다',
      timestamp: Date.now() - 1000 * 60 * 50, // 50분 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-1-5',
      chatRoomId: 'participant-chat-1',
      sender: 'other',
      content: '개인정보 이용내역 안내',
      timestamp: Date.now() - 1000 * 60 * 1, // 1분 전
      read: false,
    },
    {
      type: 'text',
      id: 'msg-1-6',
      chatRoomId: 'participant-chat-1',
      sender: 'other',
      content: 'ㅇㅇ님 안녕하세요. 어플을 사용하시면서 어쩌구저쩌구',
      timestamp: Date.now() - 1000 * 30, // 30초 전
      read: false,
    },
  ],

  // Room participant-chat-2: 공구원 시점 - 코스트코 크리넥스 티슈
  'participant-chat-2': [
    {
      type: 'text',
      id: 'msg-2-1',
      chatRoomId: 'participant-chat-2',
      sender: 'other',
      content: '티슈 아직 재고 있나요?',
      timestamp: Date.now() - 1000 * 60 * 60 * 48, // 48시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-2-2',
      chatRoomId: 'participant-chat-2',
      sender: 'me',
      content: '네 있습니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 47, // 47시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-2-3',
      chatRoomId: 'participant-chat-2',
      sender: 'other',
      content: '재고 확인해보고 연락드리겠습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 24시간 전
      read: true,
    },
  ],

  // Room participant-chat-3: 공구원 시점 - LG 그램 노트북
  'participant-chat-3': [
    {
      type: 'text',
      id: 'msg-3-1',
      chatRoomId: 'participant-chat-3',
      sender: 'other',
      content: '노트북 공구 참여했습니다~',
      timestamp: Date.now() - 1000 * 60 * 60 * 72, // 72시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-3-2',
      chatRoomId: 'participant-chat-3',
      sender: 'me',
      content: '감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 72 + 1000 * 60, // +1분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-3-3',
      chatRoomId: 'participant-chat-3',
      sender: 'other',
      content: '오늘 출발해서 내일 도착 예정이에요!',
      timestamp: Date.now() - 1000 * 60 * 60 * 48, // 48시간 전
      read: false,
    },
  ],

  // Room chat-2-0: 공구장 시점 - 에어팟 프로 (participant-2-0)
  'chat-2-0': [
    {
      type: 'text',
      id: 'msg-4-1',
      chatRoomId: 'chat-2-0',
      sender: 'other',
      content: '에어팟 프로 공구 참여하고 싶어요',
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-4-2',
      chatRoomId: 'chat-2-0',
      sender: 'me',
      content: '네 환영합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60, // +1분
      read: true,
    },
    {
      type: 'system',
      id: 'system-msg-4-1',
      chatRoomId: 'chat-2-0',
      sender: 'system',
      systemMessageType: 'transaction_complete_request',
      timestamp: Date.now() - 1000 * 60 * 5, // 5분 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-4-3',
      chatRoomId: 'chat-2-0',
      sender: 'other',
      content: '언제 배송되나요?',
      timestamp: Date.now() - 1000 * 60 * 1, // 1분 전
      read: false,
    },
  ],

  // Room chat-2-1: 공구장 시점 - 에어팟 프로 (participant-2-1)
  'chat-2-1': [
    {
      type: 'text',
      id: 'msg-5-1',
      chatRoomId: 'chat-2-1',
      sender: 'other',
      content: '참여 완료했습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-5-2',
      chatRoomId: 'chat-2-1',
      sender: 'me',
      content: '감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-5-3',
      chatRoomId: 'chat-2-1',
      sender: 'other',
      content: '네 감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 2, // 2분 전
      read: false,
    },
  ],

  // Room chat-2-2: 공구장 시점 - 에어팟 프로 (participant-2-2)
  'chat-2-2': [
    {
      type: 'text',
      id: 'msg-6-1',
      chatRoomId: 'chat-2-2',
      sender: 'other',
      content: '배송 주소 확인 부탁드려요',
      timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-6-2',
      chatRoomId: 'chat-2-2',
      sender: 'me',
      content: '네 확인했습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 6 + 1000 * 60 * 30, // +30분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-6-3',
      chatRoomId: 'chat-2-2',
      sender: 'other',
      content: '확인했습니다',
      timestamp: Date.now() - 1000 * 60 * 3, // 3분 전
      read: true,
    },
  ],

  // Room chat-2-3: 공구장 시점 - 에어팟 프로 (participant-2-3)
  'chat-2-3': [
    {
      type: 'text',
      id: 'msg-7-1',
      chatRoomId: 'chat-2-3',
      sender: 'other',
      content: '참여하고 싶어요',
      timestamp: Date.now() - 1000 * 60 * 60 * 7, // 7시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-7-2',
      chatRoomId: 'chat-2-3',
      sender: 'me',
      content: '환영합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 7 + 1000 * 60, // +1분
      read: true,
    },
  ],

  // Room chat-2-4: 공구장 시점 - 에어팟 프로 (participant-2-4)
  'chat-2-4': [
    {
      type: 'text',
      id: 'msg-8-1',
      chatRoomId: 'chat-2-4',
      sender: 'other',
      content: '제품 상태 좋나요?',
      timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-8-2',
      chatRoomId: 'chat-2-4',
      sender: 'me',
      content: '네 정품 새제품입니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 8 + 1000 * 60 * 10, // +10분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-8-3',
      chatRoomId: 'chat-2-4',
      sender: 'other',
      content: '감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 5, // 5분 전
      read: true,
    },
  ],

  // Room chat-21-0: 공구장 시점 - 유기농 쌀 (participant-21-0)
  'chat-21-0': [
    {
      type: 'text',
      id: 'msg-9-1',
      chatRoomId: 'chat-21-0',
      sender: 'other',
      content: '유기농 쌀 공구 참여합니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-9-2',
      chatRoomId: 'chat-21-0',
      sender: 'me',
      content: '감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 12 + 1000 * 60, // +1분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-9-3',
      chatRoomId: 'chat-21-0',
      sender: 'other',
      content: '배송은 언제쯤 받을 수 있나요?',
      timestamp: Date.now() - 1000 * 60 * 10, // 10분 전
      read: false,
    },
  ],

  // Room chat-21-1: 공구장 시점 - 유기농 쌀 (participant-21-1)
  'chat-21-1': [
    {
      type: 'text',
      id: 'msg-10-1',
      chatRoomId: 'chat-21-1',
      sender: 'other',
      content: '쌀 품질이 좋나요?',
      timestamp: Date.now() - 1000 * 60 * 30, // 30분 전
      read: true,
    },
  ],

  // Room chat-21-2: 공구장 시점 - 유기농 쌀 (participant-21-2)
  'chat-21-2': [
    {
      type: 'text',
      id: 'msg-11-1',
      chatRoomId: 'chat-21-2',
      sender: 'other',
      content: '참여 완료했습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1시간 전
      read: false,
    },
  ],

  // Room chat-4-0: 공구장 시점 - 로지텍 마우스 (participant-4-0)
  'chat-4-0': [
    {
      type: 'text',
      id: 'msg-12-1',
      chatRoomId: 'chat-4-0',
      sender: 'other',
      content: '마우스 색상은 어떻게 되나요?',
      timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3시간 전
      read: true,
    },
  ],

  // Room chat-4-1: 공구장 시점 - 로지텍 마우스 (participant-4-1)
  'chat-4-1': [
    {
      type: 'text',
      id: 'msg-13-1',
      chatRoomId: 'chat-4-1',
      sender: 'other',
      content: '제품 잘 받았습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 24시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-13-2',
      chatRoomId: 'chat-4-1',
      sender: 'me',
      content: '감사합니다!',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60, // +1분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-13-3',
      chatRoomId: 'chat-4-1',
      sender: 'other',
      content: '잘 받았습니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5시간 전
      read: true,
    },
  ],

  // Room chat-4-2: 공구장 시점 - 로지텍 마우스 (participant-4-2)
  'chat-4-2': [
    {
      type: 'text',
      id: 'msg-14-1',
      chatRoomId: 'chat-4-2',
      sender: 'other',
      content: '마우스 사용감이 좋네요',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 72시간 전
      read: true,
    },
    {
      type: 'text',
      id: 'msg-14-2',
      chatRoomId: 'chat-4-2',
      sender: 'me',
      content: '좋게 봐주셔서 감사합니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 30, // +30분
      read: true,
    },
    {
      type: 'text',
      id: 'msg-14-3',
      chatRoomId: 'chat-4-2',
      sender: 'other',
      content: '좋은 제품 감사합니다',
      timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8시간 전
      read: true,
    },
  ],
};

/**
 * 특정 채팅방의 실제 마지막 메시지 조회
 * @param chatRoomId 채팅방 ID
 * @returns 마지막 메시지 정보 또는 기본값
 */
function getLastMessageFromMessages(chatRoomId: string): {
  content: string;
  timestamp: number;
} {
  const messages = MOCK_MESSAGES[chatRoomId];

  if (!messages || messages.length === 0) {
    return {
      content: '메시지가 없습니다',
      timestamp: Date.now(),
    };
  }

  // 메시지를 timestamp 기준 내림차순 정렬하여 최신 메시지 가져오기
  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
  const lastMsg = sortedMessages[0];

  // 시스템 메시지인 경우 특별 처리
  if (lastMsg.type === 'system') {
    return {
      content: '거래 완료 요청이 전송되었습니다',
      timestamp: lastMsg.timestamp,
    };
  }

  return {
    content: lastMsg.content,
    timestamp: lastMsg.timestamp,
  };
}

/**
 * 특정 채팅방의 메시지 조회
 * @param chatRoomId 채팅방 ID
 * @returns 해당 채팅방의 메시지 목록 (오래된 순)
 */
export function getMockChatMessages(chatRoomId: string): ChatMessage[] {
  const messages = MOCK_MESSAGES[chatRoomId] || [];
  // timestamp 기준 오름차순 정렬 (오래된 메시지가 먼저)
  return messages.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * 메시지 전송 (Mock)
 * @param chatRoomId 채팅방 ID
 * @param content 메시지 내용
 * @returns 생성된 메시지
 */
export function sendMockChatMessage(chatRoomId: string, content: string): ChatMessage {
  // 카운터를 증가시켜 유니크한 ID 생성
  messageIdCounter++;
  const timestamp = Date.now();

  const newMessage: ChatMessage = {
    type: 'text',
    id: `msg-${timestamp}-${messageIdCounter}`,
    chatRoomId,
    sender: 'me',
    content,
    timestamp,
    read: true,
  };

  // Mock 데이터에 추가
  if (!MOCK_MESSAGES[chatRoomId]) {
    MOCK_MESSAGES[chatRoomId] = [];
  }

  // 중복 메시지 추가 방지: 같은 ID가 이미 있으면 추가하지 않음
  const existingMessage = MOCK_MESSAGES[chatRoomId].find((m) => m.id === newMessage.id);
  if (existingMessage) {
    console.warn('Duplicate message ID in MOCK_MESSAGES, returning existing:', newMessage.id);
    return existingMessage;
  }

  MOCK_MESSAGES[chatRoomId].push(newMessage);

  // 채팅방의 마지막 메시지도 업데이트
  const room = MOCK_CHAT_ROOMS.find((r) => r.id === chatRoomId);
  if (room) {
    room.lastMessage = {
      content,
      timestamp: newMessage.timestamp,
    };
  }

  return newMessage;
}

/**
 * 시스템 메시지 전송 (Mock)
 * @param chatRoomId 채팅방 ID
 * @param systemMessageType 시스템 메시지 타입
 * @returns 생성된 시스템 메시지
 */
export function sendMockSystemMessage(
  chatRoomId: string,
  systemMessageType: SystemChatMessage['systemMessageType']
): SystemChatMessage {
  // 카운터를 증가시켜 유니크한 ID 생성
  messageIdCounter++;
  const timestamp = Date.now();

  const newMessage: SystemChatMessage = {
    type: 'system',
    id: `system-msg-${timestamp}-${messageIdCounter}`,
    chatRoomId,
    sender: 'system',
    systemMessageType,
    timestamp,
    read: true,
  };

  // Mock 데이터에 추가
  if (!MOCK_MESSAGES[chatRoomId]) {
    MOCK_MESSAGES[chatRoomId] = [];
  }

  // 중복 메시지 추가 방지
  const existingMessage = MOCK_MESSAGES[chatRoomId].find((m) => m.id === newMessage.id);
  if (existingMessage) {
    console.warn('Duplicate system message ID in MOCK_MESSAGES, returning existing:', newMessage.id);
    return existingMessage as SystemChatMessage;
  }

  MOCK_MESSAGES[chatRoomId].push(newMessage);

  // 채팅방의 마지막 메시지도 업데이트 (시스템 메시지는 텍스트로 표시)
  const room = MOCK_CHAT_ROOMS.find((r) => r.id === chatRoomId);
  if (room) {
    room.lastMessage = {
      content: '거래 완료 요청이 전송되었습니다',
      timestamp: newMessage.timestamp,
    };
  }

  return newMessage;
}
