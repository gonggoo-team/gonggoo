/**
 * Mock Product Data (Single Source of Truth)
 *
 * 백엔드 API 연동을 위한 완전한 상품 데이터 스키마
 * - 모든 상품 데이터를 단일 소스로 관리
 * - 각 화면에서 필요한 형태로 변환하여 사용
 * - 47개의 리치한 테스트 데이터 제공
 */

import type {
  Badge,
  FeaturedProductData,
  MeetingLocation,
  ProductCardHorizontalData,
  ProductCardVerticalData,
  ProductDescription,
  ProductDetailData,
  ProductImage,
  RecruitmentStatus,
  TargetAge,
  TargetGender,
  TransactionDetails,
} from '@/app/shared/types/product.types';
import { SEOUL_LOCATIONS, getLocationByIndex } from '@/app/shared/data/locations';
import { CATEGORY_TEMPLATES, getCategoryTemplate } from '@/app/shared/data/categoryTemplates';

/**
 * 호스트 정보
 */
interface HostData {
  id: string;
  nickname: string;
  profileImageUri: string;
  rating: number;       // 0-10
  reviewCount: number;
}

/**
 * BaseProduct: 모든 필드를 포함하는 완전한 상품 타입
 * 백엔드 API 응답 스키마와 동일
 */
export interface BaseProduct {
  // ===== 기본 정보 =====
  id: string;
  title: string;
  category: string;

  // ===== 이미지 (1~10개, 첫 번째가 대표 이미지) =====
  images: ProductImage[];

  // ===== 가격 정보 =====
  price: number;           // 총 가격
  pricePerSlot: number;    // 슬롯당 가격
  discountRate: number;    // 할인율 (0-100)

  // ===== 공구 정보 =====
  totalSlots: number;          // 전체 슬롯 (고정 5)
  currentParticipants: number; // 현재 참여자 수 (1~5)
  quantityPerSlot: string;     // "쌀 2kg", "이어폰 1개" 등

  // ===== 상품 설명 =====
  description: ProductDescription;

  // ===== 거래 정보 =====
  transaction: TransactionDetails;

  // ===== 공구 기간 =====
  startDate: number;       // Unix timestamp (공구 시작일)
  endDate: number;         // Unix timestamp (공구 종료일)

  // ===== 공구장 정보 =====
  host: HostData;

  // ===== 모집 상태 =====
  recruitmentStatus: RecruitmentStatus;

  // ===== 상호작용 =====
  likes: number;

  // ===== 필터링/정렬용 =====
  createdAt: number;       // Unix timestamp
  targetGender: TargetGender;
  targetAge: TargetAge;

  // ===== 기타 =====
  badges: Badge[];
  reportable: boolean;
}

/**
 * 헬퍼 함수: 배지 생성
 */
const createBadges = (
  recruitmentStatus: RecruitmentStatus,
  daysRemaining: number,
  slotsRemaining: number
): Badge[] => {
  const badges: Badge[] = [];

  if (recruitmentStatus === '마감 임박') {
    badges.push({ type: 'deadline', label: `D-${daysRemaining}` });
  }

  if (slotsRemaining > 0 && slotsRemaining <= 2) {
    badges.push({ type: 'remaining', label: `${slotsRemaining}자리` });
  }

  if (recruitmentStatus === '모집 중' && badges.length === 0) {
    badges.push({ type: 'recruiting', label: '모집중' });
  }

  if (recruitmentStatus === '모집 완료') {
    badges.push({ type: 'closed', label: '마감' });
  }

  return badges;
};

/**
 * 헬퍼 함수: 이미지 배열 생성
 */
const createImages = (productId: number, count: number): ProductImage[] => {
  const images: ProductImage[] = [];
  for (let i = 0; i < count; i++) {
    const imageNum = ((productId - 1 + i) % 47) + 1;
    images.push({
      id: `img-${productId}-${i}`,
      // uri: `https://gonggoo-product.netlify.app/product-${imageNum}.png`,
      uri: `https://gonggoo-product.netlify.app/product-47.png`,
      // uri: `https://picsum.photos/${imageNum}/1/200/300`,
      // uri: `https://picsum.photos/200/300.jpg`,
      order: i,
    });
  }
  return images;
};

