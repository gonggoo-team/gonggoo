/**
 * Mock Product Data (Single Source of Truth)
 *
 * 모든 상품 데이터를 단일 소스로 관리합니다.
 * 각 화면에서 필요한 형태로 변환하여 사용합니다.
 */

import type {
  Badge,
  FeaturedProductData,
  ProductCardHorizontalData,
  ProductCardVerticalData,
  ProductDetailData,
  RecruitmentStatus,
  TargetAge,
  TargetGender,
} from '@/app/shared/types/product.types';

/**
 * BaseProduct: 모든 필드를 포함하는 완전한 상품 타입
 */
interface BaseProduct {
  id: string;
  imageUri: string;
  title: string;
  price: number;
  pricePerSlot: number;
  category: string;
  badges: Badge[];
  likes: number;
  progress: number;
  createdAt: number;
  discountRate: number;
  isReservationAvailable: boolean;
  slotCount: number;
  recruitmentStatus: RecruitmentStatus;
  targetGender: TargetGender;
  targetAge: TargetAge;
  priceLabelValue?: number;
  isClosed?: boolean;
  showProgress?: boolean;
}

/**
 * 데이터 생성 헬퍼 함수
 */
const createProduct = (
  id: number,
  overrides: Partial<BaseProduct>
): BaseProduct => {
  const defaults: BaseProduct = {
    id: id.toString(),
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: `상품 ${id}`,
    price: 50000,
    pricePerSlot: 5000,
    priceLabelValue: 1,
    category: '기타',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 30,
    progress: 50,
    showProgress: true,
    createdAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    discountRate: 20,
    isReservationAvailable: true,
    slotCount: 10,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  };
  return { ...defaults, ...overrides };
};

/**
 * 단일 상품 데이터 소스 (100개 상품, ID: 1-100)
 * 실제 백엔드 API에서 받아올 데이터 구조와 동일하게 설계
 *
 * 데이터 분포:
 * - 카테고리: 가전(20), 식품(15), 생활(15), 육아(10), 애완용품(10), 주방(10), 리빙(10), 패션(5), 기타(5)
 * - 가격대: 1,000원 ~ 200,000원 다양
 * - 슬롯: 1~20개 다양
 * - 모집 상태: 모집 중(60), 마감 임박(30), 모집 완료(10)
 * - 성별: 남성(25), 여성(25), 성별 전체(50)
 * - 연령대: 10대(10), 20대(20), 30대(20), 40대(15), 50대 이상(10), 연령대 전체(25)
 */
