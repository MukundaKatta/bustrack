import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
};

function formatCoordinates(location: Location.LocationObject): Coordinates {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy ?? null,
    timestamp: new Date(location.timestamp).toLocaleTimeString(),
  };
}

export default function HomeScreen() {
  const [foregroundPermission, setForegroundPermission] = useState<PermissionState>('idle');
  const [backgroundPermission, setBackgroundPermission] = useState<PermissionState>('idle');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [statusMessage, setStatusMessage] = useState('Requesting location access...');

  useEffect(() => {
    let mounted = true;
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      setForegroundPermission('requesting');
      setBackgroundPermission('idle');
      setStatusMessage('Requesting foreground location permission...');

      try {
        const foreground = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;

        if (!foreground.granted) {
          setForegroundPermission('denied');
          setBackgroundPermission('denied');
          setStatusMessage('Location permission was denied. Enable it in Settings to start driver tracking.');
          return;
        }

        setForegroundPermission('granted');
        setStatusMessage('Foreground permission granted. Requesting background access...');

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!mounted) return;

        setCoordinates(formatCoordinates(currentLocation));

        const background = await Location.requestBackgroundPermissionsAsync();
        if (!mounted) return;

        if (background.granted) {
          setBackgroundPermission('granted');
          setStatusMessage('Tracking active. Driver location is updating.');
        } else {
          setBackgroundPermission('denied');
          setStatusMessage('Tracking active while the app is open. Background permission was denied.');
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (nextLocation) => {
            if (!mounted) return;
            setCoordinates(formatCoordinates(nextLocation));
          },
        );
      } catch (error) {
        if (!mounted) return;

        setForegroundPermission('denied');
        setBackgroundPermission('denied');
        setStatusMessage(
          error instanceof Error
            ? error.message
            : 'Unable to start location tracking right now.',
        );
      }
    }

    void startTracking();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  const checkLocationServices = async () => {
    try {
      await Location.enableNetworkProviderAsync();
      setStatusMessage('Location services check completed. If GPS is on, tracking will keep updating.');
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Location services are not available right now.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>BusTrack Driver</Text>
        <Text style={styles.subtitle}>Live location permission and tracking</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Permission status</Text>
          <Text style={styles.label}>Foreground: {foregroundPermission}</Text>
          <Text style={styles.label}>Background: {backgroundPermission}</Text>
          <Text style={styles.status}>{statusMessage}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current GPS coordinates</Text>
          {coordinates ? (
            <>
              <Text style={styles.value}>Latitude: {coordinates.latitude.toFixed(6)}</Text>
              <Text style={styles.value}>Longitude: {coordinates.longitude.toFixed(6)}</Text>
              <Text style={styles.value}>
                Accuracy: {coordinates.accuracy ? `${Math.round(coordinates.accuracy)} m` : 'Unknown'}
              </Text>
              <Text style={styles.value}>Updated: {coordinates.timestamp}</Text>
            </>
          ) : (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#0f766e" />
              <Text style={styles.loadingText}>Waiting for GPS fix...</Text>
            </View>
          )}
        </View>

        {(foregroundPermission === 'denied' || backgroundPermission === 'denied') && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>If access is denied</Text>
            <Text style={styles.helpText}>
              The app stays on this screen and explains what is missing, so the driver is not blocked by a crash.
              After enabling permission in device settings, reopen the app to resume tracking.
            </Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={() => void checkLocationServices()}>
          <Text style={styles.buttonText}>Check device location services</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    gap: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  label: {
    fontSize: 15,
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  status: {
    fontSize: 14,
    color: '#0f766e',
    lineHeight: 20,
  },
  value: {
    fontSize: 15,
    color: '#1e293b',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  button: {
    marginTop: 'auto',
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
