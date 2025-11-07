/**
 * Design Tokens Storybook
 *
 * 디자인 토큰을 시각적으로 확인할 수 있는 Storybook 스토리입니다.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { colors, spacing, typography, radius, shadows, dimensions } from '../../design-system/tokens';

const meta: Meta = {
  title: 'Design System/Tokens',
  component: View,
};

export default meta;

/**
 * Colors Story
 */
export const Colors: StoryObj = {
  render: () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Color Tokens</Text>

      {/* Surface/Normal Colors */}
      <Text style={styles.category}>Surface / Normal</Text>
      <Text style={styles.description}>페이지 전반적으로 들어가는 무난한 색상들</Text>
      {Object.entries(colors.surface.normal).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>surface.normal.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}

      {/* Surface/Brand Colors */}
      <Text style={styles.category}>Surface / Brand</Text>
      <Text style={styles.description}>브랜드 컬러로 들어간 버튼 색상</Text>
      {Object.entries(colors.surface.brand).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>surface.brand.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}

      {/* Surface/Env Colors */}
      <Text style={styles.category}>Surface / Env</Text>
      <Text style={styles.description}>강조가 되어야 하거나, 버튼이 비활성화</Text>
      {Object.entries(colors.surface.env).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>surface.env.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}

      {/* Surface/TextIcon/OnNormal/Text Colors */}
      <Text style={styles.category}>Surface / TextIcon / OnNormal / Text</Text>
      <Text style={styles.description}>텍스트에 사용된 모든 색상</Text>
      {Object.entries(colors.surface.texticon.onnormal.text).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>surface.texticon.onnormal.text.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}

      {/* Surface/TextIcon/OnNormal/Icon Colors */}
      <Text style={styles.category}>Surface / TextIcon / OnNormal / Icon</Text>
      <Text style={styles.description}>아이콘에 사용된 모든 색상</Text>
      {Object.entries(colors.surface.texticon.onnormal.icon).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>surface.texticon.onnormal.icon.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}

      {/* Border/Brand Colors */}
      <Text style={styles.category}>Border / Brand</Text>
      <Text style={styles.description}>브랜드 컬러로 표현한 선 색상</Text>
      {Object.entries(colors.border.brand).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>border.brand.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}

      {/* Border Colors */}
      <Text style={styles.category}>Border</Text>
      <Text style={styles.description}>일반 선 색상</Text>
      {['lowEmp', 'midEmp', 'highEmp'].map((key) => {
        const value = colors.border[key as keyof typeof colors.border];
        if (typeof value === 'string') {
          return (
            <View key={key} style={styles.tokenRow}>
              <View style={[styles.colorBox, { backgroundColor: value }]} />
              <Text style={styles.tokenName}>border.{key}</Text>
              <Text style={styles.tokenValue}>{value}</Text>
            </View>
          );
        }
        return null;
      })}

      {/* Border/Env Colors */}
      <Text style={styles.category}>Border / Env</Text>
      <Text style={styles.description}>선을 강조할 때</Text>
      {Object.entries(colors.border.env).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { backgroundColor: value }]} />
          <Text style={styles.tokenName}>border.env.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

/**
 * Spacing Story
 */
export const Spacing: StoryObj = {
  render: () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Spacing Tokens</Text>
      {Object.entries(spacing).map(([key, value]) => (
        <View key={key} style={styles.spacingRow}>
          <View style={[styles.spacingBox, { width: value, height: value }]} />
          <Text style={styles.tokenName}>{key}</Text>
          <Text style={styles.tokenValue}>{value}px</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

/**
 * Typography Story
 */
export const Typography: StoryObj = {
  render: () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Typography Tokens</Text>

      <Text style={styles.category}>Font Size</Text>
      {Object.entries(typography.fontSize).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <Text style={[styles.previewText, { fontSize: value }]}>Aa</Text>
          <Text style={styles.tokenName}>fontSize.{key}</Text>
          <Text style={styles.tokenValue}>{value}px</Text>
        </View>
      ))}

      <Text style={styles.category}>Font Weight</Text>
      {Object.entries(typography.fontWeight).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <Text style={[styles.previewText, { fontWeight: value as any }]}>Sample</Text>
          <Text style={styles.tokenName}>fontWeight.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

/**
 * Radius Story
 */
export const Radius: StoryObj = {
  render: () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Radius Tokens</Text>
      {Object.entries(radius).map(([key, value]) => (
        <View key={key} style={styles.radiusRow}>
          <View
            style={[
              styles.radiusBox,
              {
                borderRadius: value,
                backgroundColor: colors.surface.brand.primary,
              },
            ]}
          />
          <Text style={styles.tokenName}>{key}</Text>
          <Text style={styles.tokenValue}>{value}px</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

/**
 * Shadows Story
 */
export const Shadows: StoryObj = {
  render: () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shadow Tokens</Text>
      {Object.entries(shadows).map(([key, value]) => (
        <View key={key} style={styles.shadowRow}>
          <View
            style={[
              styles.shadowBox,
              value,
              { backgroundColor: colors.surface.normal.bg1 },
            ]}
          />
          <Text style={styles.tokenName}>{key}</Text>
          <Text style={styles.tokenValue}>elevation: {value.elevation}</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

/**
 * Dimensions Story
 */
export const Dimensions: StoryObj = {
  render: () => (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dimensions Tokens</Text>

      {/* Button Heights */}
      <Text style={styles.category}>Button Heights</Text>
      {Object.entries(dimensions.buttonHeight).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.dimensionBox, { height: value, backgroundColor: colors.surface.brand.primary }]} />
          <Text style={styles.tokenName}>buttonHeight.{key}</Text>
          <Text style={styles.tokenValue}>{value}px</Text>
        </View>
      ))}

      {/* Button Widths */}
      <Text style={styles.category}>Button Widths (Reference)</Text>
      {Object.entries(dimensions.buttonWidth).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.dimensionBox, { width: Math.min(value, 100), height: 30, backgroundColor: colors.surface.brand.primary }]} />
          <Text style={styles.tokenName}>buttonWidth.{key}</Text>
          <Text style={styles.tokenValue}>{value}px</Text>
        </View>
      ))}

      {/* Border Widths */}
      <Text style={styles.category}>Border Widths</Text>
      {Object.entries(dimensions.borderWidth).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.borderBox, { borderWidth: value, borderColor: colors.surface.brand.primary }]} />
          <Text style={styles.tokenName}>borderWidth.{key}</Text>
          <Text style={styles.tokenValue}>{value}px</Text>
        </View>
      ))}

      {/* Opacity */}
      <Text style={styles.category}>Opacity</Text>
      {Object.entries(dimensions.opacity).map(([key, value]) => (
        <View key={key} style={styles.tokenRow}>
          <View style={[styles.colorBox, { opacity: value, backgroundColor: colors.surface.brand.primary }]} />
          <Text style={styles.tokenName}>opacity.{key}</Text>
          <Text style={styles.tokenValue}>{value}</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  category: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  spacingBox: {
    backgroundColor: colors.surface.brand.primary,
    marginRight: 12,
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  radiusBox: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  shadowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  shadowBox: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
  },
  tokenName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  tokenValue: {
    fontSize: 12,
    color: '#666',
  },
  previewText: {
    width: 60,
    marginRight: 12,
  },
  dimensionBox: {
    width: 60,
    marginRight: 12,
  },
  borderBox: {
    width: 40,
    height: 40,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
});
