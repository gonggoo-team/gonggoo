import { Text } from "@react-navigation/elements";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/design-system";

export default function Index() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg2 }]}>
      <Text style={[styles.title, { color: theme.colors.surface.texticon.onnormal.text.black }]}>시작 화면</Text>
      <Text style={[styles.subtitle, { color: theme.colors.surface.texticon.onnormal.text.midEmp }]}>이동할 화면을 선택하세요.</Text>

      {/* asChild prop을 사용하면 TouchableOpacity의 스타일을 유지한 채 Link 기능을 쓸 수 있습니다. */}
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.surface.brand.primary, shadowColor: theme.colors.surface.texticon.onnormal.text.black }]}>
          <Text style={[styles.buttonText, { color: theme.colors.surface.normal.white }]}>앱 실행하기</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/storybook" asChild>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.surface.brand.primary, shadowColor: theme.colors.surface.texticon.onnormal.text.black }]}>
          <Text style={[styles.buttonText, { color: theme.colors.surface.normal.white }]}>Storybook 보기</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  storybookButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
