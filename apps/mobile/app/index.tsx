import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
        BusTrack 🚍
      </Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Welcome Driver
      </Text>
    </View>
  );
}