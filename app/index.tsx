import { Text } from "@react-navigation/elements";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>시작 화면</Text>
      <Text style={styles.subtitle}>이동할 화면을 선택하세요.</Text>

      {/* asChild prop을 사용하면 TouchableOpacity의 스타일을 유지한 채 Link 기능을 쓸 수 있습니다. */}
      <Link href="/(tabs)" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>앱 실행하기</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/storybook" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Storybook 보기</Text>
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
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2F80ED',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  storybookButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
