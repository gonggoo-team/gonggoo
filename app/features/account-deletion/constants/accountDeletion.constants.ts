/**
 * Account Deletion Screen Constants
 *
 * 회원 탈퇴 화면에서 사용되는 모든 텍스트 콘텐츠를 관리합니다.
 * 텍스트는 언제든지 변경될 수 있으므로 동적으로 관리합니다.
 */

/**
 * 회원 탈퇴 화면 텍스트 콘텐츠
 */
export const ACCOUNT_DELETION_TEXT = {
  /** GNB 타이틀 */
  title: '회원탈퇴',

  /** 메인 타이틀 (사용자 이름 포함) */
  mainTitle: (nickname: string) => `${nickname}님,\n정말 탈퇴하시겠어요?`,

  /** 안내사항 섹션 1 - 회원정보 파기 및 콘텐츠 삭제 */
  noticeSection1: {
    items: [
      '· 탈퇴가 완료되면 개인정보는 즉시 파기돼요.',
      '· 탈퇴하시면 내 코스, 추억 등 모든 컨텐츠가 사라지고, 복구가 불가해요.',
      '· 탈퇴하시면 보유하신 쿠폰과 포인트, 유료 결제하신 컨텐츠들 모두 사라져요. 추후에 동일한 계정으로 재가입하셔도 복구가 불가해요.',
    ],
  },

  /** 서브 타이틀 - 떠나는 이유 */
  reasonTitle: '떠나시는 이유를 알려주세요',

  /** 탈퇴 사유 입력창 */
  feedbackInput: {
    placeholder: '네이버스를 탈퇴하는 사유를 알려주세요.\n고객님의 소중한 의견 담아\n더 나은 서비스로 보답하겠습니다.',
    maxLength: 500,
  },

  /** 동의 체크박스 */
  agreement: {
    text: '회원 탈퇴 유의사항을 확인하였으며 동의합니다.',
  },

  /** 회원 탈퇴 버튼 */
  deleteButton: {
    active: '회원 탈퇴',
    inactive: '회원 탈퇴',
  },

  /** 최종 확인 모달 */
  confirmationModal: {
    title: '정말 탈퇴하시겠습니까?',
    descriptions: [
      '탈퇴하시면 모든 데이터가 삭제되며,',
      '이 작업은 취소할 수 없습니다.',
    ],
    cancelText: '취소',
    confirmText: '탈퇴',
  },
} as const;

/**
 * 회원 탈퇴 화면 스타일 상수 (함수로 변경하여 theme 사용)
 */
import { theme } from '@/design-system/theme';

export const ACCOUNT_DELETION_STYLES = {
  /** 체크박스 간격 */
  checkboxGap: 7,
} as const;

/**
 * 회원 탈퇴 화면 색상 (함수형으로 theme 반환)
 */
export const getAccountDeletionColors = () => ({
  /** 안내사항 박스 배경색 */
  noticeBgColor: theme.colors.surface.normal.bg2,

  /** 안내사항 텍스트 색상 */
  noticeTextColor: theme.colors.surface.texticon.onnormal.text.lowEmp,

  /** 버튼 비활성화 배경색 */
  buttonInactiveBg: theme.colors.border.lowEmp,

  /** 버튼 비활성화 텍스트 색상 */
  buttonInactiveText: theme.colors.surface.texticon.onnormal.text.midEmp,

  /** 버튼 활성화 배경색 */
  buttonActiveBg: theme.colors.surface.brand.primary,

  /** 버튼 활성화 텍스트 색상 */
  buttonActiveText: theme.colors.surface.normal.white,

  /** 피드백 입력창 스타일 */
  feedbackInput: {
    backgroundColor: theme.colors.surface.normal.bg2,
    borderRadius: 10,
    padding: 16,
    minHeight: 120,
    textColor: theme.colors.surface.texticon.onnormal.text.black,
    placeholderColor: theme.colors.surface.texticon.onnormal.text.lowEmp,
  },
});
