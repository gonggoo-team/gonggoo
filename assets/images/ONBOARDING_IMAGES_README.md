# Onboarding Images

이 디렉토리에 다음 이미지 파일들을 추가해주세요:

## 필요한 이미지

### 1. onboarding.png
- **용도**: 첫 번째 온보딩 스플래시 화면
- **크기**: 디바이스 전체 화면 (예: 1170x2532px for iPhone 13 Pro)
- **설명**: 앱 브랜드 로고 또는 소개 이미지
- **참고**: `app/features/onboarding/OnboardingScreen.tsx:30`

### 2. onboarding2.png
- **용도**: 두 번째 온보딩 화면 배경 이미지
- **크기**: 중간 크기 (예: 600x800px)
- **설명**: 앱 주요 기능을 나타내는 일러스트레이션
- **참고**: `app/features/onboarding2/Onboarding2Screen.tsx:94`

## 임시 이미지 생성 (개발용)

이미지가 준비되지 않은 경우, 다음과 같이 임시 이미지를 생성할 수 있습니다:

```bash
# 임시로 기존 이미지를 복사하여 사용 (개발 테스트용)
cp product-47.png onboarding.png
cp product-47.png onboarding2.png
```

## Figma 디자인

실제 디자인은 Figma에서 확인할 수 있습니다:
https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/

온보딩 화면 디자인을 export하여 이 디렉토리에 추가해주세요.
