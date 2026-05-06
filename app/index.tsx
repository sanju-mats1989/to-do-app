import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import API from "../services/api";
import { loginStyles as styles } from '../stylesheets/login.styles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [focusedField, setFocusedField] = useState<null | 'email' | 'password'>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    try {
      setIsLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      const user = res.data.user;

      // ✅ store token
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user || {}));

      auth.setFirstName(user?.firstName || '');
      auth.setLastName(user?.lastName || '');
      auth.setEmail(user?.email || email);

      // ✅ navigate
      router.replace('/(tabs)');

    } catch (err) {
      if (axios.isAxiosError(err)) {

        if (err.response?.data?.message) {
          alert(err.response.data.message);
        } else if (err.message === "Network Error") {
          alert("Cannot reach server. Check API URL and backend connection.");
        } else {
          alert("Login failed. Please try again.");
        }
      } else {
        alert("Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={60} color="#333" />
                </View>
                <Text style={styles.appName}>Task Manager</Text>
                {/* <Text style={styles.welcomeText}>Welcome Back</Text> */}
              </View>
            </View>

            {/* Login Card */}
            <Animated.View 
              style={[
                styles.card, 
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }] 
                }
              ]}
            >
              <Text style={styles.loginTitle}>Login</Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'email' && styles.inputFocused,
                  !!emailError && styles.inputError
                ]}>
                  <Feather name="mail" size={20} color={focusedField === 'email' ? '#2E9D9D' : '#A0A0A0'} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => {
                      setFocusedField('email');
                      setEmailError('');
                    }}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'password' && styles.inputFocused,
                  !!passwordError && styles.inputError
                ]}>
                  <Feather name="lock" size={20} color={focusedField === 'password' ? '#2E9D9D' : '#A0A0A0'} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => {
                      setFocusedField('password');
                      setPasswordError('');
                    }}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Feather 
                      name={isPasswordVisible ? 'eye' : 'eye-off'} 
                      size={20} 
                      color="#A0A0A0" 
                    />
                  </TouchableOpacity>
                </View>
                {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
};

export default LoginScreen;