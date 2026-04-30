import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // 🚀 LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert('Please enter email and password');
        return;
      }

      console.log('Logging in...');

      // 🔹 TEMP MOCK API RESPONSE
      const response = {
        token: 'demo-token-123',
      };

      if (response.token) {
        // 🔐 Store token securely
        await SecureStore.setItemAsync('token', response.token);

        console.log('Token stored successfully');

        // 🚀 Navigate to home screen
        router.replace('/home');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.log(error);
      alert('Error logging in');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 🔹 HEADER */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="bus" size={32} color="#2d5be3" />
        <MaterialCommunityIcons
          name="map-marker"
          size={32}
          color="#2d5be3"
          style={{ marginLeft: 6 }}
        />
        <Text style={styles.title}>BusTrack</Text>
      </View>

      <Text style={styles.subtitle}>Driver Login</Text>

      {/* 🔹 EMAIL INPUT */}
      <View
        style={[
          styles.inputContainer,
          { borderColor: emailFocus ? '#2d5be3' : '#ccc' },
        ]}
      >
        <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
      </View>

      {/* 🔹 PASSWORD INPUT */}
      <View
        style={[
          styles.inputContainer,
          { borderColor: passwordFocus ? '#2d5be3' : '#ccc' },
        ]}
      >
        <MaterialCommunityIcons name="lock-outline" size={20} color="gray" />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
      </View>

      {/* 🔹 LOGIN BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#777',
    letterSpacing: 0.5,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },

  input: {
    marginLeft: 10,
    flex: 1,
  },

  button: {
    marginTop: 30,
    backgroundColor: '#2d5be3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,

    // Shadow (Android)
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});