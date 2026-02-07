// components/SplashView.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Splash = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash-neighbors.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006242', // app.json 배경색과 동일하게 맞춤
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,      // 화면 가로 너비 100%
    height: '100%',    // 화면 높이 100% (필요에 따라 조절)
    resizeMode: 'contain', 
  },
});