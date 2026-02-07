/**
 * Payment Service
 *
 * 토스페이먼츠 결제 API 서비스
 * 실제 결제 연동 시 토스페이먼츠 SDK를 사용하며,
 * 현재는 Mock 구현으로 테스트 환경을 제공합니다.
 *
 * @see https://docs.tosspayments.com/reference/widget-sdk
 */

import * as Linking from 'expo-linking';
import type { ProductDetailData } from '../types/product.types';

/**
 * 결제 요청 파라미터
 */
export interface PaymentRequestParams {
  /** 주문 ID (고유값) */
  orderId: string;
  /** 주문명 */
  orderName: string;
  /** 결제 금액 */
  amount: number;
  /** 구매자 이름 */
  customerName?: string;
  /** 구매자 이메일 */
  customerEmail?: string;
  /** 구매자 전화번호 */
  customerMobilePhone?: string;
  /** 상품 ID */
  productId: string;
  /** 구매 수량 */
  quantity: number;
}

/**
 * 결제 결과
 */
export interface PaymentResult {
  /** 성공 여부 */
  success: boolean;
  /** 결제 키 (성공 시) */
  paymentKey?: string;
  /** 주문 ID */
  orderId?: string;
  /** 결제 금액 */
  amount?: number;
  /** 에러 코드 (실패 시) */
  errorCode?: string;
  /** 에러 메시지 (실패 시) */
  errorMessage?: string;
}

/**
 * 결제 승인 결과
 */
export interface PaymentConfirmResult {
  /** 성공 여부 */
  success: boolean;
  /** 결제 정보 (성공 시) */
  payment?: {
    paymentKey: string;
    orderId: string;
    amount: number;
    status: 'DONE' | 'CANCELED' | 'EXPIRED' | 'ABORTED';
    method: string;
    approvedAt: string;
  };
  /** 에러 메시지 (실패 시) */
  errorMessage?: string;
}

/**
 * 토스페이먼츠 설정
 * 실제 운영 시 환경변수로 관리해야 합니다.
 */
const TOSS_CONFIG = {
  // TODO: 실제 클라이언트 키로 교체 (환경변수 사용)
  clientKey: 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  // 결제 성공/실패 후 리다이렉트 URL
  successUrl: Linking.createURL('/payment/success'),
  failUrl: Linking.createURL('/payment/fail'),
};

/**
 * 고유 주문 ID 생성
 *
 * @param productId - 상품 ID
 * @returns 고유 주문 ID
 */
export function generateOrderId(productId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GGP_${productId}_${timestamp}_${random}`;
}

/**
 * 결제 요청 (Mock)
 *
 * 실제 구현 시 토스페이먼츠 SDK의 requestPayment 메서드를 사용합니다.
 *
 * @param params - 결제 요청 파라미터
 * @returns 결제 결과
 */
export async function requestPayment(
  params: PaymentRequestParams
): Promise<PaymentResult> {
  try {
    // TODO: 실제 토스페이먼츠 SDK 연동
    // const tossPayments = await loadTossPayments(TOSS_CONFIG.clientKey);
    // await tossPayments.requestPayment('카드', {
    //   amount: params.amount,
    //   orderId: params.orderId,
    //   orderName: params.orderName,
    //   customerName: params.customerName,
    //   successUrl: TOSS_CONFIG.successUrl,
    //   failUrl: TOSS_CONFIG.failUrl,
    // });

    if (__DEV__) console.log('[PaymentService] Payment requested:', params);

    // Mock: 네트워크 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: 항상 성공 (테스트 환경)
    const mockPaymentKey = `tgen_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    if (__DEV__) console.log('[PaymentService] Payment successful:', {
      paymentKey: mockPaymentKey,
      orderId: params.orderId,
      amount: params.amount,
    });

    return {
      success: true,
      paymentKey: mockPaymentKey,
      orderId: params.orderId,
      amount: params.amount,
    };
  } catch (error) {
    console.error('[PaymentService] Payment request failed:', error);
    return {
      success: false,
      errorCode: 'PAYMENT_FAILED',
      errorMessage: error instanceof Error ? error.message : '결제 요청에 실패했습니다.',
    };
  }
}

