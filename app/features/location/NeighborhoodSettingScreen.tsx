/**
 * Neighborhood Setting Screen
 *
 * 동네 범위 설정 화면
 * - 지도 기반으로 현재 위치 표시
 * - 동네 범위 설정 (2km, 5km, 10km)
 * - 동네 변경하기 / 적용하기 버튼
 *
 * Figma: node-id=1066-17087
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import * as Location from 'expo-location';
import { ThemeProvider, useTheme, GNB, Button, SearchBar, ScreenWrapper } from '@/design-system';
import { MapView } from '@/design-system/components/MapView';
import { useAuth } from '@/app/shared/contexts';
import type { LocationData } from '@/app/shared/types/auth.types';
import { geocodeAddress, reverseGeocode } from '@/app/shared/utils/geocoding';

type RangeOption = 2 | 5 | 10;

export default function NeighborhoodSettingScreen() {
  return (
    <ThemeProvider>
      <NeighborhoodSettingScreenContent />
    </ThemeProvider>
  );
}

function NeighborhoodSettingScreenContent() {
  const router = useRouter();
  const { push, back } = useThrottledNavigation();
  const { theme } = useTheme();
  const { user, updateLocation } = useAuth();
  const params = useLocalSearchParams();
  const { height: windowHeight } = useWindowDimensions();

  // 화면 크기에 따라 지도 높이 계산 (GNB + 컨트롤 영역 제외)
  const mapHeight = windowHeight - 290;

  const [selectedRange, setSelectedRange] = useState<RangeOption>(5);

  /**
   * 범위에 따른 줌 레벨 계산
   * 2km: zoom 14, 5km: zoom 13, 10km: zoom 12
   */
  const getZoomLevel = (range: RangeOption): number => {
    switch (range) {
      case 2:
        return 14;
      case 5:
        return 13;
      case 10:
        return 12;
      default:
        return 13;
    }
  };
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isFromSignup = params.fromSignup === 'true';

  /**
   * 현재 위치 가져오기
   */
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        // 사용자가 이미 위치를 설정한 경우 사용
        if (user?.location) {
          setCurrentLocation({
            latitude: user.location.latitude,
            longitude: user.location.longitude,
            address: user.location.address,
          });
        } else {
          // 새로운 위치 가져오기
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            // 역지오코딩으로 실제 주소 가져오기
            const address = await reverseGeocode(
              location.coords.latitude,
              location.coords.longitude
            );

            setCurrentLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              address: address || '주소를 가져올 수 없습니다',
            });
          }
        }
      } catch (error) {
        console.error('[NeighborhoodSetting] Location error:', error);
      }
    };

    getCurrentLocation();
  }, [user]);

  /**
   * 뒤로 가기 핸들러
   */
  const handleGoBack = () => {
    router.back();
  };

  /**
   * 범위 선택 핸들러
   */
  const handleRangeSelect = (range: RangeOption) => {
    setSelectedRange(range);
  };

  /**
   * 동네 변경하기 핸들러
   */
  const handleChangeNeighborhood = () => {
    push({
      pathname: '/neighborhood-auth',
      params: {
        fromSignup: params.fromSignup,
        phone: params.phone,
      },
    });
  };

  /**
   * 적용하기 핸들러
   */
  const handleApply = async () => {
    if (!currentLocation) {
      return;
    }

    setIsLoading(true);

    try {
      // 주소에서 동네명, 시, 구 추출
      const addressParts = currentLocation.address.split(' ');
      const city = addressParts.length >= 1 ? addressParts[0] : '';
      const district = addressParts.length >= 2 ? addressParts[1] : '';
      const neighborhood = addressParts.length >= 3 ? addressParts[2] : '';

      const locationData: LocationData = {
        address: currentLocation.address,
        neighborhood,
        city,
        district,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        verified: true,
        range: selectedRange,
      };

      const success = await updateLocation(locationData);

      if (success) {
        if (isFromSignup) {
          router.replace('/(tabs)');
        } else {
          router.back();
        }
      } else {
        alert('위치 설정에 실패했습니다.');
      }
    } catch (error) {
      console.error('[NeighborhoodSetting] Apply error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 주소 검색 핸들러 (디바운싱 적용)
   */
  const handleAddressSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      const result = await geocodeAddress(query);

      if (result) {
        setCurrentLocation({
          latitude: result.latitude,
          longitude: result.longitude,
          address: result.address,
        });
        setSearchQuery('');
      } else {
        alert('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('[NeighborhoodSetting] Search error:', error);
      alert('주소 검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * 검색어 변경 핸들러 (디바운싱)
   */
  const handleSearchQueryChange = useCallback((text: string) => {
    setSearchQuery(text);

    // 기존 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 검색어가 비어있으면 검색하지 않음
    if (!text.trim()) {
      return;
    }

    // 500ms 후 검색 실행
    searchTimeoutRef.current = setTimeout(() => {
      // 자동 검색은 비활성화하고 사용자가 Enter를 누를 때만 검색
      // handleAddressSearch(text);
    }, 500);
  }, []);

  /**
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /**
   * 내 위치 버튼 핸들러
   */
  const handleMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 역지오코딩으로 주소 가져오기
      const address = await reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address || '주소를 가져올 수 없습니다',
      });
    } catch (error) {
      console.error('[NeighborhoodSetting] Get current location error:', error);
      alert('현재 위치를 가져올 수 없습니다.');
    }
  };

  if (!currentLocation) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.surface.normal.bg1 },
        ]}
      >
        <GNB leftSection={{ type: 'back', onPress: handleGoBack }} />
        <View style={styles.loadingContainer}>
          <Text
            style={{
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            위치를 불러오는 중...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScreenWrapper
      preset='fullscreen'
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      {/* GNB Header */}
      <View style={styles.header}>
        <GNB
          leftSection={{
            type: 'back-with-title',
            title: '동네 설정',
            onPress: handleGoBack,
          }}
        />
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <MapView
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          address={currentLocation.address}
          height={mapHeight}
          showMarker={true}
          rangeCircleRadius={selectedRange}
          showLocationButton={true}
          onLocationButtonPress={handleMyLocation}
          interactive={false}
          zoom={getZoomLevel(selectedRange)}
        />

        {/* Search Bar Overlay */}
        <View style={styles.searchOverlay}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            onSearch={handleAddressSearch}
            placeholder="주소 또는 장소명 검색"
            containerStyle={styles.searchBarContainer}
            editable={!isSearching}
          />
        </View>
      </View>

      {/* Range Setting Section */}
      <View style={styles.rangeSection}>
        <Text
          style={[
            styles.rangeTitle,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.semiBold,
            },
          ]}
        >
          동네 범위 설정
        </Text>

        <View style={styles.rangeSliderContainer}>
          <View style={styles.rangeLabels}>
            <TouchableOpacity onPress={() => handleRangeSelect(2)}>
              <Text
                style={[
                  styles.rangeLabel,
                  {
                    color:
                      selectedRange === 2
                        ? theme.colors.surface.texticon.onnormal.text.black
                        : theme.colors.surface.texticon.onnormal.text.midEmp,
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight:
                      selectedRange === 2
                        ? theme.typography.fontWeight.medium
                        : theme.typography.fontWeight.regular,
                  },
                ]}
              >
                2km 이내
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRangeSelect(5)}>
              <Text
                style={[
                  styles.rangeLabel,
                  {
                    color:
                      selectedRange === 5
                        ? theme.colors.surface.texticon.onnormal.text.black
                        : theme.colors.surface.texticon.onnormal.text.midEmp,
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight:
                      selectedRange === 5
                        ? theme.typography.fontWeight.medium
                        : theme.typography.fontWeight.regular,
                  },
                ]}
              >
                5km이내
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRangeSelect(10)}>
              <Text
                style={[
                  styles.rangeLabel,
                  {
                    color:
                      selectedRange === 10
                        ? theme.colors.surface.texticon.onnormal.text.black
                        : theme.colors.surface.texticon.onnormal.text.midEmp,
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight:
                      selectedRange === 10
                        ? theme.typography.fontWeight.medium
                        : theme.typography.fontWeight.regular,
                  },
                ]}
              >
                10km 이내
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderBackground,
                { backgroundColor: theme.colors.border.lowEmp },
              ]}
            />
            <View
              style={[
                styles.sliderThumb,
                {
                  backgroundColor: theme.colors.surface.brand.primary,
                  left:
                    selectedRange === 2
                      ? '0%'
                      : selectedRange === 5
                      ? '48%'
                      : '92%',
                },
              ]}
            />
            <View
              style={[
                styles.rangeIndicator,
                {
                  backgroundColor: theme.colors.border.lowEmp,
                  left: '0%',
                },
              ]}
            />
            <View
              style={[
                styles.rangeIndicator,
                {
                  backgroundColor: theme.colors.border.lowEmp,
                  left: '48%',
                },
              ]}
            />
            <View
              style={[
                styles.rangeIndicator,
                {
                  backgroundColor: theme.colors.border.lowEmp,
                  left: '96%',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.changeButton,
            {
              backgroundColor: theme.colors.surface.normal.bg1,
              borderColor: theme.colors.border.lowEmp,
            },
          ]}
          onPress={handleChangeNeighborhood}
        >
          <Text
            style={[
              styles.changeButtonText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.semiBold,
              },
            ]}
          >
            동네 변경하기
          </Text>
        </TouchableOpacity>

        <Button
          variant="full-primary"
          onPress={handleApply}
          disabled={isLoading}
        >
          {isLoading ? '적용 중...' : '적용하기'}
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  header: {
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  searchOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  searchBarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  rangeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  rangeTitle: {
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  rangeSliderContainer: {
    gap: 16,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  rangeLabel: {
    fontSize: 13,
    lineHeight: 15.5,
    letterSpacing: -0.325,
  },
  sliderTrack: {
    position: 'relative',
    height: 28,
    justifyContent: 'center',
  },
  sliderBackground: {
    height: 4,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 5,
  },
  rangeIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  changeButton: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButtonText: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: -0.4,
  },
});
