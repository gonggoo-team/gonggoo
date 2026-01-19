  import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
  import {
    View,
    Text,
    TextInput,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Alert,
    Keyboard,
    Platform,
    LayoutAnimation,
  } from 'react-native';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import {
    KeyboardAwareScrollView,
    KeyboardProvider,
    KeyboardStickyView,
    useReanimatedKeyboardAnimation,
  } from 'react-native-keyboard-controller';
  import Animated, { useAnimatedStyle } from 'react-native-reanimated';

  // 디자인 시스템 및 훅 (경로는 기존 유지)
  import { useTheme, Button, SearchBar, Icon, MapView, GNB, Divider, ScreenWrapper } from '@/design-system';
  import { useLocationSelection } from '../../hooks';
  import { SearchResultsList } from './SearchResultsList';
  import { searchNeighborhoods, type NeighborhoodSearchResult } from '@/app/features/location/services/naverGeocodingService';

  // ----------------------------------------------------------------------
  // Types & Interfaces
  // ----------------------------------------------------------------------

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

  // ----------------------------------------------------------------------
  // Sub-Components
  // ----------------------------------------------------------------------

  /**
   * 키보드 공간 확보용 스페이서
   * 키보드가 올라오면 그 높이만큼 뷰를 밀어올려 입력창이 가려지지 않게 합니다.
   */
  const KeyboardSpacer = () => {
    const { height } = useReanimatedKeyboardAnimation();
    
    const animatedStyle = useAnimatedStyle(() => {
      const keyboardHeight = Math.abs(height.value);
      return { 
        height: keyboardHeight,
        // 키보드가 열렸을 때 약간의 여유 공간(20px) 추가
        marginBottom: keyboardHeight > 0 ? 20 : 0 
      };
    }, []);

    return <Animated.View style={animatedStyle} />;
  };

  /**
   * 메인 로직 및 UI 컴포넌트
   */
  const LocationSelectionContent = ({
    initialLocation,
    onConfirm,
    onCancel,
  }: Omit<LocationSelectionModalProps, 'visible'>) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();

    // ----------------------------------------------------------------------
    // Hooks & State
    // ----------------------------------------------------------------------
    
    // 지도 높이 동적 계산 (화면의 약 38%)
    const MAP_HEIGHT = useMemo(() => Math.max(220, windowHeight * 0.38), [windowHeight]);

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
    const [isResultVisible, setIsResultVisible] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    // ----------------------------------------------------------------------
    // Handlers
    // ----------------------------------------------------------------------

    // 검색 초기화
    useEffect(() => {
      setSearchQuery('');
      setSearchResults([]);
      setIsResultVisible(false);
    }, []);

    const handleSearch = async (text: string) => {
      setSearchQuery(text);
      if (!text.trim()) {
        setSearchResults([]);
        setIsResultVisible(false);
        return;
      }

      setIsSearching(true);
      setIsResultVisible(true);
      
      try {
        const results = await searchNeighborhoods(text);
        setSearchResults(results);
      } catch (error) {
        console.error('[LocationSelection] Search Failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const handleSelectSearchResult = useCallback((result: NeighborhoodSearchResult) => {
      Keyboard.dismiss();
      setIsResultVisible(false);
      setSearchResults([]);
      setSearchQuery(''); // 선택 후 검색어 초기화 (UX 결정사항)
      
      // 약간의 딜레이 후 이동 (키보드 내려가는 애니메이션 고려)
      setTimeout(() => {
        moveToCoordinates(result.latitude, result.longitude);
      }, 100);
    }, [moveToCoordinates]);

    const handleClearSearch = useCallback(() => {
      setSearchQuery('');
      setSearchResults([]);
      setIsResultVisible(false);
      Keyboard.dismiss();
    }, []);

    const handleConfirmAction = useCallback(() => {
      if (!location) return;
      onConfirm({
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        detailAddress: location.detailAddress || undefined,
      });
    }, [location, onConfirm]);

    const handleCurrentLocationPress = useCallback(async () => {
      const result = await getCurrentLocation();
      if (!result.success) {
        Alert.alert('위치 확인 실패', '현재 위치 정보를 가져올 수 없습니다. GPS 설정을 확인해주세요.');
      }
    }, [getCurrentLocation]);

    // TextInput 포커스 시 스크롤 (키보드가 가리지 않도록)
    const handleDetailAddressFocus = useCallback(() => {
      // 키보드가 올라오는 시간을 고려하여 약간의 딜레이 후 스크롤
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd?.({ animated: true });
      }, 300);
    }, []);

    // ----------------------------------------------------------------------
    // Render Helpers
    // ----------------------------------------------------------------------

    // 로딩 뷰
    const renderLoadingState = () => (
      <View style={[styles.placeholderContainer, { height: MAP_HEIGHT, backgroundColor: theme.colors.surface.normal.bg2 }]}>
        <Text style={{ color: theme.colors.surface.texticon.onnormal.text.midEmp }}>
          위치 정보를 불러오고 있습니다...
        </Text>
      </View>
    );

    // 지도 뷰
    const renderMapState = () => (
      <View style={[styles.mapWrapper, { height: MAP_HEIGHT }]}>
        <MapView
          ref={mapRef}
          latitude={location?.latitude || 37.5665}
          longitude={location?.longitude || 126.9780}
          height={MAP_HEIGHT}
          interactive={!isResultVisible} // 검색 중에는 지도 조작 방지
          zoom={16}
          onCameraChange={handleCameraChange}
        />
        
        {/* 중앙 고정 핀 */}
        <View style={styles.centerPin} pointerEvents="none">
          <Icon name="map-pin-fill" size={36} color={theme.colors.surface.brand.primary} />
        </View>

        {/* 현재 위치 버튼 */}
        <TouchableOpacity
          style={[styles.gpsButton, { backgroundColor: theme.colors.surface.normal.bg1 }]}
          onPress={handleCurrentLocationPress}
          activeOpacity={0.8}
        >
          <Icon name="map-pin-fill" size={24} color={theme.colors.surface.texticon.onnormal.text.highEmp} />
        </TouchableOpacity>
      </View>
    );

    return (
      <ScreenWrapper preset="fullscreen" style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
        {/* 1. Header Layer */}
        <GNB
          leftSection={{ type: 'back', onPress: onCancel }}
          centerSection={{ type: 'title', text: '위치 설정' }}
        />
        <Divider />

        {/* 2. Search Layer (High Z-Index) */}
        <View style={styles.searchLayer}>
          {/* 기능 안내 문구 */}
          {/* <View style={styles.guideContainer}>
            <Icon name="map-pin-fill" size={18} color={theme.colors.surface.brand.primary} />
            <Text style={[styles.guideText, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
              거래 희망 장소를 검색하거나, 지도를 움직여 선택하세요
            </Text>
          </View> */}

          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="도로명, 건물명, 지번 검색"
            variant="default"
            onClear={handleClearSearch}
          />
          
          {/* 검색 결과 드롭다운 (Absolute) */}
          {isResultVisible && (
            <View style={[styles.dropdownContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
              <SearchResultsList
                results={searchResults}
                onSelectResult={handleSelectSearchResult}
                isSearching={isSearching}
              />
            </View>
          )}
        </View>

        {/* 3. Content Layer (Scrollable) */}
        <View style={styles.contentLayer}>
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!isResultVisible} // 검색 결과가 떠있으면 스크롤 잠금
            showsVerticalScrollIndicator={false}
            bottomOffset={80} // footer 높이 + 여유 공간
          >
            {/* 지도 영역 */}
            {!isLoadingLocation && location ? renderMapState() : renderLoadingState()}

            {/* 주소 및 입력 폼 */}
            {location && (
              <View style={styles.formSection}>
                {/* 주소 정보 */}
                <View style={styles.infoRow}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
                    설정된 위치
                  </Text>
                  <Text style={[styles.addressText, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
                    {isGeocoding ? '주소 확인 중...' : location.address}
                  </Text>
                </View>

                {/* 상세 주소 입력 */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
                    상세 주소 <Text style={{ fontWeight: '400', color: theme.colors.surface.texticon.onnormal.text.lowEmp }}>(선택)</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        borderColor: theme.colors.border.midEmp,
                        backgroundColor: theme.colors.surface.normal.bg1,
                        color: theme.colors.surface.texticon.onnormal.text.black,
                      }
                    ]}
                    value={location.detailAddress}
                    onChangeText={updateDetailAddress}
                    placeholder="예: 101동 1203호, 1층 로비 등"
                    placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
                    editable={!isResultVisible}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    onFocus={handleDetailAddressFocus}
                  />
                </View>

                {/* 안내 박스 */}
                <View style={[styles.noticeBox, { backgroundColor: theme.colors.surface.normal.bg2 }]}>
                  <Icon name="map-pin-fill" size={16} color={theme.colors.surface.texticon.onnormal.text.midEmp} />
                  <Text style={[styles.noticeText, { color: theme.colors.surface.texticon.onnormal.text.midEmp }]}>
                    정확한 거래를 위해 만남 장소를 구체적으로 적어주세요.
                  </Text>
                </View>
              </View>
              
            )}

            {/* 키보드 대응용 여백 - footer가 가리지 않도록 */}
            <View style={{ height: 120 }} />
          </KeyboardAwareScrollView>

          {/* 검색 시 딤 처리 (클릭 시 닫기) */}
          {isResultVisible && (
            <TouchableOpacity
              style={styles.dimOverlay}
              activeOpacity={1}
              onPress={handleClearSearch}
            />
          )}
        </View>

        {/* 4. Sticky Footer Layer - 키보드 위에 고정 */}
        {/* <KeyboardStickyView
          offset={{
            closed: 0,
            opened: 0,
          }}
        > */}
          <View style={[
            styles.footer,
            {
              backgroundColor: theme.colors.surface.normal.bg1,
              borderTopColor: theme.colors.border.lowEmp,
              paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 16) : 16,
            }
          ]}>
            <View style={styles.buttonGroup}>
              <Button
                variant="full-secondary-rounded"
                onPress={onCancel}
                style={styles.flexBtn}
              >
                취소
              </Button>
              <Button
                variant="full-primary-rounded"
                onPress={handleConfirmAction}
                disabled={!location || isGeocoding}
                style={styles.flexBtn}
              >
                확인
              </Button>
            </View>
          </View>
        {/* </KeyboardStickyView> */}

      </ScreenWrapper>
    );
  };

  // ----------------------------------------------------------------------
  // Main Export
  // ----------------------------------------------------------------------

  export const LocationSelectionModal: React.FC<LocationSelectionModalProps> = (props) => {
    if (!props.visible) return null;

    return (
      <Modal
        visible={props.visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={props.onCancel}
        statusBarTranslucent
      >
        <KeyboardProvider statusBarTranslucent>
          <LocationSelectionContent {...props} />
        </KeyboardProvider>
      </Modal>
    );
  };

  // ----------------------------------------------------------------------
  // Styles
  // ----------------------------------------------------------------------

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    // Search Layer
    searchLayer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      zIndex: 20, // 최상위 레벨 (딤 처리보다 위)
      gap: 12,
    },
    guideContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    guideText: {
      fontSize: 14,
      fontWeight: '500',
      fontFamily: 'Pretendard',
      lineHeight: 20,
    },
    dropdownContainer: {
      position: 'absolute',
      top: '100%',
      left: 16,
      right: 16,
      marginTop: 6,
      maxHeight: 280,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
      overflow: 'hidden',
    },
    // Content Layer
    contentLayer: {
      flex: 1,
      position: 'relative',
      zIndex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 20,
    },
    dimOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 10,
    },
    // Map Components
    mapWrapper: {
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      position: 'relative',
      backgroundColor: '#F3F4F6',
    },
    placeholderContainer: {
      borderRadius: 16,
      marginBottom: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerPin: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -36, // 아이콘 크기/2 + 보정값
      marginLeft: -18,
      zIndex: 1,
    },
    gpsButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 2,
    },
    // Form Components
    formSection: {
      gap: 24,
    },
    infoRow: {
      gap: 8,
    },
    inputGroup: {
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Pretendard',
    },
    addressText: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      fontFamily: 'Pretendard',
    },
    textInput: {
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 15,
      fontFamily: 'Pretendard',
      height: 50, // 터치 영역 확보
    },
    noticeBox: {
      flexDirection: 'row',
      padding: 14,
      borderRadius: 10,
      gap: 10,
      alignItems: 'flex-start',      
    },
    noticeText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 19,
      fontFamily: 'Pretendard',
    },
    // Footer
    footer: {
      width: '100%',
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 12,
    },
    flexBtn: {
      flex: 1,
    },
  });