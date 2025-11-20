# 공구팟 (Gonggoo-App)

> 공동구매 플랫폼 모바일 애플리케이션

## 📖 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [개발 가이드](#개발-가이드)
- [문서](#문서)
- [성능 최적화](#성능-최적화)
- [기여하기](#기여하기)

---

## 프로젝트 개요

공구팟은 사용자들이 공동구매에 참여하고 관리할 수 있는 모바일 플랫폼입니다. Expo Router 기반의 React Native로 개발되었으며, Feature-based 아키텍처를 채택하여 확장성과 유지보수성을 최적화했습니다.

### 핵심 특징

- ✅ **Feature-based 아키텍처**: 기능별로 독립적인 모듈 구조
- ✅ **디자인 시스템**: Figma 기반 토큰 시스템으로 일관된 UI/UX 제공
- ✅ **Type-Safe**: TypeScript 5.9로 타입 안정성 보장
- ✅ **성능 최적화**: useMemo, useCallback, FlatList virtualization 적용
- ✅ **반응형 디자인**: 다양한 디바이스 크기 지원

---

## 주요 기능

### 1. 홈 화면
- 카테고리별 탭 (홈, 우리동네, 오늘마감, 인기순위, 추천)
- 동적 GNB (스크롤 시 상단 고정)
- 실시간 데드라인 타이머
- 상품 카드 그리드

### 2. 검색 기능
- 실시간 검색어 입력
- 최근 검색어 관리 (AsyncStorage)
- 인기 검색어 표시
- 검색 결과 필터링 및 정렬

### 3. 카테고리 탐색
- 카테고리별 상품 브라우징
- 상단 배너 슬라이더
- 무한 스크롤

### 4. 필터 시스템
- 다중 필터 (가격, 슬롯, 모집상태 등)
- 가격 범위 슬라이더
- 필터 상태 저장 (DeviceEventEmitter)

### 5. 상품 상세
- 이미지 슬라이더
- 상품 정보 표시
- 공구 진행 상태
- 호스트 프로필

### 6. 하단 탭 네비게이션
- 홈 / 카테고리 / 지도 / 채팅 / 프로필

---

## 기술 스택

### Core
- **React Native**: 0.81.5
- **Expo SDK**: 54.0.21
- **TypeScript**: 5.9.2
- **Expo Router**: 6.0.14 (File-based routing)

### UI/UX
- **React Native Reanimated**: 4.1.1 (애니메이션)
- **React Native Gesture Handler**: 2.28.0 (제스처 처리)
- **Expo Image**: 3.0.10 (최적화된 이미지)
- **Bottom Sheet**: 5.2.6 (@gorhom/bottom-sheet)

### State Management
- **React Context API**: 전역 상태 관리
- **AsyncStorage**: 로컬 스토리지
- **DeviceEventEmitter**: 이벤트 버스

### Development Tools
- **Storybook**: 9.1.10 (컴포넌트 개발 및 문서화)
- **ESLint**: 9.25.0 (코드 품질 유지)
- **Babel**: 7.28.4 (트랜스파일러)

---

## 프로젝트 구조

```
gonggoo-app/
├── app/                          # 애플리케이션 코드
│   ├── (tabs)/                  # 하단 탭 네비게이션
│   │   ├── index.tsx            # 홈 탭 (→ features/home)
│   │   ├── category.tsx         # 카테고리 탭 (→ features/category)
│   │   ├── map.tsx              # 지도 탭
│   │   ├── chat.tsx             # 채팅 탭
│   │   ├── profile.tsx          # 프로필 탭
│   │   └── _layout.tsx          # 탭 레이아웃
│   │
│   ├── features/                # Feature-based 모듈
│   │   ├── home/                # 홈 화면 기능
│   │   │   ├── HomeScreen.tsx  # 홈 메인
│   │   │   ├── components/      # 홈 전용 컴포넌트
│   │   │   ├── contents/        # 탭별 콘텐츠
│   │   │   ├── sections/        # 섹션 컴포넌트
│   │   │   └── index.ts
│   │   ├── search/              # 검색 기능
│   │   ├── filter/              # 필터 기능
│   │   ├── category/            # 카테고리 기능
│   │   └── ...
│   │
│   ├── shared/                  # 공통 코드
│   │   ├── components/          # 공통 컴포넌트
│   │   ├── hooks/               # 공통 훅
│   │   ├── services/            # API 및 비즈니스 로직
│   │   ├── types/               # 타입 정의
│   │   ├── utils/               # 유틸리티 함수
│   │   └── contexts/            # Context API
│   │
│   ├── product/                 # 상품 상세 (동적 라우트)
│   │   └── [id].tsx
│   │
│   ├── _layout.tsx              # 루트 레이아웃
│   └── index.tsx                # 앱 진입점
│
├── design-system/               # 디자인 시스템
│   ├── tokens/                  # 디자인 토큰 (색상, 타이포그래피 등)
│   ├── theme/                   # 테마 시스템
│   ├── primitives/              # 기본 컴포넌트 (Button, Icon 등)
│   ├── components/              # 복합 컴포넌트 (ProductCard, GNB 등)
│   ├── hooks/                   # 디자인 시스템 훅
│   └── utils/                   # 디자인 시스템 유틸
│
├── docs/                        # 문서
│   ├── DIRECTORY_STRUCTURE.md  # 디렉토리 구조 가이드
│   └── design-system/           # 디자인 시스템 문서
│
├── .rnstorybook/                # Storybook 설정
├── assets/                      # 정적 리소스 (이미지, 폰트 등)
├── .vscode/                     # VS Code 설정
├── DEVELOPMENT.md               # 개발 가이드
└── README.md                    # 이 파일
```

### 아키텍처 핵심 원칙

#### 1. 라우팅과 비즈니스 로직 분리

```
라우트 파일 (app/*.tsx)
  ↓ [단순 re-export]
Feature 구현 (app/features/*/Screen.tsx)
  ↓ [ThemeProvider로 감싸진 실제 화면]
Components, Hooks, Types
```

**라우트 파일 예제**:
```typescript
// app/search.tsx (단순 진입점)
export { default } from './features/search';
```

**Screen 파일 예제**:
```typescript
// app/features/search/SearchScreen.tsx (실제 구현)
export default function SearchScreen() {
  return (
    <ThemeProvider>
      <SearchScreenContent />
    </ThemeProvider>
  );
}
```

#### 2. 공통 코드 재사용

- **`app/shared/`**: 여러 기능에서 공통으로 사용하는 코드
- **`app/features/*/`**: 특정 기능 전용 코드

#### 3. 디자인 시스템 중앙 집중화

- **`design-system/tokens/`**: 디자인 토큰 (색상, 간격 등)
- **`design-system/primitives/`**: 기본 컴포넌트
- **`design-system/components/`**: 복합 컴포넌트

---

## 시작하기

### 요구사항

- **Node.js**: 18.x 이상
- **npm** 또는 **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **iOS 개발 (선택)**: Xcode, iOS Simulator
- **Android 개발 (선택)**: Android Studio, Android Emulator

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd gonggoo-app

# 의존성 설치
npm install
```

### 실행

```bash
# 개발 서버 시작
npm start

# iOS 실행
npm run ios

# Android 실행
npm run android

# Web 실행
npm run web
```

### Storybook 실행

```bash
# Storybook 스토리 생성
npm run storybook-generate

# 앱 내에서 Storybook 확인
# app/storybook.tsx 파일 참조
```

---

## 개발 가이드

### 새로운 기능 추가하기

#### 1. Feature 폴더 생성

```bash
mkdir -p app/features/my-feature
```

#### 2. 파일 구조 설정

```
app/features/my-feature/
├── MyFeatureScreen.tsx  # 메인 화면
├── components/          # 기능 전용 컴포넌트
├── hooks/              # 기능 전용 훅 (선택)
└── index.ts            # Export 관리
```

#### 3. Screen 파일 작성

```typescript
// app/features/my-feature/MyFeatureScreen.tsx
import { ThemeProvider, useTheme } from '@/design-system';
import React from 'react';
import { View, Text } from 'react-native';

export default function MyFeatureScreen() {
  return (
    <ThemeProvider>
      <MyFeatureScreenContent />
    </ThemeProvider>
  );
}

function MyFeatureScreenContent() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface.normal.bg1 }}>
      <Text>My Feature</Text>
    </View>
  );
}
```

#### 4. index.ts 작성

```typescript
// app/features/my-feature/index.ts
export { default } from './MyFeatureScreen';
export { default as MyFeatureScreen } from './MyFeatureScreen';
```

#### 5. 라우트 연결

```typescript
// app/my-feature.tsx
export { default } from './features/my-feature';
```

### 공통 코드 추가하기

#### 공통 훅

```typescript
// app/shared/hooks/useMyHook.ts
export const useMyHook = () => {
  // 구현
};

