import React, { useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import { MenuList } from '@/app/shared/components';

import { useTheme, GNB } from '@/design-system';

import { ProfileInfo } from './components';
import { GroupBuySection, ParticipationSection } from './sections';
import { useProfileData } from './hooks';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const {
    userProfile,
    groupBuyStats,
    participationStats,
    menuItems,
    handleRecruitingPress,
    handleRecruitmentCompletePress,
    handleGroupCompletePress,
    handleWishlistPress,
    handleJoinedPress,
    handleTransactionCompletePress,
    handleSettingsPress,
    handleProfilePress,
    handleMenuItemPress,
  } = useProfileData();

  // Memoize menuItems with onPress handlers to avoid recreation on every render
  const menuItemsWithHandlers = useMemo(
    () =>
      menuItems.map(item => ({
        ...item,
        onPress: () => handleMenuItemPress(item),
      })),
    [menuItems, handleMenuItemPress]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      {/* GNB - ScrollView 밖 (고정) */}
      <GNB
        leftSection={{ type: 'logo-text', text: '마이버스' }}
        rightIcons={[{ type: 'settings', onPress: handleSettingsPress }]}
      />

      {/* ScrollView - 프로필 정보 및 나머지 콘텐츠 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <ProfileInfo
          nickname={userProfile.nickname}
          profileImageUri={userProfile.profileImageUri}
          onProfilePress={handleProfilePress}
        />

        {/* Group Buy Section */}
        <GroupBuySection
          stats={groupBuyStats}
          onRecruitingPress={handleRecruitingPress}
          onRecruitmentCompletePress={handleRecruitmentCompletePress}
          onGroupCompletePress={handleGroupCompletePress}
        />

        {/* Participation Section */}
        <ParticipationSection
          stats={participationStats}
          onWishlistPress={handleWishlistPress}
          onJoinedPress={handleJoinedPress}
          onTransactionCompletePress={handleTransactionCompletePress}
        />

        {/* Menu List */}
        <View style={styles.menuListContainer}>
          <MenuList items={menuItemsWithHandlers} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  menuListContainer: {
    marginTop: 16,    
  },
});
