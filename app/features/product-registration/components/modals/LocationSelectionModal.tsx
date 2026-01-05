/**
 * Location Selection Modal Component
 *
 * 위치 선택 모달 컴포넌트입니다.
 * "검색 → 지도 조정 → 주소 확인 → 세부주소 입력" 플로우를 제공합니다.
 *
 * Features:
 * - SearchBar로 주소 검색
 * - 지도 중앙에 고정된 핀 (맵 드래그로 위치 조정)
 * - 역지오코딩으로 주소 자동 표시 (debounced)
 * - 세부 주소 입력 (예: "1층 엘리베이터 근처")
 * - 현재 위치로 초기화
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useTheme, Button, SearchBar, Icon, MapView } from '@/design-system';
import { useLocationSelection } from '../../hooks';
import { SearchResultsList } from './SearchResultsList';
import { searchNeighborhoods } from '@/app/features/location/services/naverGeocodingService';
import type { NeighborhoodSearchResult } from '@/app/features/location/services/naverGeocodingService';

interface LocationSelectionModalProps {
  visible: boolean;
  initialLocation?: {
    address: string;
    latitude?: number;
    longitude?: number;
    detailAddress?: string;
  } | null;
  onConfirm: (location: {
    address: string;
    latitude?: number;
    longitude?: number;
    detailAddress?: string;
  }) => void;
  onCancel: () => void;
}

export const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  visible,
  initialLocation,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const { height: windowHeight } = useWindowDimensions();

  // 위치 선택 hook
  const {
    location,
    isLoadingLocation,
    isGeocoding,
    mapRef,
    getCurrentLocation,
    handleCameraChange,
    updateDetailAddress,
    moveToCoordinates,
  } = useLocationSelection(initialLocation);

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NeighborhoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const isResultListVisible = searchResults.length > 0;

  // 모달이 닫힐 때 검색 결과 초기화
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [visible]);

  /**
   * 주소 검색 핸들러
   */
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchNeighborhoods(query);
      setSearchResults(results);
    } catch (error) {
      console.error('[LocationSelectionModal] Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * 검색 결과 선택 핸들러
   */
  const handleSelectResult = (result: NeighborhoodSearchResult) => {
    // 지도 카메라 이동
    moveToCoordinates(result.latitude, result.longitude);

    // 검색 결과 닫기
    setSearchResults([]);
    setSearchQuery('');
  };

  /**
   * 확인 버튼 핸들러
   */
  const handleConfirm = () => {
    if (location) {
      onConfirm({
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        detailAddress: location.detailAddress || undefined,
      });
    }
  };

  /**
   * 현 위치로 설정 버튼 핸들러
   */
  const handleCurrentLocation = async () => {
    const result = await getCurrentLocation();

    if (!result.success) {
      if (result.error === 'denied') {
        // 권한 거부 시 안내 메시지
        Alert.alert(
          '위치 권한 필요',
          '위치 권한이 거부되었습니다.\n주소 검색을 통해 위치를 설정해주세요.',
          [{ text: '확인' }]
        );
      } else {
        // 위치 서비스 오류
        Alert.alert(
          '위치 가져오기 실패',
          '현재 위치를 가져올 수 없습니다.\n주소 검색을 이용해주세요.',
          [{ text: '확인' }]
        );
      }
    }
  };

  // 지도 높이 계산 (화면 높이의 45%)
  const mapHeight = Math.max(250, windowHeight * 0.45);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface.normal.bg1 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
            >
              위치 추가
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Icon
                name="close"
                size={24}
                color={theme.colors.surface.texticon.onnormal.icon.black}
              />
            </TouchableOpacity>            
          </View>
          
          <View style={[styles.searchSection, { zIndex: 100 }]}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearch}
              placeholder="주소 또는 장소명 검색"
              variant="default"
            />

            {/* Search Results List (absolute positioned) */}
            {isResultListVisible && (
              <View style={styles.searchResultsContainer}>
                <View onStartShouldSetResponder={() => true}>
                  <SearchResultsList
                    results={searchResults}
                    onSelectResult={handleSelectResult}
                    isSearching={isSearching}
                  />
                </View>
              </View>
            )}
          </View>

          <ScrollView
            style={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isResultListVisible}
          >
            {/* Map View Container */}
            {!isLoadingLocation && location && (
              <View style={[styles.mapContainer, { height: mapHeight }]}>
                <MapView
                  ref={mapRef}
                  latitude={location.latitude}
                  longitude={location.longitude}
                  height={mapHeight}
                  interactive={true}
                  zoom={15}
                  onCameraChange={(lat, lng) => {
                    handleCameraChange(lat, lng);
                  }}
                  disableAutoAnimation={true}
                />

                {/* Center Pin Overlay (고정된 핀) */}
                <View style={styles.centerPinContainer}>
                  <Icon
                    name="map-pin-fill"
                    size={40}
                    color={theme.colors.surface.brand.primary}
                  />
                </View>

                {/* 현 위치로 설정 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.currentLocationButton,
                    {
                      backgroundColor: theme.colors.surface.normal.bg1,
                      shadowColor: theme.colors.surface.texticon.onnormal.text.black,
                    },
                  ]}
                  onPress={handleCurrentLocation}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="map-pin-line"
                    size={24}
                    color={theme.colors.surface.brand.primary}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Loading State */}
            {isLoadingLocation && (
              <View style={[styles.loadingContainer, { height: mapHeight }]}>
                <Text
                  style={[
                    styles.loadingText,
                    { color: theme.colors.surface.texticon.onnormal.text.midEmp },
                  ]}
                >
                  위치를 불러오는 중...
                </Text>
              </View>
            )}

            {/* Address Display Section */}
            {location && (
              <View style={styles.addressSection}>
                <Text
                  style={[
                    styles.label,
                    { color: theme.colors.surface.texticon.onnormal.text.black },
                  ]}
                >
                  위치
                </Text>
                <Text
                  style={[
                    styles.addressText,
                    { color: theme.colors.surface.texticon.onnormal.text.highEmp },
                  ]}
                >
                  {isGeocoding ? '주소 확인 중...' : location.address}
                </Text>
              </View>
            )}

            {/* Detail Address Input */}
            {location && (
              <View style={styles.detailAddressSection}>
                <Text
                  style={[
                    styles.label,
                    { color: theme.colors.surface.texticon.onnormal.text.black },
                  ]}
                >
                  상세 주소 (선택사항)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border.midEmp,
                      backgroundColor: theme.colors.surface.normal.bg1,
                      color: theme.colors.surface.texticon.onnormal.text.black,
                    },
                  ]}
                  value={location.detailAddress}
                  onChangeText={updateDetailAddress}
                  placeholder="예: 1층 엘리베이터 근처"
                  placeholderTextColor={
                    theme.colors.surface.texticon.onnormal.text.lowEmp
                  }
                />
              </View>
            )}
          </ScrollView>
            {/* Button Container */}
            <View style={styles.buttonContainer}>
              <Button
                variant="full-secondary-rounded"
                onPress={onCancel}
                style={styles.button}
              >
                취소
              </Button>
              <Button
                variant="full-primary-rounded"
                onPress={handleConfirm}
                disabled={!location || isGeocoding}
                style={styles.button}
              >
                확인
              </Button>
            </View>
          </View>          
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 26, 26, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    maxHeight: '90%',
    borderRadius: 12,
    padding: 24,
    paddingBottom: 16,
    display: 'flex',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.45,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  scrollContent: {
    // flex: 1,
  },
  searchSection: {
    marginBottom: 16,
    position: 'relative',    
    zIndex: 100, 
    flexShrink: 0,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,    
    zIndex: 101,
    maxHeight: 300,
  },
  mapContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40, // 핀 높이의 절반 (핀 끝이 중앙을 가리키도록)
    marginLeft: -20, // 핀 너비의 절반
    zIndex: 10,
    pointerEvents: 'none',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    letterSpacing: -0.35,
  },
  addressSection: {
    marginBottom: 16,
    gap: 8,
  },
  detailAddressSection: {
    marginBottom: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    letterSpacing: -0.375,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    letterSpacing: -0.375,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexShrink: 0,
  },
  button: {
    flex: 1,
  },
});