/**
 * 헬퍼 함수: 호스트 데이터 생성
 */
const createHost = (productId: number): HostData => {
  const hostNicknames = [
    '믿음직한공구장',
    '착한공구왕',
    '공구달인',
    '공구매니아',
    '공구프로',
    '합리적구매자',
    '공구마스터',
    '절약왕',
  ];

  return {
    id: `host-${productId}`,
    nickname: hostNicknames[productId % hostNicknames.length],
    profileImageUri: `https://i.pravatar.cc/150?img=${productId % 70}`,
    rating: 7.0 + ((productId % 100) / 100) * 3, // 7.0~10.0
    reviewCount: ((productId * 7) % 200) + 10, // 10~210
  };
};

/**
 * 헬퍼 함수: 거래 정보 생성
 */
const createTransaction = (
  productId: number,
  category: string
): TransactionDetails => {
  const location = getLocationByIndex(productId);
  const deliveryAvailable = productId % 3 !== 0; // 66% 택배 가능

  // 택배비: 0원(무료), 2500원, 3000원, 3500원, 5000원
  let deliveryFee: number | undefined = undefined;
  if (deliveryAvailable) {
    const fees = [undefined, 2500, 3000, 3500, 5000];
    deliveryFee = fees[productId % fees.length];
  }

  // 거래 시간
  const meetingTimes = [
    '평일 저녁 18:00~21:00',
    '주말 오전 10:00~12:00',
    '주말 오후 14:00~18:00',
    '평일 점심 12:00~13:00',
    '협의 가능',
  ];

  return {
    meetingLocation: {
      address: location.address,
      placeName: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    },
    meetingTime: meetingTimes[productId % meetingTimes.length],
    deliveryAvailable,
    deliveryFee,
  };
};

/**
 * 헬퍼 함수: 상품 설명 생성
 */
const createDescription = (
  productId: number,
  category: string
): ProductDescription => {
  const template = getCategoryTemplate(category);

  // 배열에서 ID 기반으로 일관성 있게 선택
  const features = template.featureExamples[productId % template.featureExamples.length];
  const groupBuyReason = template.reasonExamples[productId % template.reasonExamples.length];
  const notes = template.notesExamples[productId % template.notesExamples.length];

  return {
    features,
    groupBuyReason,
    notes,
  };
};

/**
 * 헬퍼 함수: 공구 기간 생성
 */
const createGroupBuyPeriod = (productId: number): { startDate: number; endDate: number } => {
  const now = Date.now();

  // 다양한 마감일 분포를 위한 로직
  // ID에 따라 -2일 ~ +20일 사이의 종료일 생성
  const daysUntilEnd = ((productId * 3) % 23) - 2; // -2 ~ 20일
  const daysAgo = Math.max(1, (productId % 7) + 1); // 1~7일 전 시작

  const startDate = now - (daysAgo * 24 * 60 * 60 * 1000);
  const endDate = now + (daysUntilEnd * 24 * 60 * 60 * 1000);

  return { startDate, endDate };
};

/**
 * 헬퍼 함수: 모집 상태 결정
 */
const getRecruitmentStatus = (
  endDate: number,
  currentParticipants: number,
  totalSlots: number
): RecruitmentStatus => {
  const now = Date.now();
  const daysRemaining = Math.ceil((endDate - now) / (24 * 60 * 60 * 1000));

  // 슬롯이 다 찼으면 모집 완료
  if (currentParticipants >= totalSlots) {
    return '모집 완료';
  }

  // 마감일이 지났으면 거래 완료
  if (daysRemaining < 0) {
    return '거래 완료';
  }

  // 3일 이하 남았으면 마감 임박
  if (daysRemaining <= 3) {
    return '마감 임박';
  }

  return '모집 중';
};

/**
 * 상품 데이터 생성 함수
 */
