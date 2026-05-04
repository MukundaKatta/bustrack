import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { API_URL } from "../lib/api";

const PING_INTERVAL_MS = 30_000;

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
  const [tripActive, setTripActive] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  const [tripLoading, setTripLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(true);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestCoordsRef = useRef<{ latitude: number; longitude: number; speed: number | null } | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    loadDriverInfo();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (tripActive) {
      startPingCycle();
    } else {
      stopPingCycle();
    }
    return () => stopPingCycle();
  }, [tripActive]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationPermission(false);
      return;
    }
    setLocationPermission(true);
  };

  const startPingCycle = async () => {
    locationSubRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
      (loc) => {
        latestCoordsRef.current = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          speed: loc.coords.speed,
        };
      }
    );

    await sendPing();
    pingIntervalRef.current = setInterval(sendPing, PING_INTERVAL_MS);
  };

  const stopPingCycle = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
    latestCoordsRef.current = null;
  };

  const sendPing = async () => {
    const coords = latestCoordsRef.current;
    if (!coords) return;

    const token = await SecureStore.getItemAsync("token");
    if (!token) return;

    await fetch(`${API_URL}/api/pings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed ?? undefined,
        recordedAt: new Date().toISOString(),
      }),
    }).catch((err) => console.warn("Ping failed:", err));
  };

  const loadDriverInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/");
        return;
      }

      const res = await fetch(`${API_URL}/api/driver/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.replace("/");
        return;
      }

      const data = await res.json();
      setDriver(data);
    } catch (e) {
      Alert.alert("Error", "Unable to load driver details.");
    } finally {
      setLoading(false);
    }
  };

  const handleTripToggle = async () => {
    try {
      setTripLoading(true);
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/");
        return;
      }

      if (!tripActive) {
        const res = await fetch(`${API_URL}/api/trips/start`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to start trip");

        const data = await res.json();
        setTripId(data.tripId ?? data.id ?? null);
        setTripActive(true);
      } else {
        const res = await fetch(`${API_URL}/api/trips/end`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tripId }),
        });

        if (!res.ok) throw new Error("Failed to end trip");

        setTripId(null);
        setTripActive(false);
      }
    } catch {
      Alert.alert(
        "Trip update failed",
        tripActive ? "Unable to end trip." : "Unable to start trip."
      );
    } finally {
      setTripLoading(false);
    }
  };

  const initials =
    driver?.name
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

      {/* Trip Status Badge */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, tripActive && styles.statusDotActive]} />
        <Text style={[styles.statusText, tripActive && styles.statusTextActive]}>
          {tripActive ? "Trip Active" : "Trip Not Started"}
        </Text>
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

      {/* Tracking Status */}
      <View style={[styles.trackingBox, tripActive && styles.trackingBoxActive]}>
        <MaterialCommunityIcons
          name={tripActive ? "navigation" : "navigation-outline"}
          size={20}
          color={tripActive ? "#16a34a" : "#999"}
        />
        <Text style={[styles.trackingText, tripActive && styles.trackingTextActive, !locationPermission && styles.trackingTextDenied]}>
          {!locationPermission
            ? "Location permission denied — tracking unavailable"
            : tripActive
            ? "Location tracking is active"
            : "Start your trip to begin tracking"}
        </Text>
      </View>

      {/* Start / End Trip Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, tripActive && styles.buttonEnd]}
          onPress={handleTripToggle}
          disabled={tripLoading}
          activeOpacity={0.85}
        >
          {tripLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons
                name={tripActive ? "stop-circle-outline" : "play-circle-outline"}
                size={22}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>
                {tripActive ? "End Trip" : "Start Trip"}
              </Text>
            </>
          )}
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
    backgroundColor: "#ccc",
    marginRight: 6,
  },

  statusDotActive: {
    backgroundColor: "#22c55e",
  },

  statusText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
  },

  statusTextActive: {
    color: "#22c55e",
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
    marginBottom: 16,
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

  trackingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  trackingBoxActive: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },

  trackingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  trackingTextActive: {
    color: "#16a34a",
  },

  trackingTextDenied: {
    color: "#dc2626",
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

  buttonEnd: {
    backgroundColor: "#dc2626",
    shadowColor: "#dc2626",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