// app/shared/hooks/index.ts에 export 추가
export * from './useMyHook';
```

#### 공통 타입

```typescript
// app/shared/types/my.types.ts
export interface MyType {
  // 정의
}

// app/shared/types/index.ts에 export 추가
export * from './my.types';
```

### 디자인 시스템 컴포넌트 추가

#### Primitive 컴포넌트

```
design-system/primitives/MyComponent/
├── MyComponent.tsx
├── MyComponent.styles.ts  (선택)
├── MyComponent.types.ts   (선택)
└── index.ts
```

#### Composite 컴포넌트

```
design-system/components/MyComponent/
├── MyComponent.tsx
├── components/            (하위 컴포넌트)
├── MyComponent.styles.ts
├── MyComponent.types.ts
└── index.ts
```

---

## 문서

### 프로젝트 문서
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)**: 기여 가이드 및 Git 컨벤션
- **[DIRECTORY_STRUCTURE.md](./docs/DIRECTORY_STRUCTURE.md)**: 디렉토리 구조 상세 설명
- **[PERFORMANCE_OPTIMIZATION.md](./docs/PERFORMANCE_OPTIMIZATION.md)**: 성능 최적화 가이드

### 디자인 시스템 문서
- **[design-system/README.md](./docs/design-system/README.md)**: 디자인 시스템 개요
- **[design-system/tokens.md](./docs/design-system/tokens.md)**: 디자인 토큰 가이드
- **[design-system/components.md](./docs/design-system/components.md)**: 컴포넌트 가이드
- **[design-system/figma-sync.md](./docs/design-system/figma-sync.md)**: Figma 동기화 가이드

---

## 성능 최적화

프로젝트에 적용된 주요 최적화 기법입니다. 자세한 내용은 [성능 최적화 가이드](./docs/PERFORMANCE_OPTIMIZATION.md)를 참조하세요.

### 적용된 최적화

- ✅ **조건부 렌더링**: 불필요한 컴포넌트 마운트 방지 (메모리 60% 감소)
- ✅ **useMemo/useCallback**: 계산 비용이 높은 연산 최적화
- ✅ **FlatList 가상화**: 대량 데이터 렌더링 최적화
- ✅ **이미지 최적화**: Expo Image + 메모리/디스크 캐싱
- ✅ **번들 최적화**: 코드 분할 및 Lazy Loading

### 성능 개선 결과

| 항목 | 개선 전 | 개선 후 | 개선율 |
|------|---------|---------|--------|
| 초기 렌더링 시간 | 1,200ms | 720ms | 40% ↓ |
| 메모리 사용량 | 85MB | 34MB | 60% ↓ |
| 스크롤 성능 | 12% drop | 4% drop | 67% ↓ |

자세한 벤치마크 결과와 추가 최적화 방안은 [PERFORMANCE_OPTIMIZATION.md](./docs/PERFORMANCE_OPTIMIZATION.md)를 참조하세요.

---

## 코딩 컨벤션

### 파일 네이밍
- **컴포넌트**: PascalCase (예: `ProductCard.tsx`)
- **훅**: camelCase with 'use' prefix (예: `useProductList.ts`)
- **서비스**: camelCase with 'Service' suffix (예: `searchService.ts`)
- **타입**: camelCase with '.types' suffix (예: `product.types.ts`)
- **유틸**: camelCase (예: `filterProducts.ts`)
- **Export 파일**: `index.ts`

### Import 순서

```typescript
// 1. 외부 라이브러리
import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

