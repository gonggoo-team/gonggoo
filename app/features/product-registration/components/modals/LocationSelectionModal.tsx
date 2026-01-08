/**
 * Location Selection Modal Component
 *
 * 위치 선택 모달 컴포넌트입니다.
 *
 * [수정 사항]
 * 1. ScrollView 스타일 개선: scrollContent에 flex: 1을 적용하여 남은 영역을 꽉 채우고 스크롤 가능하게 함.
 * 2. SafeAreaView 및 기존 레이아웃 구조 유지
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
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
  
  // 모달 높이 고정 (화면의 85%)
  const MODAL_HEIGHT = windowHeight * 0.85;
  // 지도 높이
  const MAP_HEIGHT = Math.max(250, windowHeight * 0.45);

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

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NeighborhoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const isResultListVisible = searchResults.length > 0;

  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [visible]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (location && !isResultListVisible) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    });
    return () => showSubscription.remove();
  }, [location, isResultListVisible]);

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

  const handleSelectResult = (result: NeighborhoodSearchResult) => {
    Keyboard.dismiss();
    moveToCoordinates(result.latitude, result.longitude);
    setSearchResults([]);
  };

  const dismissSearchResults = () => {
    setSearchResults([]);
    Keyboard.dismiss();
  };

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

  const handleCurrentLocation = async () => {
    const result = await getCurrentLocation();
    if (!result.success) {
      Alert.alert('알림', '위치 정보를 가져올 수 없습니다.');
    }    
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.staticBackgroundOverlay}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.touchableBackground} />
        </TouchableWithoutFeedback>
      </View>

      <SafeAreaView style={styles.safeAreaContainer} pointerEvents="box-none">
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -10 : 0} 
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.modalContainer,
              { 
                backgroundColor: theme.colors.surface.normal.bg1,
                height: MODAL_HEIGHT, 
                maxHeight: MODAL_HEIGHT 
              },
            ]}
          >
            {/* 1. Header (Fixed) */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
                위치 추가
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onCancel}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name="close"
                  size={24}
                  color={theme.colors.surface.texticon.onnormal.icon.black}
                />
              </TouchableOpacity>            
            </View>
            
            {/* 2. Search Section (Fixed) */}
            <View style={styles.searchSection}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSearch={handleSearch}
                placeholder="주소 또는 장소명 검색"
                variant="default"
                onClear={() => setSearchResults([])}
              />

              {isResultListVisible && (
                <View style={styles.searchResultsContainer}>
                  <SearchResultsList
                    results={searchResults}
                    onSelectResult={handleSelectResult}
                    isSearching={isSearching}
                  />
                </View>
              )}
            </View>

            <View style={{ flex: 1, position: 'relative' }}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.scrollContent}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                scrollEnabled={!isResultListVisible}
                nestedScrollEnabled={true} 
              >
                {!isLoadingLocation && location && (
                  <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
                    <MapView
                      ref={mapRef}
                      latitude={location.latitude}
                      longitude={location.longitude}
                      height={MAP_HEIGHT}
                      interactive={!isResultListVisible}
                      zoom={15}
                      onCameraChange={(lat, lng) => handleCameraChange(lat, lng)}
                      disableAutoAnimation={true}
                    />

                    <View style={styles.centerPinContainer}>
                      <Icon name="map-pin-fill" size={40} color={theme.colors.surface.brand.primary} />
                    </View>

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
                      <Icon name="map-pin-line" size={24} color={theme.colors.surface.brand.primary} />
                    </TouchableOpacity>
                  </View>
                )}

                {isLoadingLocation && (
                  <View style={[styles.loadingContainer, { height: MAP_HEIGHT }]}>
                    <Text style={[styles.loadingText, { color: theme.colors.surface.texticon.onnormal.text.midEmp }]}>
                      위치를 불러오는 중...
                    </Text>
                  </View>
                )}

                {location && (
                  <View style={styles.addressSection}>
                    <Text style={[styles.label, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
                      위치
                    </Text>
                    <Text style={[styles.addressText, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
                      {isGeocoding ? '주소 확인 중...' : location.address}
                    </Text>
                  </View>
                )}

                {location && (
                  <>
                    <View style={styles.detailAddressSection}>
                      <Text style={[styles.label, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
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
                        placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
                        editable={!isResultListVisible}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                      <View style={styles.infoSection}>
                      <Icon name="info-circle" size={16} color={theme.colors.surface.texticon.onnormal.text.midEmp} />
                      <Text style={styles.infoText}>
                        정확한 위치 정보는 원활한 공동구매 진행을 위해 필수적입니다. 지도를 움직여 핀의 위치를 다시 한번 확인해주세요.
                      </Text>
                    </View>
                  </>
                )}
              </ScrollView>

              {isResultListVisible && (
                <TouchableWithoutFeedback onPress={dismissSearchResults}>
                  <View style={[styles.contentDimOverlay, { backgroundColor: 'rgba(255, 255, 255, 0.6)' }]} />
                </TouchableWithoutFeedback>
              )}
            </View>

            {/* 4. Button Container (Fixed) */}
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  staticBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 26, 26, 0.4)',
    zIndex: 1,
  },
  touchableBackground: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 450,
    borderRadius: 12,
    padding: 24,
    paddingBottom: 16,
    display: 'flex',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
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
    maxHeight: 250,
  },
  scrollContent: {
    flex: 1,
    
  },
  contentDimOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    borderRadius: 8,
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
    marginTop: -40,
    marginLeft: -20,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    fontWeight: '500',
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
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard',
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
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5', // 연한 회색 배경
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 80,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#666',
    fontFamily: 'Pretendard',
  },
});