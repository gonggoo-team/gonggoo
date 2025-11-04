/**
 * SearchTag Styles (개선된 반응형 + 텍스트 렌더링 최적화)
 *
 * 검색 태그 컴포넌트 스타일
 * Figma 디자인 시스템 기반 + 반응형 개선 + 텍스트 잘림 방지
 *
 * 반응형 처리:
 * - minWidth: 최소 너비 보장 (너무 작아지지 않도록)
 * - maxWidth: 최대 너비 제한 (한 줄에 최소 2개 배치)
 * - flexShrink: 텍스트가 길면 축소
 * - numberOfLines: 1줄로 제한, ellipsizeMode로 말줄임
 *
 * 텍스트 렌더링 최적화:
 * - minHeight 사용으로 텍스트 잘림 방지 (fontSize 변경 시 자동 적응)
 * - paddingVertical 계산값: (minHeight - lineHeight) / 2 = (36 - 15.6) / 2 ≈ 10px
 * - 다양한 디바이스(iOS/Android/Web) 및 접근성(큰 글씨) 모드 대응
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createSearchTagStyles = (theme: Theme) => {
  return StyleSheet.create({
    /**
     * 공통 컨테이너 스타일 (반응형 개선 + 텍스트 렌더링 최적화)
     *
     * paddingVertical 계산 근거:
     * - fontSize: 13px
     * - lineHeight: 13 × 1.2 (tight) = 15.6px
     * - minHeight: 36px (Figma 기준)
     * - 필요한 상하 여백: (36 - 15.6) / 2 = 10.2px
     * - 안전값: 10px (React Native 픽셀 정렬 고려)
     * - 결과: 16px 공간 확보 (15.6px 필요, 0.4px 여유)
     *
     * 크기 정책 (Figma 동기화):
     * - maxWidth 제거: 텍스트 길이에 따라 자유롭게 확장 (Figma hug contents)
     * - minWidth: 짧은 텍스트("휴지" 등) 대응
     * - 부모 컨테이너(ScrollView, flexWrap)에서 레이아웃 제어
     */
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md, // 16px
      paddingVertical: 10, // 계산된 최적값 (텍스트 잘림 방지)
      borderRadius: 40, // Figma: 40px
      gap: theme.spacing.xs, // 8px
      minHeight: 36, // Figma 기준 (height → minHeight로 변경, 자동 확장 가능)
      minWidth: 50, // 최소 너비 보장 (짧은 텍스트 대응)
      // maxWidth 제거: 텍스트 길이에 따라 유동적 크기 (Figma 디자인 동일)
      alignSelf: 'flex-start', // 컨텐츠 크기에 맞춤
    },

    /**
     * Recent Variant (최근 검색어)
     * - 흰 배경
     * - 회색 테두리
     * - X 버튼 포함
     */
    recent: {
      backgroundColor: theme.colors.surface.normal.bg1,
      borderWidth: 1,
      borderColor: theme.colors.border.lowEmp,
    },

    /**
     * Recommended Variant (추천 검색어)
     * - 회색 배경
     * - 테두리 없음
     */
    recommended: {
      backgroundColor: theme.colors.surface.normal.bg2,
    },

    /**
     * 텍스트 공통 스타일
     */
    text: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs13),
      lineHeight: theme.typography.fontSize.xs13 * theme.typography.lineHeight.tight,
      color: theme.colors.surface.texticon.onnormal.text.black,
      flexShrink: 1, // 텍스트가 길어지면 축소
    },

    /**
     * 아이콘 컨테이너
     */
    iconContainer: {
      width: 13,
      height: 13,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0, // 아이콘은 축소되지 않음
    },

    /**
     * 텍스트 컨테이너 (말줄임 처리 + 세로 정렬 최적화)
     *
     * justifyContent: 'center' 추가 이유:
     * - React Native에서 lineHeight가 컨테이너보다 작을 때 미세한 상단 치우침 방지
     * - iOS/Android 렌더링 차이 흡수
     * - 시각적 중앙 정렬 보장
     *
     * flexGrow 제거 이유:
     * - Figma 디자인은 hug contents (텍스트 크기에 맞춤)
     * - flexGrow: 1이 있으면 태그가 남은 공간을 모두 차지하려고 함
     * - 추천 검색어에서 태그가 화면 전체 너비를 차지하는 문제 발생
     */
    textContainer: {
      flexShrink: 1, // 공간이 부족하면 축소
      // flexGrow 제거: 텍스트 길이에만 맞춤 (Figma hug contents)
      justifyContent: 'center', // 세로 중앙 정렬 보장
    },
  });
};
