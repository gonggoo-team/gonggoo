/**
 * Neighborhood Confirmation View Component
 *
 * 동네 확인 화면 (Screen 2)
 * Figma: node-id=1056-10149
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Button } from '@/design-system';
import type { DetectedLocation } from '../types/location.types';

interface NeighborhoodConfirmationViewProps {
  location: DetectedLocation;
  onConfirm: () => void;
  onSearch: () => void;
}

export function NeighborhoodConfirmationView({
  location,
  onConfirm,
  onSearch,
}: NeighborhoodConfirmationViewProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Title with detected neighborhood */}
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.semiBold,
            },
          ]}
        >
          '{location.neighborhood}'이 맞으신가요?
        </Text>
      </View>

      {/* Detected location info */}
      {/* <View style={styles.infoCard}>
        <Text
          style={[
            styles.fullAddress,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          {location.fullAddress}
        </Text>
        <Text
          style={[
            styles.accuracy,
            {
              color: theme.colors.surface.texticon.onnormal.text.lowEmp,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          정확도: ±{Math.round(location.accuracy)}m
        </Text>
      </View> */}

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        {/* Green Confirm Button with borderRadius */}
        <Button variant="full-primary-rounded" onPress={onConfirm}>
          {`${location.neighborhood} 공구글 확인하기`}
        </Button>

        {/* Gray Search Button */}
        <TouchableOpacity
          onPress={onSearch}
          style={[
            styles.searchButton,
            { backgroundColor: '#E1E1E1', borderRadius: 12 },
          ]}
        >
          <Text
            style={[
              styles.searchButtonText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            다른 지역 검색하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    paddingVertical: 10,
    marginTop: 7,
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.625, // -2.5% of 25px
  },
  infoCard: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 8,
  },
  fullAddress: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  accuracy: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.35,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 64,
    gap: 10,
  },
  searchButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: -0.4,
    fontWeight: '600',
  },
});
