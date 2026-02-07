import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/design-system';
import { Icon } from '@/design-system/primitives';

interface ProfileInfoProps {
  nickname: string;
  profileImageUri?: string;
  onProfilePress: () => void;
}

export function ProfileInfo({
  nickname,
  profileImageUri,
  onProfilePress,
}: ProfileInfoProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onProfilePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: 'transparent',
        },
      ]}
    >
      {/* Profile Image */}
      <View
        style={[
          styles.imageWrapper,          
        ]}
      >
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri }}
            style={styles.image}
            contentFit="cover"
          />
        ) : (
          <Icon
            name="profile-default"
            size={78}
            color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
            responsive={false}
          />
        )}
      </View>

      {/* Nickname */}
      <Text
        style={[
          styles.nickname,
          {
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semiBold,
            letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xl),
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {nickname}
      </Text>

      {/* Navigation Icon */}
      <Icon
        name="chevron-right"
        size={48}
        color={theme.colors.surface.texticon.onnormal.icon.black}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  imageWrapper: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nickname: {
    flex: 1,
  },
});
