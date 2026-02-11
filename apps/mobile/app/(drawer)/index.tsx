import { View } from 'react-native';
import { Header } from '~/components/header';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header />
      <View className="h-64 w-full flex-1 bg-orange-500" />
    </View>
  );
}