/**
 * 결제 승인 (Mock)
 *
 * 서버에서 결제 승인을 처리해야 합니다.
 * 실제 구현 시 백엔드 API를 호출하여 토스페이먼츠 결제 승인 API를 사용합니다.
 *
 * @param paymentKey - 결제 키
 * @param orderId - 주문 ID
 * @param amount - 결제 금액
 * @returns 결제 승인 결과
 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<PaymentConfirmResult> {
  try {
    // TODO: 실제 백엔드 API 호출
    // const response = await fetch('/api/payments/confirm', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentKey, orderId, amount }),
    // });
    // const data = await response.json();

    if (__DEV__) console.log('[PaymentService] Payment confirmation requested:', {
      paymentKey,
      orderId,
      amount,
    });

    // Mock: 네트워크 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock: 항상 성공
    const approvedAt = new Date().toISOString();

    if (__DEV__) console.log('[PaymentService] Payment confirmed:', {
      paymentKey,
      orderId,
      amount,
      approvedAt,
    });

    return {
      success: true,
      payment: {
        paymentKey,
        orderId,
        amount,
        status: 'DONE',
        method: '카드',
        approvedAt,
      },
    };
  } catch (error) {
    console.error('[PaymentService] Payment confirmation failed:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '결제 승인에 실패했습니다.',
    };
  }
}

/**
 * 결제 취소 (Mock)
 *
 * @param paymentKey - 결제 키
 * @param cancelReason - 취소 사유
 * @returns 취소 결과
 */
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    // TODO: 실제 백엔드 API 호출
    // const response = await fetch('/api/payments/cancel', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ paymentKey, cancelReason }),
    // });

    if (__DEV__) console.log('[PaymentService] Payment cancellation requested:', {
      paymentKey,
      cancelReason,
    });

    // Mock: 네트워크 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (__DEV__) console.log('[PaymentService] Payment cancelled successfully');

    return { success: true };
  } catch (error) {
    console.error('[PaymentService] Payment cancellation failed:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '결제 취소에 실패했습니다.',
    };
  }
}

/**
 * 결제 정보 조회 (Mock)
 *
 * @param paymentKey - 결제 키
 * @returns 결제 정보
 */
export async function getPaymentInfo(
  paymentKey: string
): Promise<PaymentConfirmResult['payment'] | null> {
  try {
    // TODO: 실제 백엔드 API 호출
    // const response = await fetch(`/api/payments/${paymentKey}`);
    // const data = await response.json();

    if (__DEV__) console.log('[PaymentService] Payment info requested:', paymentKey);

    // Mock: 네트워크 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock: 기본 결제 정보 반환
    return {
      paymentKey,
      orderId: 'MOCK_ORDER',
      amount: 0,
      status: 'DONE',
      method: '카드',
      approvedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[PaymentService] Failed to get payment info:', error);
    return null;
  }
}

/**
 * 공구 참여 정보 저장 (Mock)
 *
 * 결제 완료 후 공구 참여 정보를 서버에 저장합니다.
 *
 * @param productId - 상품 ID
 * @param paymentKey - 결제 키
 * @param quantity - 참여 수량
 * @returns 저장 결과
 */
export async function saveParticipation(
  productId: string,
  paymentKey: string,
  quantity: number
): Promise<{ success: boolean; participationId?: string; errorMessage?: string }> {
  try {
    // TODO: 실제 백엔드 API 호출
    // const response = await fetch('/api/participations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ productId, paymentKey, quantity }),
    // });

    if (__DEV__) console.log('[PaymentService] Saving participation:', {
      productId,
      paymentKey,
      quantity,
    });

    // Mock: 네트워크 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    const participationId = `PART_${Date.now()}`;

    if (__DEV__) console.log('[PaymentService] Participation saved:', participationId);

    return {
      success: true,
      participationId,
    };
  } catch (error) {
    console.error('[PaymentService] Failed to save participation:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : '참여 정보 저장에 실패했습니다.',
    };
  }
}