interface ProductConfig {
  id: number;
  title: string;
  category: string;
  price: number;
  pricePerSlot: number;
  discountRate: number;
  imageCount: number;
  currentParticipants: number;
  likes: number;
  targetGender: TargetGender;
  targetAge: TargetAge;
  quantityPerSlot?: string; // 지정하지 않으면 자동 생성
}

const createProduct = (config: ProductConfig): BaseProduct => {
  const {
    id,
    title,
    category,
    price,
    pricePerSlot,
    discountRate,
    imageCount,
    currentParticipants,
    likes,
    targetGender,
    targetAge,
  } = config;

  const totalSlots = 5;
  const images = createImages(id, imageCount);
  const host = createHost(id);
  const transaction = createTransaction(id, category);
  const description = createDescription(id, category);
  const { startDate, endDate } = createGroupBuyPeriod(id);
  const recruitmentStatus = getRecruitmentStatus(endDate, currentParticipants, totalSlots);

  // 남은 일수 계산
  const now = Date.now();
  const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (24 * 60 * 60 * 1000)));
  const slotsRemaining = totalSlots - currentParticipants;

  // 배지 생성
  const badges = createBadges(recruitmentStatus, daysRemaining, slotsRemaining);

  // 슬롯당 수량 (지정되지 않으면 템플릿에서 가져오기)
  const template = getCategoryTemplate(category);
  const quantityPerSlot = config.quantityPerSlot ||
    template.quantityExamples[id % template.quantityExamples.length];

  return {
    id: id.toString(),
    title,
    category,
    images,
    price,
    pricePerSlot,
    discountRate,
    totalSlots,
    currentParticipants,
    quantityPerSlot,
    description,
    transaction,
    startDate,
    endDate,
    host,
    recruitmentStatus,
    likes,
    createdAt: startDate,
    targetGender,
    targetAge,
    badges,
    reportable: true,
  };
};

  /**
   * 47개 상품 기본 정보
   */
  const PRODUCT_CONFIGS: ProductConfig[] = [
    // ID 1-10: 가전 제품
    { id: 1, title: '삼성 갤럭시 버즈2 프로', category: '가전', price: 189000, pricePerSlot:        
  37800, discountRate: 15, imageCount: 3, currentParticipants: 4, likes: 42, targetGender: '성별 전체', targetAge: '연령대 전체', quantityPerSlot: '이어폰 1개' },
    { id: 2, title: '에어팟 프로 2세대', category: '가전', price: 359000, pricePerSlot: 71800,      
  discountRate: 20, imageCount: 4, currentParticipants: 5, likes: 87, targetGender: '남성',
  targetAge: '20대', quantityPerSlot: '이어폰 1개' },
    { id: 3, title: 'LG 그램 노트북 15인치', category: '가전', price: 1590000, pricePerSlot:        
  318000, discountRate: 10, imageCount: 5, currentParticipants: 5, likes: 156, targetGender:        
  '성별 전체', targetAge: '30대' },
    { id: 4, title: '로지텍 무선 마우스 MX Master 3', category: '가전', price: 145000,
  pricePerSlot: 29000, discountRate: 25, imageCount: 3, currentParticipants: 3, likes: 68,
  targetGender: '남성', targetAge: '20대', quantityPerSlot: '마우스 1개' },
    { id: 5, title: 'JBL 블루투스 스피커', category: '가전', price: 120000, pricePerSlot: 24000,    
   discountRate: 30, imageCount: 4, currentParticipants: 4, likes: 95, targetGender: '성별 전체', targetAge: '30대', quantityPerSlot: '스피커 1대' },
    { id: 6, title: '삼성 무선충전기 듀오', category: '가전', price: 79000, pricePerSlot: 15800,    
   discountRate: 20, imageCount: 2, currentParticipants: 2, likes: 54, targetGender: '성별 전체', targetAge: '연령대 전체', quantityPerSlot: '충전기 1개' },
    { id: 7, title: '소니 노이즈캔슬링 헤드폰', category: '가전', price: 450000, pricePerSlot:      
  90000, discountRate: 25, imageCount: 4, currentParticipants: 3, likes: 122, targetGender:
  '남성', targetAge: '30대', quantityPerSlot: '헤드폰 1개' },
    { id: 8, title: '애플 매직 키보드', category: '가전', price: 189000, pricePerSlot: 37800,       
  discountRate: 15, imageCount: 3, currentParticipants: 4, likes: 78, targetGender: '성별 전체',    
   targetAge: '20대', quantityPerSlot: '키보드 1개' },
    { id: 9, title: '샤오미 공기청정기 프로', category: '가전', price: 250000, pricePerSlot:        
  50000, discountRate: 32, imageCount: 3, currentParticipants: 3, likes: 130, targetGender:
  '성별 전체', targetAge: '연령대 전체' },
    { id: 10, title: '다이슨 청소기 V15', category: '가전', price: 890000, pricePerSlot: 178000,    
   discountRate: 20, imageCount: 5, currentParticipants: 4, likes: 124, targetGender: '성별 전체', targetAge: '30대' },

    // ID 11-20: 가전 제품 (계속)
    { id: 11, title: '아이패드 프로 11인치', category: '가전', price: 1290000, pricePerSlot:        
  258000, discountRate: 15, imageCount: 4, currentParticipants: 5, likes: 156, targetGender:        
  '성별 전체', targetAge: '20대' },
    { id: 12, title: '맥북 에어 M2', category: '가전', price: 1690000, pricePerSlot: 338000,        
  discountRate: 12, imageCount: 5, currentParticipants: 3, likes: 89, targetGender: '남성',
  targetAge: '30대' },
    { id: 13, title: '삼성 갤럭시 S24 울트라', category: '가전', price: 1590000, pricePerSlot:      
  318000, discountRate: 18, imageCount: 4, currentParticipants: 4, likes: 234, targetGender:        
  '성별 전체', targetAge: '연령대 전체' },
    { id: 14, title: '게이밍 키보드 기계식', category: '가전', price: 180000, pricePerSlot:
  36000, discountRate: 32, imageCount: 3, currentParticipants: 4, likes: 98, targetGender:
  '남성', targetAge: '10대', quantityPerSlot: '키보드 1개' },
    { id: 15, title: '무선 이어폰 삼성 버즈', category: '가전', price: 120000, pricePerSlot:        
  24000, discountRate: 28, imageCount: 3, currentParticipants: 5, likes: 102, targetGender:
  '남성', targetAge: '10대', quantityPerSlot: '이어폰 1개' },
    { id: 16, title: '보조배터리 20000mAh', category: '가전', price: 45000, pricePerSlot: 9000,     
  discountRate: 30, imageCount: 2, currentParticipants: 4, likes: 88, targetGender: '성별 전체',    
   targetAge: '20대', quantityPerSlot: '보조배터리 1개' },
    { id: 17, title: '전기밥솥 6인용', category: '가전', price: 150000, pricePerSlot: 30000,        
  discountRate: 25, imageCount: 3, currentParticipants: 3, likes: 75, targetGender: '성별 전체',
   targetAge: '30대' },
    { id: 18, title: '전자레인지 LG 23L', category: '가전', price: 185000, pricePerSlot: 37000,     
  discountRate: 22, imageCount: 3, currentParticipants: 3, likes: 92, targetGender: '성별 전체',    
   targetAge: '연령대 전체' },
    { id: 19, title: 'USB 충전기 멀티포트', category: '가전', price: 35000, pricePerSlot: 7000,     
  discountRate: 22, imageCount: 2, currentParticipants: 2, likes: 68, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '충전기 1세트' },
    { id: 20, title: '스마트워치 프로', category: '가전', price: 550000, pricePerSlot: 110000,      
  discountRate: 24, imageCount: 4, currentParticipants: 2, likes: 63, targetGender: '남성',
  targetAge: '10대' },

    // ID 21-25: 식품
    { id: 21, title: '유기농 쌀 10kg', category: '식품', price: 54000, pricePerSlot: 10800,
  discountRate: 25, imageCount: 2, currentParticipants: 3, likes: 34, targetGender: '성별 전체',    
   targetAge: '40대', quantityPerSlot: '쌀 2kg' },
    { id: 22, title: '오가닉 커피 원두 1kg', category: '식품', price: 40000, pricePerSlot: 8000,    
   discountRate: 36, imageCount: 3, currentParticipants: 2, likes: 56, targetGender: '성별 전체', targetAge: '30대', quantityPerSlot: '커피 원두 500g' },
    { id: 23, title: '견과류 믹스 3kg', category: '식품', price: 63000, pricePerSlot: 12600,        
  discountRate: 32, imageCount: 2, currentParticipants: 3, likes: 78, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '견과류 500g' },
    { id: 24, title: '국내산 사과 5kg', category: '식품', price: 45000, pricePerSlot: 9000,
  discountRate: 28, imageCount: 2, currentParticipants: 4, likes: 92, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '사과 10개' },
    { id: 25, title: '냉동 만두 10봉', category: '식품', price: 85000, pricePerSlot: 17000,
  discountRate: 25, imageCount: 2, currentParticipants: 3, likes: 68, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '만두 2봉' },

    // ID 26-30: 생활용품
    { id: 26, title: '친환경 세제 세트', category: '생활', price: 35000, pricePerSlot: 7000,        
  discountRate: 30, imageCount: 2, currentParticipants: 2, likes: 21, targetGender: '여성',
  targetAge: '20대', quantityPerSlot: '세제 1병' },
    { id: 27, title: '코스트코 크리넥스 티슈 250매 x 8팩', category: '생활', price: 19500,
  pricePerSlot: 3900, discountRate: 45, imageCount: 2, currentParticipants: 2, likes: 78,
  targetGender: '성별 전체', targetAge: '연령대 전체', quantityPerSlot: '티슈 2팩' },
    { id: 28, title: '물티슈 100매 x 20개', category: '생활', price: 48000, pricePerSlot: 9600,     
  discountRate: 26, imageCount: 2, currentParticipants: 3, likes: 75, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '물티슈 4팩' },
    { id: 29, title: '화장지 30롤 x 3팩', category: '생활', price: 52500, pricePerSlot: 10500,      
  discountRate: 30, imageCount: 2, currentParticipants: 4, likes: 88, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '화장지 10롤' },
    { id: 30, title: '샴푸 900ml x 3개', category: '생활', price: 43750, pricePerSlot: 8750,        
  discountRate: 25, imageCount: 2, currentParticipants: 3, likes: 62, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '샴푸 1병' },

    // ID 31-33: 육아용품
    { id: 31, title: '아기 기저귀 100매', category: '육아', price: 43750, pricePerSlot: 8750,       
  discountRate: 18, imageCount: 2, currentParticipants: 4, likes: 65, targetGender: '성별 전체',    
   targetAge: '30대', quantityPerSlot: '기저귀 20매' },
    { id: 32, title: '분유 800g x 3캔', category: '육아', price: 106250, pricePerSlot: 21250,       
  discountRate: 28, imageCount: 2, currentParticipants: 4, likes: 92, targetGender: '성별 전체',    
   targetAge: '30대', quantityPerSlot: '분유 800g' },
    { id: 33, title: '아기 물티슈 80매 x 20개', category: '육아', price: 52500, pricePerSlot:       
  10500, discountRate: 25, imageCount: 2, currentParticipants: 3, likes: 78, targetGender: '성별 전체',
  targetAge: '30대', quantityPerSlot: '물티슈 4팩' },

    // ID 34-36: 애완용품
    { id: 34, title: '강아지 사료 5kg', category: '애완용품', price: 52500, pricePerSlot: 10500,    
   discountRate: 22, imageCount: 2, currentParticipants: 3, likes: 48, targetGender: '여성',        
  targetAge: '40대', quantityPerSlot: '사료 1kg' },
    { id: 35, title: '고양이 모래 10L', category: '애완용품', price: 35000, pricePerSlot: 7000,     
  discountRate: 22, imageCount: 2, currentParticipants: 2, likes: 39, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '모래 2L' },
    { id: 36, title: '강아지 간식 닭가슴살 1kg', category: '애완용품', price: 40000,
  pricePerSlot: 8000, discountRate: 26, imageCount: 2, currentParticipants: 3, likes: 68,
  targetGender: '성별 전체', targetAge: '연령대 전체', quantityPerSlot: '간식 200g' },

    // ID 37-39: 주방용품
    { id: 37, title: '프라이팬 세트', category: '주방', price: 111250, pricePerSlot: 22250,
  discountRate: 35, imageCount: 3, currentParticipants: 4, likes: 92, targetGender: '남성',
  targetAge: '30대', quantityPerSlot: '프라이팬 1개' },
    { id: 38, title: '스테인리스 식기 세트', category: '주방', price: 85000, pricePerSlot:
  17000, discountRate: 28, imageCount: 3, currentParticipants: 3, likes: 43, targetGender:
  '여성', targetAge: '40대', quantityPerSlot: '식기 세트' },
    { id: 39, title: '냄비 세트 5종', category: '주방', price: 118750, pricePerSlot: 23750,
  discountRate: 28, imageCount: 3, currentParticipants: 4, likes: 78, targetGender: '여성',
  targetAge: '30대', quantityPerSlot: '냄비 1개' },

    // ID 40-42: 리빙용품
    { id: 40, title: '인테리어 조명', category: '리빙', price: 156250, pricePerSlot: 31250,
  discountRate: 12, imageCount: 3, currentParticipants: 2, likes: 27, targetGender: '성별 전체',    
   targetAge: '50대 이상', quantityPerSlot: '조명 1개' },
    { id: 41, title: '러그 150x200cm', category: '리빙', price: 106250, pricePerSlot: 21250,        
  discountRate: 28, imageCount: 3, currentParticipants: 4, likes: 82, targetGender: '성별 전체',    
   targetAge: '30대', quantityPerSlot: '러그 1개' },
    { id: 42, title: '쿠션 5개 세트', category: '리빙', price: 52500, pricePerSlot: 10500,
  discountRate: 24, imageCount: 2, currentParticipants: 3, likes: 58, targetGender: '여성',
  targetAge: '20대', quantityPerSlot: '쿠션 1개' },

    // ID 43-45: 패션
    { id: 43, title: '남성용 양말 10세트', category: '패션', price: 45375, pricePerSlot: 9075,      
  discountRate: 33, imageCount: 2, currentParticipants: 3, likes: 45, targetGender: '남성',
  targetAge: '연령대 전체', quantityPerSlot: '양말 2켤레' },
    { id: 44, title: '티셔츠 무지 10장', category: '패션', price: 68750, pricePerSlot: 13750,       
  discountRate: 30, imageCount: 3, currentParticipants: 4, likes: 88, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '티셔츠 2장' },
    { id: 45, title: '양말 10켤레 세트', category: '패션', price: 35000, pricePerSlot: 7000,        
  discountRate: 26, imageCount: 2, currentParticipants: 4, likes: 72, targetGender: '성별 전체',    
   targetAge: '연령대 전체', quantityPerSlot: '양말 2켤레' },

    // ID 46-47: 기타
    { id: 46, title: '핸드폰 케이스 10종', category: '기타', price: 22500, pricePerSlot: 4500,      
  discountRate: 40, imageCount: 2, currentParticipants: 5, likes: 103, targetGender: '남성',        
  targetAge: '10대', quantityPerSlot: '케이스 2개' },
    { id: 47, title: '고급 텀블러 10개 세트', category: '기타', price: 118750, pricePerSlot:        
  23750, discountRate: 42, imageCount: 3, currentParticipants: 5, likes: 158, targetGender:
  '성별 전체', targetAge: '연령대 전체', quantityPerSlot: '텀블러 2개' },
  ];

  /**
   * 모든 상품 데이터 생성
   */
  const ALL_PRODUCTS: BaseProduct[] = PRODUCT_CONFIGS.map(createProduct);

  /**
   * 헬퍼 함수: ProductDescription을 전체 문자열로 변환
   * toDetailData, toFormData 내부에서 사용
   */
  const getFullDescription = (description: ProductDescription): string => {
    return `${description.features}\n\n${description.groupBuyReason}\n\n${description.notes}`;
  };

  /**
   * 타입 변환 유틸리티: BaseProduct → ProductCardVerticalData
   */
  const toVerticalCard = (product: BaseProduct): ProductCardVerticalData => ({
    id: product.id,
    imageUri: product.images[0].uri, // 대표 이미지
    title: product.title,
    price: product.price,
    pricePerSlot: product.pricePerSlot,
    priceLabelValue: 1,
    badges: product.badges,
    isClosed: product.recruitmentStatus === '모집 완료' || product.recruitmentStatus === '거래 완료',
    likes: product.likes,
    progress: (product.currentParticipants / product.totalSlots) * 100,
    showProgress: true,
    category: product.category,
    createdAt: product.createdAt,
    discountRate: product.discountRate,
    isReservationAvailable: product.transaction.deliveryAvailable,
    slotCount: product.totalSlots,
    recruitmentStatus: product.recruitmentStatus,
    targetGender: product.targetGender,
    targetAge: product.targetAge,
  });

  /**
   * 타입 변환 유틸리티: BaseProduct → ProductCardHorizontalData
   */
  const toHorizontalCard = (product: BaseProduct): ProductCardHorizontalData => ({
    id: product.id,
    imageUri: product.images[0].uri,
    title: product.title,
    price: product.price,
    pricePerSlot: product.pricePerSlot,
    buyersCount: product.currentParticipants,
    progress: (product.currentParticipants / product.totalSlots) * 100,
    badges: product.badges,
    category: product.category,
    createdAt: product.createdAt,
    likes: product.likes,
    discountRate: product.discountRate,
    isReservationAvailable: product.transaction.deliveryAvailable,
    slotCount: product.totalSlots,
    recruitmentStatus: product.recruitmentStatus,
  });

  /**
   * 타입 변환 유틸리티: BaseProduct → ProductDetailData
   */
  const toDetailData = (product: BaseProduct): ProductDetailData => {
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((product.endDate - now) / (24 * 60 * 60 *
  1000)));

    // 참여자 닉네임 생성
    const participantNicknames = [
      '행복한구매자',
      '알뜰살뜰',
      '공구러버',
      '절약왕',
      '똑똑이',
      '공구매니저',
      '실속파',
      '합리적소비',
      '공구참여자',
      '현명한선택',
    ];

    const participants = Array.from({ length: product.currentParticipants }, (_, i) => ({
      id: `participant-${product.id}-${i}`,
      profileImageUri: `https://i.pravatar.cc/150?img=${(parseInt(product.id) * 10 + i) % 70}`,     
      nickname: participantNicknames[(parseInt(product.id) + i) % participantNicknames.length],     
    }));

    return {
      id: product.id,
      category: product.category,
      title: product.title,
      imageUris: product.images.map((img) => img.uri),
      price: product.price,
      pricePerSlot: product.pricePerSlot,
      likes: product.likes,
      badges: product.badges,
      recruitmentStatus: product.recruitmentStatus,
      daysRemaining,
      progress: {
        participantCount: product.currentParticipants,
        totalSlots: product.totalSlots,
        percentage: (product.currentParticipants / product.totalSlots) * 100,
      },
      groupBuyInfo: {
        totalSlots: product.totalSlots,
        quantityPerSlot: product.quantityPerSlot,
        description: getFullDescription(product.description),
      },
      host: {
        id: product.host.id,
        nickname: product.host.nickname,
        profileImageUri: product.host.profileImageUri,
        rating: product.host.rating,
        reviewCount: product.host.reviewCount,
      },
      participants,
      transaction: {
        location: product.transaction.meetingLocation.address,
        timeDescription: product.transaction.meetingTime,
        deliveryAvailable: product.transaction.deliveryAvailable,
      },
      reportable: product.reportable,
    };
  };

  /**
   * 모든 상품 데이터에서 가격 범위 계산 (pricePerSlot 기준)
   */
  export const getProductPriceRange = (): { min: number; max: number } => {
    const prices = ALL_PRODUCTS.map((p) => p.pricePerSlot);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  /**
   * 마감 임박 상품 (세로형 카드)
   */
  export const getMockDeadlineProducts = (): ProductCardVerticalData[] => {
    return ALL_PRODUCTS.filter((p) => p.recruitmentStatus === '마감 임박').map(toVerticalCard);     
  };

  /**
   * 인기 상품 (가로형 카드)
   */
  export const getMockPopularProducts = (): ProductCardHorizontalData[] => {
    return ALL_PRODUCTS.filter((p) => p.likes >= 50)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 8)
      .map(toHorizontalCard);
  };

  /**
   * 인기 상품 (세로형 카드 - 인기 탭용)
   */
  export const getMockPopularProductsVertical = (): ProductCardVerticalData[] => {
    return ALL_PRODUCTS.filter((p) => p.likes >= 50)
      .sort((a, b) => b.likes - a.likes)
      .map(toVerticalCard);
  };

  /**
   * 추천 상품 (세로형 그리드)
   */
  export const getMockRecommendedProducts = (): ProductCardVerticalData[] => {
    return ALL_PRODUCTS.filter((p) => p.discountRate >= 20)
      .sort((a, b) => b.discountRate - a.discountRate)
      .map(toVerticalCard);
  };

  /**
   * Featured 상품 (큰 카드)
   */
  export const getMockFeaturedProduct = (): FeaturedProductData => {
    const featured = ALL_PRODUCTS.sort((a, b) => b.likes - a.likes)[0];

    return {
      id: featured.id,
      imageUri: featured.images[0].uri,
      title: featured.title,
      price: featured.price,
      pricePerSlot: featured.pricePerSlot,
      likes: featured.likes,
      progress: (featured.currentParticipants / featured.totalSlots) * 100,
      badges: featured.badges,
      description: featured.description.features,
    };
  };

  /**
   * ID로 상품 상세 정보 조회
   */
  export const getProductDetailById = (id: string): ProductDetailData | null => {
    const product = ALL_PRODUCTS.find((p) => p.id === id);
    return product ? toDetailData(product) : null;
  };

  /**
   * ID로 BaseProduct 조회
   * @param id - 상품 ID
   * @returns BaseProduct 또는 null
   */
  export const getBaseProductById = (id: string): BaseProduct | null => {
    return ALL_PRODUCTS.find((p) => p.id === id) || null;
  };

  /**
   * 타입 변환 유틸리티: BaseProduct → ProductRegistrationFormData
   * 상품 수정 화면에서 기존 상품 데이터를 폼 데이터로 변환
   * @param product - BaseProduct 객체
   * @returns ProductRegistrationFormData
   */
  export const toFormData = (product: BaseProduct): import('@/app/features/product-registration/types').ProductRegistrationFormData => {
    return {
      images: product.images.map((img) => img.uri),
      title: product.title,
      isFree: product.pricePerSlot === 0,
      price: product.price.toString(),
      period: {
        startDate: new Date(product.startDate),
        endDate: new Date(product.endDate),
      },
      slots: product.totalSlots,
      description: getFullDescription(product.description),
      location: {
        address: product.transaction.meetingLocation.address,
        latitude: product.transaction.meetingLocation.latitude,
        longitude: product.transaction.meetingLocation.longitude,
        time: product.transaction.meetingTime,
      },
      isDeliveryAvailable: product.transaction.deliveryAvailable,
    };
  };

  /**
   * 전체 상품 조회 (검색 등에서 사용)
   * BaseProduct → ProductCardVerticalData 변환
   */
  export const getAllProducts = (): ProductCardVerticalData[] => {
    return ALL_PRODUCTS.map(toVerticalCard);
  };