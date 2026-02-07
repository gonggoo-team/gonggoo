/**
 * TextField Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 TextField 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - Default (빈 상태, placeholder)
 * - WithText (텍스트 입력됨)
 * - Focused (포커스 상태, 커서 표시)
 * - WithoutCursor (커서 숨김)
 * - Responsive (다양한 디바이스 크기)
 * - Interactive (실제 입력 가능)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextField } from '../../design-system/primitives/TextField';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof TextField> = {
  title: 'Design System/Components/TextField',
  component: TextField,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.container}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextField>;

// ===== Default (빈 상태, Placeholder) =====

export const Default: Story = {
  args: {
    value: '',
    onChangeText: () => {},
    placeholder: '닉네임을 입력해주세요.',
  },
};

// ===== WithText (텍스트 입력됨) =====

export const WithText: Story = {
  args: {
    value: '김삼겹',
    onChangeText: () => {},
    placeholder: '닉네임을 입력해주세요.',
  },
};

// ===== Focused (포커스 상태, 커서 표시) =====

export const Focused: Story = {
  args: {
    value: '김삼겹',
    onChangeText: () => {},
    placeholder: '닉네임을 입력해주세요.',
    showCursor: true,
    autoFocus: true, // 자동 포커스
  },
};

// ===== WithoutCursor (커서 숨김) =====

export const WithoutCursor: Story = {
  args: {
    value: '김삼겹',
    onChangeText: () => {},
    placeholder: '닉네임을 입력해주세요.',
    showCursor: false,
    autoFocus: true,
  },
};

// ===== LongText (긴 텍스트) =====

export const LongText: Story = {
  args: {
    value: '매우긴닉네임을입력했을때어떻게처리되는지확인하는테스트입니다',
    onChangeText: () => {},
    placeholder: '닉네임을 입력해주세요.',
  },
};

// ===== Multiline (여러 줄 텍스트) =====

export const Multiline: Story = {
  args: {
    value: '첫 번째 줄\n두 번째 줄\n세 번째 줄',
    onChangeText: () => {},
    placeholder: '여러 줄 입력 가능',
    multiline: true,
  },
};

// ===== Interactive (실제 입력 가능) =====

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);

    return (
      <ThemeProvider>
        <View style={styles.interactiveContainer}>
          <Text style={styles.label}>닉네임</Text>
          <TextField
            value={value}
            onChangeText={setValue}
            placeholder="닉네임을 입력해주세요."
            showCursor={true}
            onFocusChange={setFocused}
          />
          <Text style={styles.status}>
            입력값: {value || '(없음)'}
          </Text>
          <Text style={styles.status}>
            포커스 상태: {focused ? '포커스됨' : '포커스 해제'}
          </Text>
        </View>
      </ThemeProvider>
    );
  },
};

// ===== Responsive Test (반응형 테스트 - 다양한 너비) =====

export const ResponsiveTest: Story = {
  render: () => {
    const testCases = [
      { width: 280, label: '작은 디바이스 (280px)' },
      { width: 320, label: 'iPhone SE (320px)' },
      { width: 335, label: 'Figma 기준 (335px)' },
      { width: 375, label: 'iPhone 14 (375px)' },
      { width: 390, label: 'iPhone 14 Pro (390px)' },
      { width: 430, label: 'iPhone 14 Pro Max (430px)' },
    ];

    return (
      <ThemeProvider>
        <ScrollView style={styles.responsiveContainer}>
          {testCases.map((testCase) => (
            <View key={testCase.width} style={styles.responsiveSection}>
              <Text style={styles.responsiveLabel}>{testCase.label}</Text>
              <View style={[styles.responsiveBox, { width: testCase.width }]}>
                <TextField
                  value="김삼겹"
                  onChangeText={() => {}}
                  placeholder="닉네임을 입력해주세요."
                  showCursor={true}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </ThemeProvider>
    );
  },
};

// ===== All States (모든 상태 한 눈에) =====

export const AllStates: Story = {
  render: () => {
    return (
      <ThemeProvider>
        <ScrollView style={styles.showcaseContainer}>
          <View style={styles.showcase}>
            <Text style={styles.sectionTitle}>빈 상태 (Placeholder)</Text>
            <TextField
              value=""
              onChangeText={() => {}}
              placeholder="닉네임을 입력해주세요."
            />

            <Text style={styles.sectionTitle}>텍스트 입력됨</Text>
            <TextField
              value="김삼겹"
              onChangeText={() => {}}
              placeholder="닉네임을 입력해주세요."
            />

            <Text style={styles.sectionTitle}>포커스 + 커서</Text>
            <TextField
              value="김삼겹"
              onChangeText={() => {}}
              placeholder="닉네임을 입력해주세요."
              showCursor={true}
              autoFocus={true}
            />

            <Text style={styles.sectionTitle}>긴 텍스트</Text>
            <TextField
              value="매우긴닉네임을입력했을때처리되는지확인"
              onChangeText={() => {}}
              placeholder="닉네임을 입력해주세요."
            />
          </View>
        </ScrollView>
      </ThemeProvider>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  interactiveContainer: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181A1A',
  },
  status: {
    fontSize: 12,
    color: '#9FA7B1',
  },
  responsiveContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  responsiveSection: {
    padding: 16,
    gap: 8,
  },
  responsiveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181A1A',
    marginBottom: 8,
  },
  responsiveBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F9F9F9',
  },
  showcaseContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  showcase: {
    padding: 16,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 8,
  },
});
