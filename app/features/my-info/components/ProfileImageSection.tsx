import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/design-system/hooks';
import { Icon } from '@/design-system/primitives';

interface ProfileImageSectionProps {
  nickname: string;
  profileImageUri?: string;
  onImagePress: () => void;
}

export function ProfileImageSection({
  nickname,
  profileImageUri,
  onImagePress,
}: ProfileImageSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <TouchableOpacity
        onPress={onImagePress}
        activeOpacity={0.8}
        style={[
          styles.imageWrapper,
          {
            backgroundColor: theme.colors.surface.normal.bg2,
          },
        ]}
      >
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <Image
            source={require('@/design-system/primitives/Icon/icons/profile-default.svg')}
            style={styles.image}
            contentFit="contain"
          />
        )}
        {/* Edit Icon Overlay */}
        <View
          style={[
            styles.editIconContainer,
            {
              backgroundColor: theme.colors.surface.brand.primary,
              borderColor: theme.colors.surface.normal.white,
            },
          ]}
        >
          <Icon name="edit" size={22} color={theme.colors.surface.normal.white} />
        </View>
      </TouchableOpacity>

      {/* Nickname */}
      <Text
        style={[
          styles.nickname,
          {
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.md, // 16px (Figma 사양)
            fontWeight: theme.typography.fontWeight.semiBold, // 600
            letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.md),
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {nickname}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  imageWrapper: {
    width: 110, // Figma 사양
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',        
  },
  image: {
    width: '100%',
    height: '100%',    
    backgroundColor: '#FFFFFF'
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30, // Figma 사양
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  nickname: {
    textAlign: 'center',
  },
});
