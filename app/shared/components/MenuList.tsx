import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ProfileMenuItem } from '@/app/shared/types';
import { MenuItem } from './MenuItem';

interface MenuListProps {
  items: ProfileMenuItem[];
  /** 카드 스타일 적용 여부 (프로필 수정 화면용) */
  showCard?: boolean;
}

export function MenuList({ items }: MenuListProps) {

  return (
    <View
      style={[
        styles.container,        
      ]}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <MenuItem item={item} />          
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
