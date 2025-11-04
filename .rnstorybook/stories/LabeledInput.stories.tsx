/**
 * LabeledInput Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 LabeledInput 컴포넌트입니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LabeledInput } from '../../design-system/primitives/LabeledInput';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof LabeledInput> = {
  title: 'Design System/Components/LabeledInput',
  component: LabeledInput,
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

type Story = StoryObj<typeof LabeledInput>;

// ===== Phone Input =====

export const PhoneEmpty: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <ThemeProvider>
        <View style={styles.fullWidth}>
          <LabeledInput
            label="휴대폰 번호"
            value={value}
            onChangeText={setValue}
            variant="phone"
            keyboardType="phone-pad"
          />
        </View>
      </ThemeProvider>
    );
  },
};

export const PhoneFilled: Story = {
  render: () => {
    const [value, setValue] = useState('010-1234-5678');
    return (
      <ThemeProvider>
        <View style={styles.fullWidth}>
          <LabeledInput
            label="휴대폰 번호"
            value={value}
            onChangeText={setValue}
            variant="phone"
            keyboardType="phone-pad"
          />
        </View>
      </ThemeProvider>
    );
  },
};

// ===== Verification Input =====

export const VerificationEmpty: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <ThemeProvider>
        <View style={styles.fullWidth}>
          <LabeledInput
            label="인증번호"
            value={value}
            onChangeText={setValue}
            variant="verification"
            keyboardType="number-pad"
          />
        </View>
      </ThemeProvider>
    );
  },
};

export const VerificationFilled: Story = {
  render: () => {
    const [value, setValue] = useState('123456');
    return (
      <ThemeProvider>
        <View style={styles.fullWidth}>
          <LabeledInput
            label="인증번호"
            value={value}
            onChangeText={setValue}
            variant="verification"
            keyboardType="number-pad"
          />
        </View>
      </ThemeProvider>
    );
  },
};

// ===== Showcase =====

export const AllVariants: Story = {
  render: () => {
    const [phone, setPhone] = useState('010-1234-5678');
    const [verification, setVerification] = useState('');

    return (
      <ThemeProvider>
        <View style={styles.showcase}>
          <LabeledInput
            label="휴대폰 번호"
            value={phone}
            onChangeText={setPhone}
            variant="phone"
            keyboardType="phone-pad"
          />
          <LabeledInput
            label="인증번호"
            value={verification}
            onChangeText={setVerification}
            variant="verification"
            keyboardType="number-pad"
          />
        </View>
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
  fullWidth: {
    width: '100%',
    maxWidth: 375,
  },
  showcase: {
    width: '100%',
    maxWidth: 375,
    gap: 16,
    padding: 16,
  },
});