const ALL_PRODUCTS: BaseProduct[] = [
  // ID 1-10: 다양한 카테고리 및 가격대
  createProduct(1, {
    title: '삼성 갤럭시 버즈2 프로',
    price: 189000,
    pricePerSlot: 18900,
    category: '가전',
    badges: [
      { type: 'deadline', label: 'D-2' },
      { type: 'remaining', label: '3자리' },
    ],
    likes: 42,
    progress: 70,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    discountRate: 15,
    slotCount: 10,
    recruitmentStatus: '마감 임박',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  }),
  createProduct(2, {
    title: '에어팟 프로 2세대',
    price: 359000,
    pricePerSlot: 35900,
    category: '가전',
    badges: [{ type: 'deadline', label: 'D-1' }],
    likes: 87,
    progress: 85,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    discountRate: 20,
    slotCount: 10,
    recruitmentStatus: '마감 임박',
    targetGender: '남성',
    targetAge: '20대',
  }),
  createProduct(3, {
    title: 'LG 그램 노트북 15인치',
    price: 1590000,
    pricePerSlot: 159000,
    category: '가전',
    badges: [{ type: 'closed', label: '마감' }],
    isClosed: true,
    likes: 156,
    progress: 100,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    discountRate: 10,
    isReservationAvailable: false,
    slotCount: 10,
    recruitmentStatus: '모집 완료',
    targetGender: '성별 전체',
    targetAge: '30대',
  }),
  createProduct(4, {
    title: '유기농 쌀 10kg',
    price: 45000,
    pricePerSlot: 4500,
    category: '식품',
    badges: [{ type: 'recruiting', label: '모집중' }],
    likes: 34,
    progress: 60,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    discountRate: 25,
    slotCount: 3,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '40대',
  }),
  createProduct(5, {
    title: '친환경 세제 세트',
    price: 28000,
    pricePerSlot: 2800,
    category: '생활',
    badges: [{ type: 'recruiting', label: '모집중' }],
    likes: 21,
    progress: 45,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    discountRate: 30,
    isReservationAvailable: false,
    slotCount: 7,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '20대',
  }),
  {
    id: '6',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '아기 기저귀 100매',
    price: 35000,
    pricePerSlot: 3500,
    priceLabelValue: 1,
    category: '육아',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 65,
    progress: 80,
    showProgress: true,
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    discountRate: 18,
    isReservationAvailable: true,
    slotCount: 12,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '30대',
  },
  {
    id: '7',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '강아지 사료 5kg',
    price: 42000,
    pricePerSlot: 4200,
    priceLabelValue: 1,
    category: '애완용품',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 48,
    progress: 55,
    showProgress: true,
    createdAt: Date.now() - 12 * 60 * 60 * 1000,
    discountRate: 22,
    isReservationAvailable: true,
    slotCount: 15,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '40대',
  },
  {
    id: '8',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '프라이팬 세트',
    price: 89000,
    pricePerSlot: 8900,
    priceLabelValue: 1,
    category: '주방',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 92,
    progress: 75,
    showProgress: true,
    createdAt: Date.now() - 18 * 60 * 60 * 1000,
    discountRate: 35,
    isReservationAvailable: false,
    slotCount: 6,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '30대',
  },
  {
    id: '9',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '인테리어 조명',
    price: 125000,
    pricePerSlot: 12500,
    priceLabelValue: 1,
    category: '리빙',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 27,
    progress: 40,
    showProgress: true,
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    discountRate: 12,
    isReservationAvailable: true,
    slotCount: 8,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '50대 이상',
  },
  {
    id: '10',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '핸드폰 케이스 10종',
    price: 18000,
    pricePerSlot: 1800,
    priceLabelValue: 1,
    category: '기타',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 103,
    progress: 90,
    showProgress: true,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    discountRate: 40,
    isReservationAvailable: false,
    slotCount: 14,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '10대',
  },
  // ID 11-20: 고가 상품 및 다양한 성별/연령대
  {
    id: '11',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '명품 지갑 럭셔리 컬렉션',
    price: 750000,
    pricePerSlot: 75000,
    priceLabelValue: 1,
    category: '기타',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 54,
    progress: 65,
    showProgress: true,
    createdAt: Date.now() - 8 * 60 * 60 * 1000,
    discountRate: 28,
    isReservationAvailable: true,
    slotCount: 10,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '30대',
  },
  {
    id: '12',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '게이밍 키보드 기계식',
    price: 850000,
    pricePerSlot: 85000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 98,
    progress: 70,
    showProgress: true,
    createdAt: Date.now() - 10 * 60 * 60 * 1000,
    discountRate: 32,
    isReservationAvailable: true,
    slotCount: 8,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '10대',
  },
  {
    id: '13',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '무선 청소기 프리미엄',
    price: 680000,
    pricePerSlot: 68000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 76,
    progress: 55,
    showProgress: true,
    createdAt: Date.now() - 14 * 60 * 60 * 1000,
    discountRate: 26,
    isReservationAvailable: false,
    slotCount: 9,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '40대',
  },
  {
    id: '14',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '스마트워치 프로',
    price: 550000,
    pricePerSlot: 55000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 63,
    progress: 48,
    showProgress: true,
    createdAt: Date.now() - 16 * 60 * 60 * 1000,
    discountRate: 24,
    isReservationAvailable: true,
    slotCount: 11,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '10대',
  },
  {
    id: '15',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '여성 화장품 세트',
    price: 920000,
    pricePerSlot: 92000,
    priceLabelValue: 1,
    category: '생활',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 112,
    progress: 82,
    showProgress: true,
    createdAt: Date.now() - 20 * 60 * 60 * 1000,
    discountRate: 35,
    isReservationAvailable: true,
    slotCount: 13,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '20대',
  },
  {
    id: '16',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '프리미엄 운동화',
    price: 780000,
    pricePerSlot: 78000,
    priceLabelValue: 1,
    category: '기타',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 87,
    progress: 68,
    showProgress: true,
    createdAt: Date.now() - 22 * 60 * 60 * 1000,
    discountRate: 29,
    isReservationAvailable: false,
    slotCount: 6,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '10대',
  },
  {
    id: '17',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '블루투스 스피커',
    price: 620000,
    pricePerSlot: 62000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 71,
    progress: 58,
    showProgress: true,
    createdAt: Date.now() - 26 * 60 * 60 * 1000,
    discountRate: 27,
    isReservationAvailable: true,
    slotCount: 7,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '50대 이상',
  },
  {
    id: '18',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '전기자전거',
    price: 950000,
    pricePerSlot: 95000,
    priceLabelValue: 1,
    category: '기타',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 95,
    progress: 73,
    showProgress: true,
    createdAt: Date.now() - 30 * 60 * 60 * 1000,
    discountRate: 31,
    isReservationAvailable: true,
    slotCount: 5,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '50대 이상',
  },
  {
    id: '19',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '다이슨 청소기 V15',
    price: 890000,
    pricePerSlot: 89000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 124,
    progress: 75,
    showProgress: true,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    discountRate: 20,
    isReservationAvailable: true,
    slotCount: 10,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '30대',
  },
  {
    id: '20',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '아이패드 프로 11인치',
    price: 1290000,
    pricePerSlot: 129000,
    priceLabelValue: 1,
    category: '가전',
    badges: [
      { type: 'recruiting', label: '모집중' },
      { type: 'remaining', label: '1자리' },
    ],
    isClosed: false,
    likes: 156,
    progress: 90,
    showProgress: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    discountRate: 15,
    isReservationAvailable: true,
    slotCount: 12,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '20대',
  },
  // ID 21-30: 추가 다양한 상품
  {
    id: '21',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '맥북 에어 M2',
    price: 1690000,
    pricePerSlot: 169000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 89,
    progress: 60,
    showProgress: true,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    discountRate: 12,
    isReservationAvailable: false,
    slotCount: 8,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '30대',
  },
  {
    id: '22',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '소니 무선 헤드폰',
    price: 450000,
    pricePerSlot: 45000,
    priceLabelValue: 1,
    category: '가전',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 67,
    progress: 80,
    showProgress: true,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    discountRate: 25,
    isReservationAvailable: true,
    slotCount: 9,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '20대',
  },
  {
    id: '23',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '남성용 패션 정장 양말 100세트',
    price: 36300,
    pricePerSlot: 12100,
    priceLabelValue: 1,
    category: '패션',
    badges: [
      { type: 'remaining', label: '3일 남음' },
      { type: 'recruiting', label: '65슬롯 모집' },
    ],
    isClosed: false,
    likes: 45,
    progress: 66,
    showProgress: true,
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    discountRate: 33,
    isReservationAvailable: true,
    slotCount: 65,
    recruitmentStatus: '모집 중',
    targetGender: '남성',
    targetAge: '연령대 전체',
  },
  {
    id: '24',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '프리미엄 무선 이어폰 5세트',
    price: 125000,
    pricePerSlot: 25000,
    priceLabelValue: 1,
    category: '가전',
    badges: [
      { type: 'deadline', label: '오늘 마감' },
      { type: 'recruiting', label: '1슬롯 남음' },
    ],
    isClosed: false,
    likes: 132,
    progress: 80,
    showProgress: true,
    createdAt: Date.now() - 7 * 60 * 60 * 1000,
    discountRate: 38,
    isReservationAvailable: true,
    slotCount: 5,
    recruitmentStatus: '마감 임박',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  },
  {
    id: '25',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '고급 텀블러 10개 세트',
    price: 95000,
    pricePerSlot: 9500,
    priceLabelValue: 1,
    category: '생활',
    badges: [
      { type: 'remaining', label: '5일 남음' },
      { type: 'recruiting', label: '2슬롯 모집' },
    ],
    isClosed: false,
    likes: 158,
    progress: 95,
    showProgress: true,
    createdAt: Date.now() - 9 * 60 * 60 * 1000,
    discountRate: 42,
    isReservationAvailable: false,
    slotCount: 10,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  },
  {
    id: '26',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '삼성 갤럭시 S24 울트라 256GB',
    price: 1590000,
    pricePerSlot: 159000,
    priceLabelValue: 1,
    category: '가전',
    badges: [
      { type: 'recruiting', label: '모집중' },
      { type: 'remaining', label: '2자리' },
    ],
    isClosed: false,
    likes: 234,
    progress: 85,
    showProgress: true,
    createdAt: Date.now() - 11 * 60 * 60 * 1000,
    discountRate: 18,
    isReservationAvailable: true,
    slotCount: 10,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  },
  {
    id: '27',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '코스트코 크리넥스 티슈 250매 x 8팩',
    price: 14600,
    pricePerSlot: 3900,
    priceLabelValue: 1,
    category: '생활',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 78,
    progress: 50,
    showProgress: true,
    createdAt: Date.now() - 13 * 60 * 60 * 1000,
    discountRate: 45,
    isReservationAvailable: true,
    slotCount: 4,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  },
  {
    id: '28',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '오가닉 커피 원두 1kg',
    price: 32000,
    pricePerSlot: 8000,
    priceLabelValue: 1,
    category: '식품',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 56,
    progress: 62,
    showProgress: true,
    createdAt: Date.now() - 15 * 60 * 60 * 1000,
    discountRate: 36,
    isReservationAvailable: true,
    slotCount: 4,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '30대',
  },
  {
    id: '29',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '스테인리스 식기 세트',
    price: 68000,
    pricePerSlot: 6800,
    priceLabelValue: 1,
    category: '주방',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 43,
    progress: 53,
    showProgress: true,
    createdAt: Date.now() - 17 * 60 * 60 * 1000,
    discountRate: 28,
    isReservationAvailable: false,
    slotCount: 10,
    recruitmentStatus: '모집 중',
    targetGender: '여성',
    targetAge: '40대',
  },
  {
    id: '30',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '고양이 모래 10L',
    price: 28000,
    pricePerSlot: 5600,
    priceLabelValue: 1,
    category: '애완용품',
    badges: [{ type: 'recruiting', label: '모집중' }],
    isClosed: false,
    likes: 39,
    progress: 44,
    showProgress: true,
    createdAt: Date.now() - 19 * 60 * 60 * 1000,
    discountRate: 22,
    isReservationAvailable: true,
    slotCount: 5,
    recruitmentStatus: '모집 중',
    targetGender: '성별 전체',
    targetAge: '연령대 전체',
  },

  // ID 31-50: 가전 제품 위주
  createProduct(31, { title: '무선 마우스 로지텍', price: 45000, pricePerSlot: 4500, category: '가전', likes: 82, progress: 78, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '남성', targetAge: '20대', discountRate: 25, badges: [{ type: 'deadline', label: 'D-1' }] }),
  createProduct(32, { title: '블루투스 스피커 JBL', price: 120000, pricePerSlot: 12000, category: '가전', likes: 95, progress: 85, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '30대', discountRate: 30, badges: [{ type: 'deadline', label: 'D-2' }] }),
  createProduct(33, { title: '전기포트 1.5L', price: 35000, pricePerSlot: 3500, category: '가전', likes: 45, progress: 60, slotCount: 8, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '40대', discountRate: 20 }),
  createProduct(34, { title: 'USB 충전기 멀티포트', price: 28000, pricePerSlot: 2800, category: '가전', likes: 68, progress: 70, slotCount: 12, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),
  createProduct(35, { title: '디지털 체중계', price: 42000, pricePerSlot: 4200, category: '가전', likes: 52, progress: 55, slotCount: 9, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 18 }),
  createProduct(36, { title: '헤어드라이어 프리미엄', price: 180000, pricePerSlot: 18000, category: '가전', likes: 110, progress: 90, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '여성', targetAge: '20대', discountRate: 35, badges: [{ type: 'deadline', label: 'D-1' }] }),
  createProduct(37, { title: '전기면도기 브라운', price: 95000, pricePerSlot: 9500, category: '가전', likes: 72, progress: 65, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '남성', targetAge: '30대', discountRate: 28 }),
  createProduct(38, { title: '공기청정기 샤오미', price: 250000, pricePerSlot: 25000, category: '가전', likes: 130, progress: 88, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 32, badges: [{ type: 'deadline', label: 'D-2' }] }),
  createProduct(39, { title: '전기주전자 스텐', price: 32000, pricePerSlot: 3200, category: '가전', likes: 48, progress: 50, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '40대', discountRate: 15 }),
  createProduct(40, { title: '휴대용 선풍기', price: 18000, pricePerSlot: 1800, category: '가전', likes: 63, progress: 72, slotCount: 15, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 25 }),
  createProduct(41, { title: '전기요 싱글', price: 68000, pricePerSlot: 6800, category: '가전', likes: 55, progress: 58, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '50대 이상', discountRate: 20 }),
  createProduct(42, { title: 'LED 스탠드', price: 45000, pricePerSlot: 4500, category: '가전', likes: 41, progress: 48, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '10대', discountRate: 18 }),
  createProduct(43, { title: '보조배터리 20000mAh', price: 35000, pricePerSlot: 3500, category: '가전', likes: 88, progress: 80, slotCount: 12, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '20대', discountRate: 30, badges: [{ type: 'deadline', label: 'D-1' }] }),
  createProduct(44, { title: '무선 이어폰 삼성', price: 120000, pricePerSlot: 12000, category: '가전', likes: 102, progress: 85, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '남성', targetAge: '10대', discountRate: 28, badges: [{ type: 'deadline', label: 'D-2' }] }),
  createProduct(45, { title: '전기밥솥 6인용', price: 150000, pricePerSlot: 15000, category: '가전', likes: 75, progress: 68, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 25 }),
  createProduct(46, { title: '전자레인지 LG', price: 185000, pricePerSlot: 18500, category: '가전', likes: 92, progress: 75, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),
  createProduct(47, { title: '토스터기 4구', price: 52000, pricePerSlot: 5200, category: '가전', likes: 58, progress: 62, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 20 }),

  // ID 48-60: 식품 위주
  // createProduct(48, { title: '유기농 현미 5kg', price: 38000, pricePerSlot: 3800, category: '식품', likes: 47, progress: 55, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '40대', discountRate: 28 }),
  // createProduct(49, { title: '올리브유 엑스트라버진 1L', price: 25000, pricePerSlot: 2500, category: '식품', likes: 62, progress: 70, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 25 }),
  // createProduct(50, { title: '견과류 믹스 1kg', price: 42000, pricePerSlot: 4200, category: '식품', likes: 78, progress: 75, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 32 }),
  // createProduct(51, { title: '꿀 아카시아 1kg', price: 35000, pricePerSlot: 3500, category: '식품', likes: 55, progress: 60, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '50대 이상', discountRate: 22 }),
  // createProduct(52, { title: '김치 배추김치 10kg', price: 65000, pricePerSlot: 6500, category: '식품', likes: 85, progress: 82, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 30, badges: [{ type: 'deadline', label: 'D-1' }] }),
  // createProduct(53, { title: '삼겹살 국내산 3kg', price: 98000, pricePerSlot: 9800, category: '식품', likes: 112, progress: 88, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 35, badges: [{ type: 'deadline', label: 'D-2' }] }),
  // createProduct(54, { title: '냉동 만두 1kg x 10봉', price: 85000, pricePerSlot: 8500, category: '식품', likes: 68, progress: 65, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 25 }),
  // createProduct(55, { title: '프로틴 파우더 2kg', price: 72000, pricePerSlot: 7200, category: '식품', likes: 92, progress: 80, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '남성', targetAge: '20대', discountRate: 28 }),
  // createProduct(56, { title: '참치캔 150g x 48개', price: 58000, pricePerSlot: 5800, category: '식품', likes: 105, progress: 85, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 33, badges: [{ type: 'deadline', label: 'D-1' }] }),
  // createProduct(57, { title: '스팸 200g x 8개', price: 42000, pricePerSlot: 4200, category: '식품', likes: 78, progress: 72, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 26 }),
  // createProduct(58, { title: '라면 신라면 40개입', price: 32000, pricePerSlot: 3200, category: '식품', likes: 95, progress: 82, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '10대', discountRate: 28 }),
  // createProduct(59, { title: '생수 2L x 12병', price: 15000, pricePerSlot: 1500, category: '식품', likes: 42, progress: 50, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 20 }),
  // createProduct(60, { title: '고추장 1kg x 3개', price: 28000, pricePerSlot: 2800, category: '식품', likes: 52, progress: 58, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '40대', discountRate: 22 }),

  // // ID 61-73: 생활용품 위주
  // createProduct(61, { title: '샴푸 900ml x 3개', price: 35000, pricePerSlot: 3500, category: '생활', likes: 62, progress: 68, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 25 }),
  // createProduct(62, { title: '치약 120g x 10개', price: 22000, pricePerSlot: 2200, category: '생활', likes: 58, progress: 65, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),
  // createProduct(63, { title: '세탁세제 액체형 3L', price: 18000, pricePerSlot: 1800, category: '생활', likes: 72, progress: 75, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 28 }),
  // createProduct(64, { title: '섬유유연제 2L x 2개', price: 24000, pricePerSlot: 2400, category: '생활', likes: 55, progress: 62, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 25 }),
  // createProduct(65, { title: '주방세제 1L x 5개', price: 16000, pricePerSlot: 1600, category: '생활', likes: 48, progress: 58, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 20 }),
  // createProduct(66, { title: '화장지 30롤 x 3팩', price: 42000, pricePerSlot: 4200, category: '생활', likes: 88, progress: 80, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 30, badges: [{ type: 'deadline', label: 'D-1' }] }),
  // createProduct(67, { title: '물티슈 100매 x 20개', price: 38000, pricePerSlot: 3800, category: '생활', likes: 75, progress: 72, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 26 }),
  // createProduct(68, { title: '키친타올 6롤 x 4팩', price: 28000, pricePerSlot: 2800, category: '생활', likes: 52, progress: 60, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),
  // createProduct(69, { title: '비누 100g x 20개', price: 18000, pricePerSlot: 1800, category: '생활', likes: 42, progress: 55, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 20 }),
  // createProduct(70, { title: '칫솔 x 20개', price: 15000, pricePerSlot: 1500, category: '생활', likes: 48, progress: 58, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 18 }),
  // createProduct(71, { title: '핸드워시 250ml x 5개', price: 22000, pricePerSlot: 2200, category: '생활', likes: 55, progress: 62, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),
  // createProduct(72, { title: '바디워시 1L x 3개', price: 32000, pricePerSlot: 3200, category: '생활', likes: 62, progress: 68, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 25 }),
  // createProduct(73, { title: '로션 500ml x 3개', price: 45000, pricePerSlot: 4500, category: '생활', likes: 72, progress: 72, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '20대', discountRate: 28 }),

  // // ID 74-82: 육아용품 위주
  // createProduct(74, { title: '분유 800g x 3캔', price: 85000, pricePerSlot: 8500, category: '육아', likes: 92, progress: 82, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 28 }),
  // createProduct(75, { title: '아기 물티슈 80매 x 20개', price: 42000, pricePerSlot: 4200, category: '육아', likes: 78, progress: 75, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 25 }),
  // createProduct(76, { title: '기저귀 중형 60매 x 4팩', price: 72000, pricePerSlot: 7200, category: '육아', likes: 88, progress: 80, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '30대', discountRate: 30, badges: [{ type: 'deadline', label: 'D-2' }] }),
  // createProduct(77, { title: '아기 로션 500ml', price: 28000, pricePerSlot: 2800, category: '육아', likes: 55, progress: 62, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 22 }),
  // createProduct(78, { title: '유아용 샴푸 500ml x 2개', price: 32000, pricePerSlot: 3200, category: '육아', likes: 62, progress: 68, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 24 }),
  // createProduct(79, { title: '이유식 파우치 10팩', price: 18000, pricePerSlot: 1800, category: '육아', likes: 48, progress: 58, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 20 }),
  // createProduct(80, { title: '아기 목욕타올 5장', price: 25000, pricePerSlot: 2500, category: '육아', likes: 52, progress: 60, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 22 }),
  // createProduct(81, { title: '젖병 240ml x 3개', price: 35000, pricePerSlot: 3500, category: '육아', likes: 65, progress: 70, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 25 }),
  // createProduct(82, { title: '유아 치약 90g x 5개', price: 18000, pricePerSlot: 1800, category: '육아', likes: 45, progress: 55, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 20 }),

  // // ID 83-90: 애완용품 위주
  // createProduct(83, { title: '강아지 간식 닭가슴살 1kg', price: 32000, pricePerSlot: 3200, category: '애완용품', likes: 68, progress: 72, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 26 }),
  // createProduct(84, { title: '고양이 화장실 모래 6L x 3개', price: 45000, pricePerSlot: 4500, category: '애완용품', likes: 75, progress: 75, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 28 }),
  // createProduct(85, { title: '강아지 샴푸 500ml', price: 22000, pricePerSlot: 2200, category: '애완용품', likes: 52, progress: 62, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 22 }),
  // createProduct(86, { title: '고양이 간식 츄르 50개입', price: 28000, pricePerSlot: 2800, category: '애완용품', likes: 85, progress: 80, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 30, badges: [{ type: 'deadline', label: 'D-1' }] }),
  // createProduct(87, { title: '강아지 사료 오리젠 3kg', price: 72000, pricePerSlot: 7200, category: '애완용품', likes: 95, progress: 85, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 32, badges: [{ type: 'deadline', label: 'D-2' }] }),
  // createProduct(88, { title: '고양이 사료 로얄캐닌 2kg', price: 58000, pricePerSlot: 5800, category: '애완용품', likes: 88, progress: 82, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 28 }),
  // createProduct(89, { title: '강아지 장난감 세트', price: 18000, pricePerSlot: 1800, category: '애완용품', likes: 48, progress: 58, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 20 }),
  // createProduct(90, { title: '고양이 스크래쳐', price: 25000, pricePerSlot: 2500, category: '애완용품', likes: 55, progress: 62, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),

  // // ID 91-100: 주방/리빙/패션/기타 혼합
  // createProduct(91, { title: '냄비 세트 5종', price: 95000, pricePerSlot: 9500, category: '주방', likes: 78, progress: 75, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '30대', discountRate: 28 }),
  // createProduct(92, { title: '접시 세트 6인용', price: 42000, pricePerSlot: 4200, category: '주방', likes: 55, progress: 65, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 24 }),
  // createProduct(93, { title: '수저세트 스텐 10인분', price: 35000, pricePerSlot: 3500, category: '주방', likes: 48, progress: 60, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 22 }),
  // createProduct(94, { title: '보온병 1L', price: 45000, pricePerSlot: 4500, category: '주방', likes: 62, progress: 68, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 25 }),
  // createProduct(95, { title: '커튼 블라인드 2장', price: 68000, pricePerSlot: 6800, category: '리빙', likes: 72, progress: 72, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 26 }),
  // createProduct(96, { title: '러그 150x200cm', price: 85000, pricePerSlot: 8500, category: '리빙', likes: 82, progress: 78, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '30대', discountRate: 28 }),
  // createProduct(97, { title: '쿠션 5개 세트', price: 42000, pricePerSlot: 4200, category: '리빙', likes: 58, progress: 65, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '20대', discountRate: 24 }),
  // createProduct(98, { title: '티셔츠 무지 10장', price: 55000, pricePerSlot: 5500, category: '패션', likes: 88, progress: 80, slotCount: 10, recruitmentStatus: '마감 임박', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 30, badges: [{ type: 'deadline', label: 'D-1' }] }),
  // createProduct(99, { title: '양말 10켤레 세트', price: 28000, pricePerSlot: 2800, category: '패션', likes: 72, progress: 72, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '성별 전체', targetAge: '연령대 전체', discountRate: 26 }),
  // createProduct(100, { title: '핸드크림 50ml x 10개', price: 35000, pricePerSlot: 3500, category: '기타', likes: 65, progress: 68, slotCount: 10, recruitmentStatus: '모집 중', targetGender: '여성', targetAge: '20대', discountRate: 24 }),
];

/**
 * 타입 변환 유틸리티: BaseProduct → ProductCardVerticalData
 */
const toVerticalCard = (product: BaseProduct): ProductCardVerticalData => ({
  id: product.id,
  imageUri: product.imageUri,
  title: product.title,
  price: product.price,
  pricePerSlot: product.pricePerSlot,
  priceLabelValue: product.priceLabelValue,
  badges: product.badges,
  isClosed: product.isClosed,
  likes: product.likes,
  progress: product.progress,
  showProgress: product.showProgress,
  category: product.category,
  createdAt: product.createdAt,
  discountRate: product.discountRate,
  isReservationAvailable: product.isReservationAvailable,
  slotCount: product.slotCount,
  recruitmentStatus: product.recruitmentStatus,
  targetGender: product.targetGender,
  targetAge: product.targetAge,
});

/**
 * 타입 변환 유틸리티: BaseProduct → ProductCardHorizontalData
 */
const toHorizontalCard = (product: BaseProduct): ProductCardHorizontalData => ({
  id: product.id,
  imageUri: product.imageUri,
  title: product.title,
  price: product.price,
  pricePerSlot: product.pricePerSlot,
  buyersCount: Math.floor(product.progress / 2), // progress 기반 임시 계산
  progress: product.progress,
  badges: product.badges,
  category: product.category,
  createdAt: product.createdAt,
  likes: product.likes,
  discountRate: product.discountRate,
  isReservationAvailable: product.isReservationAvailable,
  slotCount: product.slotCount,
  recruitmentStatus: product.recruitmentStatus,
});

/**
 * 타입 변환 유틸리티: BaseProduct → ProductDetailData
 */
const toDetailData = (product: BaseProduct): ProductDetailData => ({
  id: product.id,
  category: product.category,
  title: product.title,
  imageUris: [product.imageUri, product.imageUri], // 동일 이미지 2개
  price: product.price,
  pricePerSlot: product.pricePerSlot,
  likes: product.likes,
  badges: product.badges,
  recruitmentStatus: product.recruitmentStatus,
  daysRemaining: Math.floor(Math.random() * 30), // 랜덤 값
  progress: {
    participantCount: Math.floor((product.progress || 50) / 25), // 진행률 기반
    totalSlots: product.slotCount,
    percentage: product.progress || 50,
  },
  groupBuyInfo: {
    totalSlots: product.slotCount,
    quantityPerSlot: '상품 1개',
    description: '공동구매에 참여해주셔서 감사합니다.',
  },
  host: {
    nickname: '공구장',
    rating: 7.0 + Math.random() * 3, // 7.0~10.0 사이
  },
  participants: Array.from(
    { length: Math.min(4, Math.floor(product.progress / 25)) },
    (_, i) => ({ id: `p${i + 1}` })
  ),
  transaction: {
    location: '협의 가능',
    timeDescription: '평일 저녁 또는 주말',
    deliveryAvailable: product.isReservationAvailable,
  },
  reportable: true,
});

/**
 * 모든 상품 데이터에서 가격 범위 계산 (pricePerSlot 기준)
 * @deprecated 대신 calculatePriceRange(getAllProducts()) 사용 권장
 */
export const getProductPriceRange = (): { min: number; max: number } => {
  // calculatePriceRange 유틸리티 함수 사용
  const { calculatePriceRange } = require('@/app/shared/utils/filterProducts');
  return calculatePriceRange(ALL_PRODUCTS);
};

/**
 * 마감 임박 상품 (세로형 카드)
 * 조건: recruitmentStatus === '마감 임박'
 */
export const getMockDeadlineProducts = (): ProductCardVerticalData[] => {
  return ALL_PRODUCTS.filter(
    (p) => p.recruitmentStatus === '마감 임박'
  ).map(toVerticalCard);
};

/**
 * 인기 상품 (가로형 카드)
 * 조건: 좋아요 50개 이상, 상위 8개
 */
export const getMockPopularProducts = (): ProductCardHorizontalData[] => {
  return ALL_PRODUCTS.filter((p) => p.likes >= 50)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 8)
    .map(toHorizontalCard);
};

/**
 * 인기 상품 (세로형 카드 - 인기 탭용)
 * 조건: 좋아요 50개 이상, 좋아요 순 정렬
 */
export const getMockPopularProductsVertical = (): ProductCardVerticalData[] => {
  return ALL_PRODUCTS.filter((p) => p.likes >= 50)
    .sort((a, b) => b.likes - a.likes)
    .map(toVerticalCard);
};

/**
 * 추천 상품 (세로형 그리드)
 * 조건: 할인율 20% 이상, 할인율 순 정렬
 */
export const getMockRecommendedProducts = (): ProductCardVerticalData[] => {
  return ALL_PRODUCTS.filter((p) => p.discountRate >= 20)
    .sort((a, b) => b.discountRate - a.discountRate)
    .map(toVerticalCard);
};

/**
 * Featured 상품 (큰 카드)
 * 조건: 좋아요 가장 많은 상품
 */
export const getMockFeaturedProduct = (): FeaturedProductData => {
  const featured = ALL_PRODUCTS.sort((a, b) => b.likes - a.likes)[0];

  return {
    id: featured.id,
    imageUri: featured.imageUri,
    title: featured.title,
    price: featured.price,
    pricePerSlot: featured.pricePerSlot,
    likes: featured.likes,
    progress: featured.progress,
    badges: featured.badges,
    description: '최신 플래그십 상품을 합리적인 가격에 만나보세요',
  };
};

/**
 * ID로 상품 상세 정보 조회
 * ALL_PRODUCTS에서 직접 검색하여 자동으로 모든 ID 지원
 */
export const getProductDetailById = (id: string): ProductDetailData | null => {
  const product = ALL_PRODUCTS.find((p) => p.id === id);
  return product ? toDetailData(product) : null;
};

/**
 * 전체 상품 조회 (검색 등에서 사용)
 */
export const getAllProducts = (): BaseProduct[] => {
  return ALL_PRODUCTS;
};
