module.exports = {
  expo: {
    name: "Neighbors",
    slug: "neighbors-gonggoo",
    version: "1.0.0",
    scheme: "neighbors",
    orientation: "portrait",
    androidStatusBar: {
      backgroundColor: "#006242",
      barStyle: "light-content"
    },
    android: {
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      package: "com.gonggoo.neighbors"
    },
    plugins: [
      "expo-web-browser",
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "네이버스가 사용자의 위치를 사용하도록 허용하시겠습니까?",
          locationWhenInUsePermission: "네이버스가 사용자의 위치를 사용하도록 허용하시겠습니까?"
        }
      ],
      [
        "@mj-studio/react-native-naver-map",
        {
          client_id: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://repository.map.naver.com/archive/maven"
            ]
          }
        }
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#006242",
          image: "./assets/images/splash-color.png"
        }
      ]
    ],
    extra: {
      router: {},
      eas: {
        projectId: "03f4bdbd-de95-4da4-8620-a86bf75896be"
      }
    }
  }
};
