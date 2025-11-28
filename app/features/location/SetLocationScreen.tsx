/**
 * Set Location Screen
 *
 * 위치 설정 화면 (수동 검색 모드)
 * - GPS 인증 fallback으로 사용
 * - Mock 위치 목록에서 선택
 * - 선택 후 회원가입 완료 또는 홈으로 이동
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemeProvider, useTheme, Button, GNB } from '@/design-system';
import { useAuth } from '@/app/shared/contexts';
import type { LocationData } from '@/app/shared/types';
import { MOCK_LOCATIONS } from '@/app/shared/services/mock/auth.mock';

export default function SetLocationScreen() {
  return (
    <ThemeProvider>
      <SetLocationScreenContent />
    </ThemeProvider>
  );
}

function SetLocationScreenContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const { signup, updateLocation } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const isFromSignup = params.fromSignup === 'true';
  const phone = params.phone as string | undefined;
  const mode = params.mode as string | undefined;

  /**
   * 위치 선택 핸들러
   */
  const handleSelectLocation = (location: LocationData) => {
    setSelectedLocation(location);
  };

  /**
   * "완료" 버튼 핸들러
   */
  const handleComplete = async () => {
    if (!selectedLocation) {
      return;
    }

    setIsLoading(true);

    try {
      if (isFromSignup && phone) {
        // 회원가입 플로우: 전화번호와 위치 정보로 회원가입
        const result = await signup(phone, {
          ...selectedLocation,
          verified: true,
        });

        if (result.success) {
          // 회원가입 성공 → 네비게이션 스택 초기화 → 홈으로 이동
          router.dismissAll();
          router.replace('/(tabs)');
        } else {
          alert(result.error || '회원가입에 실패했습니다.');
        }
      } else {
        // 설정에서 진입: 위치만 업데이트
        const success = await updateLocation({
          ...selectedLocation,
          verified: true,
        });

        if (success) {
          router.back();
        } else {
          alert('위치 설정에 실패했습니다.');
        }
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 뒤로 가기 핸들러
   */
  const handleGoBack = () => {
    if (isFromSignup) {
      // 회원가입 중에는 뒤로 가기 불가 (위치 설정 필수)
      alert('위치 설정은 필수입니다.');
    } else {
      router.back();
    }
  };

  /**
   * 위치 아이템 렌더링
   */
  const renderLocationItem = ({ item }: { item: LocationData }) => {
    const isSelected = selectedLocation?.address === item.address;

    return (
      <TouchableOpacity
        style={[
          styles.locationItem,
          {
            borderColor: isSelected
              ? theme.colors.surface.brand.primary
              : theme.colors.border.lowEmp,
            backgroundColor: isSelected
              ? theme.colors.surface.brand.primary + '10'
              : theme.colors.surface.normal.bg1,
          },
        ]}
        onPress={() => handleSelectLocation(item)}
      >
        <View style={styles.locationInfo}>
          <Text
            style={[
              styles.locationAddress,
              {
                color: theme.colors.surface.texticon.onnormal.text.black,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            {item.address}
          </Text>
          <Text
            style={[
              styles.locationCoords,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            위도: {item.latitude.toFixed(4)}, 경도: {item.longitude.toFixed(4)}
          </Text>
        </View>

        {isSelected && (
          <Text
            style={[
              styles.selectedIndicator,
              {
                color: theme.colors.surface.brand.primary,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            ✓
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Title and subtitle based on mode
  const title =
    mode === 'manual' ? '동네를 검색해 보세요' : '내 동네를\n설정해주세요';

  const subtitle =
    mode === 'manual'
      ? '검색하거나 목록에서 동네를 선택해주세요'
      : isFromSignup
      ? '활동할 동네를 선택하면 주변의 공동구매 정보를 볼 수 있어요'
      : '동네를 변경하면 주변의 공동구매 정보가 업데이트됩니다';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      {/* GNB Header */}
      <GNB leftSection={{ type: 'back', onPress: handleGoBack }} />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.surface.texticon.onnormal.text.black,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.semiBold,
              },
            ]}
          >
            {title}
          </Text>
        </View>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          {subtitle}
        </Text>

        {/* Location List */}
        <FlatList
          data={MOCK_LOCATIONS}
          keyExtractor={(item) => item.address}
          renderItem={renderLocationItem}
          contentContainerStyle={styles.listContent}
        />

        {/* Complete Button */}
        <Button
          variant="full-primary"
          onPress={handleComplete}
          disabled={!selectedLocation || isLoading}
        >
          {isLoading ? '설정 중...' : '완료'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    paddingVertical: 10,
    marginTop: 7,
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.625, // -2.5% of 25px
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.35,
    marginTop: 16,
    marginBottom: 24,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    lineHeight: 18,
  },
  selectedIndicator: {
    fontSize: 24,
    lineHeight: 28,
    marginLeft: 12,
  },
});