// 2. Shared 모듈
import { useProductList, SearchService } from '@/app/shared';
import type { ProductCardVerticalData } from '@/app/shared/types';

// 3. 디자인 시스템
import { Button, GNB, useTheme } from '@/design-system';

// 4. Feature 내부 (상대 경로)
import { MyLocalComponent } from './components';
import type { MyLocalType } from './types';
```

### Git Commit Convention

프로젝트의 Git 컨벤션을 따라주세요. 자세한 내용은 [CONTRIBUTING.md](./docs/CONTRIBUTING.md)를 참조하세요.

```
<타입>: <제목>

[본문 (선택)]

Closes #이슈번호
```

**주요 타입**:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `test`: 테스트 코드

**예시**:
```bash
feat: 상품 검색 기능 추가

사용자가 키워드로 상품을 검색할 수 있는 기능
- SearchBar 컴포넌트 구현
- 최근 검색어 저장

Closes #123
```

---

## 기여하기

프로젝트 기여 방법 및 상세한 가이드는 [CONTRIBUTING.md](./docs/CONTRIBUTING.md)를 참조하세요.

### 기본 워크플로우

1. **이슈 생성**: GitHub Issues에서 작업 내용 이슈 등록
2. **브랜치 생성**: `feature/#이슈번호-기능명` 형식으로 브랜치 생성
3. **개발 및 커밋**: Git 컨벤션을 따라 커밋
4. **Pull Request**: PR 템플릿에 따라 작성
5. **코드 리뷰**: 리뷰 후 master 브랜치에 병합

---

## 문제 해결

### TypeScript 오류

**Cannot find module '@/...'**
```bash
# tsconfig.json의 paths 확인
# Metro bundler 재시작
npm start --reset-cache
```

**Type errors after refactoring**
```bash
# 전체 타입 체크
npx tsc --noEmit
```

### Build 오류

**Metro bundler errors**
```bash
# 캐시 클리어
npm start -- --reset-cache

# node_modules 재설치
rm -rf node_modules && npm install
```

**Expo errors**
```bash
# .expo 폴더 삭제 후 재시작
rm -rf .expo
npx expo start
```

---

## 라이선스

[라이선스 정보 추가]

---

## 팀

- **Figma 디자인**: [공구팟 기획](https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/)
- **이슈 제보**: GitHub Issues
- **팀 문의**: [연락처 추가]

---

## 참고 자료

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

**Last Updated**: 2025-11-04
