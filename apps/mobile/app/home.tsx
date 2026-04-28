import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { API_URL } from "../lib/api";

type DriverInfo = {
  name: string;
  busNumber: string;
  plateNumber: string;
  route: string;
};

export default function Home() {
  const router = useRouter();
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          router.replace("/");
          return;
        }

        const res = await fetch(
          `${API_URL}/api/driver/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          router.replace("/");
          return;
        }

        const data = await res.json();
        setDriver(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  const initials = driver?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??";

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#2d5be3" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.driverName}>{driver?.name ?? "Driver"}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      {/* Status Badge */}
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Online</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="bus" size={22} color="#2d5be3" />
          </View>
          <View>
            <Text style={styles.cardLabel}>Bus Number</Text>
            <Text style={styles.cardValue}>{driver?.busNumber ?? "—"}</Text>
            {driver?.plateNumber ? (
              <Text style={styles.cardSub}>{driver.plateNumber}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="map-marker-path" size={22} color="#2d5be3" />
          </View>
          <View>
            <Text style={styles.cardLabel}>Route</Text>
            <Text style={styles.cardValue}>{driver?.route ?? "—"}</Text>
          </View>
        </View>
      </View>

      {/* Start Trip Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Trip Started")}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="play-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Start Trip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },

  greeting: {
    fontSize: 14,
    color: "#888",
  },

  driverName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a2e",
    marginTop: 2,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2d5be3",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 6,
  },

  statusText: {
    fontSize: 13,
    color: "#22c55e",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eef1fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  cardLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
  },

  cardSub: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },

  footer: {
    position: "absolute",
    bottom: 36,
    left: 24,
    right: 24,
  },

  button: {
    backgroundColor: "#2d5be3",
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#2d5be3",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
