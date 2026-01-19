/**
 * usePayment Hook
 *
 * 결제 페이지 상태 관리 훅
 * - 상품 정보 로딩
 * - 약관 동의 상태 관리
 * - 결제 금액 계산
 * - 토스페이먼츠 결제 처리 로직
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getProductDetailById } from '@/app/shared/services/mock';
import {
  generateOrderId,
  requestPayment,
  confirmPayment,
  saveParticipation,
} from '@/app/shared/services/paymentService';
import type { ProductDetailData } from '@/app/shared/types/product.types';

export interface UsePaymentReturn {
  /** 상품 정보 */
  product: ProductDetailData | null;
  /** 구매 수량 */
  quantity: number;
  /** 총 결제 금액 */
  totalAmount: number;
  /** 약관 동의 여부 */
  isTermsAgreed: boolean;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 결제 처리 중 상태 */
  isProcessing: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 약관 동의 상태 변경 */
  setIsTermsAgreed: (agreed: boolean) => void;
  /** 결제 처리 */
  handlePayment: () => Promise<void>;
}

export const usePayment = (): UsePaymentReturn => {
  const router = useRouter();
  const { id, quantity: quantityParam } = useLocalSearchParams<{
    id: string;
    quantity?: string;
  }>();

  // 상태
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 수량 파싱 (기본값: 1)
  const quantity = useMemo(() => {
    const parsed = parseInt(quantityParam || '1', 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [quantityParam]);

  // 총 결제 금액 계산
  const totalAmount = useMemo(() => {
    if (!product) return 0;
    return product.pricePerSlot * quantity;
  }, [product, quantity]);

  // 상품 정보 로드
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('상품 ID가 없습니다.');
        }

        // Mock 데이터에서 상품 정보 조회
        const productData = getProductDetailById(id);

        if (!productData) {
          throw new Error('상품을 찾을 수 없습니다.');
        }

        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /**
   * 결제 처리
   *
   * 토스페이먼츠 API를 사용하여 결제를 진행합니다.
   * 1. 결제 요청 (requestPayment)
   * 2. 결제 승인 (confirmPayment)
   * 3. 참여 정보 저장 (saveParticipation)
   * 4. 참여완료 화면으로 이동
   */
  const handlePayment = useCallback(async () => {
    if (!product) return;

    // 이미 처리 중이면 중복 실행 방지
    if (isProcessing) return;

    // 약관 동의 체크 (필요시 활성화)
    // if (!isTermsAgreed) {
    //   Alert.alert('알림', '약관에 동의해주세요.');
    //   return;
    // }

    setIsProcessing(true);

    try {
      // 1. 주문 ID 생성
      const orderId = generateOrderId(product.id);

      // 2. 결제 요청
      const paymentResult = await requestPayment({
        orderId,
        orderName: product.title,
        amount: totalAmount,
        productId: product.id,
        quantity,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.errorMessage || '결제 요청에 실패했습니다.');
      }

      // 3. 결제 승인
      const confirmResult = await confirmPayment(
        paymentResult.paymentKey!,
        orderId,
        totalAmount
      );

      if (!confirmResult.success) {
        throw new Error(confirmResult.errorMessage || '결제 승인에 실패했습니다.');
      }

      // 4. 참여 정보 저장
      const participationResult = await saveParticipation(
        product.id,
        paymentResult.paymentKey!,
        quantity
      );

      if (!participationResult.success) {
        // 참여 정보 저장 실패 시에도 결제는 완료된 상태
        console.warn('[usePayment] Failed to save participation:', participationResult.errorMessage);
      }

      // 5. 참여완료 화면으로 이동
      router.push({
        pathname: '/payment/complete',
        params: {
          productId: product.id,
          productTitle: product.title,
          amount: totalAmount.toString(),
          quantity: quantity.toString(),
        },
      });
    } catch (err) {
      console.error('[usePayment] Payment failed:', err);

      Alert.alert(
        '결제 실패',
        err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다.',
        [{ text: '확인' }]
      );
    } finally {
      setIsProcessing(false);
    }
  }, [product, quantity, totalAmount, isProcessing, router]);

  return {
    product,
    quantity,
    totalAmount,
    isTermsAgreed,
    isLoading,
    isProcessing,
    error,
    setIsTermsAgreed,
    handlePayment,
  };
};
