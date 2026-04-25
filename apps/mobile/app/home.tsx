import { View, Text, Button } from "react-native";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Welcome, Driver 🚌
      </Text>

      <View style={{ marginTop: 20 }}>
        <Text>Bus Number: --</Text>
        <Text>Route: --</Text>
      </View>

      <View style={{ marginTop: 40 }}>
        <Button title="Start Trip" onPress={() => {}} />
      </View>
    </View>
  );
}