import type { LocationPing } from '@bustrack/shared';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PING_INTERVAL_MS = 30_000;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const PING_INTERVAL_LABEL = `${PING_INTERVAL_MS / 1000}-second`;

type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
  timestamp: string;
  isoTimestamp: string;
};

function formatCoordinates(location: Location.LocationObject): Coordinates {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracy: location.coords.accuracy ?? null,
    speed: location.coords.speed ?? null,
    timestamp: new Date(location.timestamp).toLocaleTimeString(),
    isoTimestamp: new Date(location.timestamp).toISOString(),
  };
}

function createPingPayload(coordinates: Coordinates): LocationPing {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    speed: coordinates.speed,
    timestamp: coordinates.isoTimestamp,
  };
}

export default function HomeScreen() {
  const [foregroundPermission, setForegroundPermission] = useState<PermissionState>('idle');
  const [backgroundPermission, setBackgroundPermission] = useState<PermissionState>('idle');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [statusMessage, setStatusMessage] = useState('Requesting location access...');
  const [tripActive, setTripActive] = useState(false);
  const [pendingPingCount, setPendingPingCount] = useState(0);
  const [lastPingStatus, setLastPingStatus] = useState('No ping sent yet.');

  const latestCoordinatesRef = useRef<Coordinates | null>(null);
  const pendingPingsRef = useRef<LocationPing[]>([]);
  const isSendingPingRef = useRef(false);

  const canTrack = foregroundPermission === 'granted';
  const pingReady = canTrack && Boolean(API_BASE_URL);

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

        const initialCoordinates = formatCoordinates(currentLocation);
        latestCoordinatesRef.current = initialCoordinates;
        setCoordinates(initialCoordinates);

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

            const nextCoordinates = formatCoordinates(nextLocation);
            latestCoordinatesRef.current = nextCoordinates;
            setCoordinates(nextCoordinates);
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

  const enqueueLatestPing = () => {
    const latestCoordinates = latestCoordinatesRef.current;

    if (!latestCoordinates) {
      setLastPingStatus('Trip is active, but GPS is not ready yet.');
      return;
    }

    pendingPingsRef.current.push(createPingPayload(latestCoordinates));
    setPendingPingCount(pendingPingsRef.current.length);
  };

  const flushPingQueue = async () => {
    if (!API_BASE_URL || isSendingPingRef.current || pendingPingsRef.current.length === 0) {
      return;
    }

    isSendingPingRef.current = true;

    try {
      while (pendingPingsRef.current.length > 0) {
        const nextPing = pendingPingsRef.current[0];
        const response = await fetch(`${API_BASE_URL}/api/pings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nextPing),
        });

        if (!response.ok) {
          throw new Error(`Ping failed with status ${response.status}`);
        }

        pendingPingsRef.current.shift();
        setPendingPingCount(pendingPingsRef.current.length);
        setLastPingStatus(`Last ping sent at ${new Date().toLocaleTimeString()}.`);
      }
    } catch (error) {
      setPendingPingCount(pendingPingsRef.current.length);
      setLastPingStatus(
        error instanceof Error
          ? `Network retry queued: ${error.message}`
          : 'Network retry queued for the next ping cycle.',
      );
    } finally {
      isSendingPingRef.current = false;
    }
  };

  useEffect(() => {
    if (!tripActive) {
      return;
    }

    if (!pingReady) {
      setLastPingStatus(
        API_BASE_URL
          ? 'Trip is active, but location permission is still required.'
          : 'Trip is active, but EXPO_PUBLIC_API_BASE_URL is not configured.',
      );
      return;
    }

    const runPingCycle = async () => {
      enqueueLatestPing();
      await flushPingQueue();
    };

    void runPingCycle();

    const interval = setInterval(() => {
      void runPingCycle();
    }, PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [tripActive, pingReady]);

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

  const toggleTrip = () => {
    setTripActive((previous) => {
      const next = !previous;

      if (!next) {
        pendingPingsRef.current = [];
        setPendingPingCount(0);
        setLastPingStatus('Trip stopped. Pending retries cleared.');
      } else {
        setLastPingStatus(`Trip active. Preparing ${PING_INTERVAL_LABEL} ping cycle.`);
      }

      return next;
    });
  };

  const tripStatusLabel = useMemo(() => {
    if (!tripActive) {
      return 'Inactive';
    }

    if (!pingReady) {
      return 'Blocked';
    }

    return 'Active';
  }, [pingReady, tripActive]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>BusTrack Driver</Text>
        <Text style={styles.subtitle}>Live location permission and trip ping tracking</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Permission status</Text>
          <Text style={styles.label}>Foreground: {foregroundPermission}</Text>
          <Text style={styles.label}>Background: {backgroundPermission}</Text>
          <Text style={styles.status}>{statusMessage}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trip ping status</Text>
          <Text style={styles.label}>Trip: {tripStatusLabel}</Text>
          <Text style={styles.label}>Queued retries: {pendingPingCount}</Text>
          <Text style={styles.label}>API base URL: {API_BASE_URL ?? 'Missing EXPO_PUBLIC_API_BASE_URL'}</Text>
          <Text style={styles.status}>{lastPingStatus}</Text>
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
              <Text style={styles.value}>
                Speed: {coordinates.speed !== null ? `${coordinates.speed.toFixed(2)} m/s` : 'Unknown'}
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

        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => void checkLocationServices()}>
            <Text style={styles.buttonText}>Check location services</Text>
          </Pressable>

          <Pressable
            style={[styles.button, tripActive ? styles.stopButton : styles.startButton]}
            onPress={toggleTrip}
          >
            <Text style={styles.buttonText}>{tripActive ? 'Stop trip' : 'Start trip'}</Text>
          </Pressable>
        </View>
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
  actions: {
    marginTop: 'auto',
    gap: 12,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#0f766e',
  },
  startButton: {
    backgroundColor: '#1d4ed8',
  },
  stopButton: {
    backgroundColor: '#b91c1c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
