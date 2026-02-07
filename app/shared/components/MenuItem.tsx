import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system/hooks';
import { Icon } from '@/design-system/primitives';
import type { ProfileMenuItem } from '@/app/shared/types';

interface MenuItemProps {
  item: ProfileMenuItem;
}

export function MenuItem({ item }: MenuItemProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    if (item.onPress) {
      item.onPress();
    }
  };

  // value가 있는 경우 (프로필 수정 화면용 레이아웃)
  // if (item.value !== undefined) {
  //   const content = (
  //     <View style={styles.containerWithValue}>
  //       {/* 라벨 */}
  //       <Text
  //         style={[
  //           styles.labelWithValue,
  //           {
  //             color: theme.colors.surface.texticon.onnormal.text.black,
  //             fontFamily: theme.typography.fontFamily.primary,
  //             fontSize: theme.typography.fontSize.sm,
  //             fontWeight: theme.typography.fontWeight.semiBold,
  //             letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
  //           },
  //         ]}
  //       >
  //         {item.label}
  //       </Text>

  //       {/* 값 + Chevron */}
        // <View style={styles.valueContainer}>
        //   <Text
        //     style={[
        //       styles.value,
        //       {
        //         color: theme.colors.surface.texticon.onnormal.text.black,
        //         fontFamily: theme.typography.fontFamily.primary,
        //         fontSize: theme.typography.fontSize.sm,
        //         fontWeight: theme.typography.fontWeight.medium,
        //         letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
        //       },
        //     ]}
        //   >
        //     {item.value}
        //   </Text>
        //   {item.showChevron && (
        //     <Icon
        //       name="small-chevron"
        //       size={24}
        //       color={theme.colors.surface.texticon.onnormal.icon.black}
        //     />
        //   )}
        // </View>
  //     </View>
  //   );

  //   // Chevron + onPress가 있으면 TouchableOpacity로 감싸기
  //   if (item.showChevron && item.onPress) {
  //     return (
  //       <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
  //         {content}
  //       </TouchableOpacity>
  //     );
  //   }

  //   return content;
  // }

  // value가 없는 경우 (기존 프로필 화면용 레이아웃)
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semiBold,
            letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.md),
            paddingLeft: theme.spacing.sm10,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item.label}
      </Text>
      <View style={styles.valueContainer}>
        <Text
          style={[
            styles.value,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
            },
          ]}
        >
          {item.value}
        </Text>        
      </View>
      <View style={{paddingHorizontal: 10}}>
        <Icon name="small-chevron" size={8} color={theme.colors.surface.texticon.onnormal.icon.black} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // 기존 프로필 화면용 스타일 (value 없음)
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingTop: 7,
    paddingBottom: 21,
  },
  label: {
    flex: 1,    
  },
  // 프로필 수정 화면용 스타일 (value 있음)
  containerWithValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    minHeight: 48,
  },
  labelWithValue: {
    flex: 0,
    marginRight: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,    
  },
  value: {
    textAlign: 'right',
  },
});
