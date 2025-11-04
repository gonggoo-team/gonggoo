/**
 * ProductCard Storybook
 *
 * 상품 카드 컴포넌트 (4가지 variant)
 *
 * 테스트 시나리오:
 * - ProductCardVertical (2칼럼 그리드용)
 *   - 기본 / 긴 제목 / 많은 배지
 *   - 가격 취소선 / 커스텀 라벨 / 진행률 없음 / 가격 없음 / 최소 구성
 * - ProductCardCompact (수평 스크롤용)
 * - ProductCardLarge (특가 상품용)
 * - ProductCardHorizontal (리스트용)
 * - 각 케이스: 기본 / 긴 제목 / 많은 배지 / isClosed
 *
 * 마지막 업데이트: 2025-10-09
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  ProductCardVertical,
  ProductCardCompact,
  ProductCardLarge,
  ProductCardHorizontal,
} from '../../design-system/components/ProductCard';
import { ThemeProvider } from '../../design-system/theme';

// ===== ProductCardVertical Stories =====

const metaVertical: Meta<typeof ProductCardVertical> = {
  title: 'Design System/Components/ProductCard/Vertical',
  component: ProductCardVertical,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.container}>
          <View style={styles.cardWrapper}>
            <Story />
          </View>
        </View>
      </ThemeProvider>
    ),
  ],
};

export default metaVertical;

type StoryVertical = StoryObj<typeof ProductCardVertical>;

export const VerticalDefault: StoryVertical = {
  args: {
    id: '1',
    imageUri: 'https://picsum.photos/300/300',
    title: '남성용 패션 정장 중목 무지 양말 21족 세트',
    price: 36300,
    pricePerSlot: 12100,
    likes: 3,
    progress: 66,
    badges: [
      { type: 'deadline', label: '오늘 마감' },
      { type: 'recruiting', label: '3명 모집' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalLongTitle: StoryVertical = {
  args: {
    id: '2',
    imageUri: 'https://picsum.photos/300/300',
    title: '아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다',
    price: 50000,
    pricePerSlot: 10000,
    likes: 15,
    progress: 80,
    badges: [
      { type: 'remaining', label: '2일 남음' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalManyBadges: StoryVertical = {
  args: {
    id: '3',
    imageUri: 'https://picsum.photos/300/300',
    title: '다양한 배지가 있는 상품',
    price: 75000,
    pricePerSlot: 15000,
    likes: 25,
    progress: 50,
    badges: [
      { type: 'deadline', label: '오늘 마감' },
      { type: 'recruiting', label: '5명 모집' },
      { type: 'remaining', label: '1일 남음' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalWithStrikethrough: StoryVertical = {
  args: {
    id: '4',
    imageUri: 'https://picsum.photos/300/300',
    title: '할인 상품 (가격 취소선)',
    price: 50000,
    priceStrikethrough: true,
    pricePerSlot: 12100,
    priceLabel: '1슬롯',
    likes: 18,
    progress: 75,
    badges: [
      { type: 'deadline', label: 'D-2' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalWithCustomLabel: StoryVertical = {
  args: {
    id: '5',
    imageUri: 'https://picsum.photos/300/300',
    title: '커스텀 라벨 상품 (1인, 빨간색)',
    price: 36300,
    pricePerSlot: 12100,
    priceLabel: '1인',
    priceLabelColor: '#FF0000',
    likes: 12,
    progress: 60,
    badges: [
      { type: 'recruiting', label: '모집중' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalNoProgress: StoryVertical = {
  args: {
    id: '6',
    imageUri: 'https://picsum.photos/300/300',
    title: '진행률 게이지 없는 상품',
    price: 89000,
    pricePerSlot: 8900,
    priceLabel: '1팩',
    likes: 7,
    progress: 50,
    showProgress: false,
    badges: [
      { type: 'remaining', label: '5일 남음' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalNoPrice: StoryVertical = {
  args: {
    id: '7',
    imageUri: 'https://picsum.photos/300/300',
    title: '총 가격 없는 상품 (슬롯당 가격만 표시)',
    pricePerSlot: 15900,
    priceLabel: '1슬롯',
    likes: 24,
    progress: 80,
    badges: [
      { type: 'recruiting', label: '모집중' },
    ],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalMinimal: StoryVertical = {
  args: {
    id: '8',
    imageUri: 'https://picsum.photos/300/300',
    title: '최소 구성 상품 (가격, 진행률 없음)',
    likes: 5,
    showProgress: false,
    badges: [],
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalThreeLines: StoryVertical = {
  args: {
    id: '9',
    imageUri: 'https://picsum.photos/300/300',
    title: '제목 3줄 테스트: 아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다',
    price: 36300,
    pricePerSlot: 12100,
    likes: 3,
    progress: 66,
    badges: [{ type: 'deadline', label: '오늘 마감' }],
    titleLines: 3,
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalNoBadges: StoryVertical = {
  args: {
    id: '10',
    imageUri: 'https://picsum.photos/300/300',
    title: '배지 숨김 테스트',
    price: 36300,
    pricePerSlot: 12100,
    likes: 3,
    progress: 66,
    badges: [{ type: 'deadline', label: '오늘 마감' }],
    showBadges: false,
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalNoLikes: StoryVertical = {
  args: {
    id: '11',
    imageUri: 'https://picsum.photos/300/300',
    title: '좋아요 숨김 테스트',
    price: 36300,
    pricePerSlot: 12100,
    likes: 3,
    progress: 66,
    badges: [{ type: 'deadline', label: '오늘 마감' }],
    showLikes: false,
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

export const VerticalNoPrices: StoryVertical = {
  args: {
    id: '12',
    imageUri: 'https://picsum.photos/300/300',
    title: '모든 가격 정보 숨김 테스트',
    price: 36300,
    pricePerSlot: 12100,
    likes: 3,
    progress: 66,
    badges: [{ type: 'deadline', label: '오늘 마감' }],
    showPrice: false,
    showPricePerSlot: false,
    onPress: () => console.log('Card pressed'),
    onLikePress: () => console.log('Like pressed'),
  },
};

// ===== ProductCardCompact Stories =====

export const CompactDefault: StoryObj<typeof ProductCardCompact> = {
  render: () => (
    <ThemeProvider>
      <ScrollView horizontal style={styles.scrollContainer}>
        <ProductCardCompact
          id="1"
          imageUri="https://picsum.photos/300/300"
          title="남성용 패션 정장 중목 무지 양말 100세트"
          price={75000}
          pricePerSlot={15000}
          badges={[
            { type: 'remaining', label: '3일 남음' },
            { type: 'recruiting', label: '5슬롯 모집 중' },
          ]}
          isClosed={false}
          onPress={() => console.log('Card pressed')}
        />
      </ScrollView>
    </ThemeProvider>
  ),
};

export const CompactClosed: StoryObj<typeof ProductCardCompact> = {
  render: () => (
    <ThemeProvider>
      <ScrollView horizontal style={styles.scrollContainer}>
        <ProductCardCompact
          id="2"
          imageUri="https://picsum.photos/300/300"
          title="모집이 완료된 상품입니다"
          price={50000}
          pricePerSlot={10000}
          badges={[
            { type: 'closed', label: '모집 마감' },
          ]}
          isClosed={true}
          onPress={() => console.log('Card pressed')}
        />
      </ScrollView>
    </ThemeProvider>
  ),
};

export const CompactLongTitle: StoryObj<typeof ProductCardCompact> = {
  render: () => (
    <ThemeProvider>
      <ScrollView horizontal style={styles.scrollContainer}>
        <ProductCardCompact
          id="3"
          imageUri="https://picsum.photos/300/300"
          title="아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다 아주 긴 제목입니다"
          price={100000}
          pricePerSlot={20000}
          badges={[
            { type: 'deadline', label: '오늘 마감' },
          ]}
          isClosed={false}
          onPress={() => console.log('Card pressed')}
        />
      </ScrollView>
    </ThemeProvider>
  ),
};

// ===== ProductCardLarge Stories =====

export const LargeDefault: StoryObj<typeof ProductCardLarge> = {
  render: () => (
    <ThemeProvider>
      <View style={styles.container}>
        <ProductCardLarge
          id="1"
          imageUri="https://picsum.photos/600/300"
          title="초특가! 프리미엄 제품 공동구매"
          subtitle="1+1 이벤트 진행중"
          price={120000}
          pricePerSlot={60000}
          likes={45}
          slotsRemaining={2}
          participantsCount={8}
          badges={[
            { type: 'deadline', label: '오늘 마감' },
            { type: 'recruiting', label: '2자리 남음' },
          ]}
          onPress={() => console.log('Card pressed')}
          onLikePress={() => console.log('Like pressed')}
        />
      </View>
    </ThemeProvider>
  ),
};

// ===== ProductCardHorizontal Stories =====

export const HorizontalDefault: StoryObj<typeof ProductCardHorizontal> = {
  render: () => (
    <ThemeProvider>
      <View style={styles.container}>
        <ProductCardHorizontal
          id="1"
          imageUri="https://picsum.photos/300/300"
          title="남성용 패션 정장 중목 무지 양말 100세트"
          price={36300}
          pricePerSlot={12100}
          buyersCount={45}
          progress={66}
          badges={[
            { type: 'remaining', label: '3일 남음' },
            { type: 'recruiting', label: '65슬롯 모집' },
          ]}
          onPress={() => console.log('Card pressed')}
        />
      </View>
    </ThemeProvider>
  ),
};

// ===== All Variants Together =====

export const AllVariants: StoryObj<any> = {
  render: () => (
    <ThemeProvider>
      <ScrollView style={styles.scrollColumn}>
        <View style={styles.section}>
          <View style={styles.grid}>
            <ProductCardVertical
              id="v1"
              imageUri="https://picsum.photos/300/300"
              title="Vertical 카드"
              price={36300}
              pricePerSlot={12100}
              likes={3}
              progress={66}
              badges={[{ type: 'deadline', label: '오늘 마감' }]}
              onPress={() => {}}
              onLikePress={() => {}}
            />
            <ProductCardVertical
              id="v2"
              imageUri="https://picsum.photos/301/301"
              title="Vertical 카드 2"
              price={50000}
              pricePerSlot={10000}
              likes={15}
              progress={80}
              badges={[{ type: 'recruiting', label: '5명 모집' }]}
              onPress={() => {}}
              onLikePress={() => {}}
            />
          </View>
        </View>

        <ScrollView horizontal style={styles.horizontalScroll}>
          <ProductCardCompact
            id="c1"
            imageUri="https://picsum.photos/302/302"
            title="Compact 카드"
            price={75000}
            pricePerSlot={15000}
            badges={[{ type: 'remaining', label: '3일 남음' }]}
            onPress={() => {}}
          />
          <ProductCardCompact
            id="c2"
            imageUri="https://picsum.photos/303/303"
            title="Compact 카드 2"
            price={50000}
            pricePerSlot={10000}
            badges={[{ type: 'recruiting', label: '2명 모집' }]}
            onPress={() => {}}
          />
        </ScrollView>

        <ProductCardLarge
          id="l1"
          imageUri="https://picsum.photos/600/300"
          title="Large 특가 카드"
          subtitle="특별 할인"
          price={120000}
          pricePerSlot={60000}
          likes={45}
          slotsRemaining={2}
          participantsCount={8}
          badges={[{ type: 'deadline', label: '오늘 마감' }]}
          onPress={() => {}}
          onLikePress={() => {}}
        />

        <ProductCardHorizontal
          id="h1"
          imageUri="https://picsum.photos/304/304"
          title="Horizontal 리스트 카드"
          price={50000}
          pricePerSlot={10000}
          buyersCount={45}
          progress={75}
          badges={[{ type: 'recruiting', label: '3명 모집' }]}
          onPress={() => {}}
        />
      </ScrollView>
    </ThemeProvider>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  cardWrapper: {
    width: 180,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  scrollColumn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
