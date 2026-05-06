import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0];
};

const getFallbackHost = () => {
  if (Platform.OS === "android") {
    // Android emulator maps host machine localhost to 10.0.2.2
    return "10.0.2.2";
  }

  if (Platform.OS === "ios") {
    return "127.0.0.1";
  }

  return "localhost";
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  `http://${getExpoHost() || getFallbackHost()}:5000/api`;

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// console.log("API base URL:", API_BASE_URL);

// 🔍 Log request
API.interceptors.request.use(
  async (config) => {
    const isAuthRequest = config.url?.includes("/auth/");

    if (!isAuthRequest) {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // console.log("📤 REQUEST:", {
    //   url: config.url,
    //   method: config.method,
    //   data: config.data
    // });
    return config;
  },
  (error) => {
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// 🔍 Log response
API.interceptors.response.use(
  (response) => {
    // console.log("📥 RESPONSE:", {
    //   url: response.config.url,
    //   status: response.status,
    //   data: response.data
    // });
    return response;
  },
  (error) => {
    // console.log("❌ RESPONSE ERROR:", {
    //   message: error.message,
    //   data: error.response?.data
    // });
    return Promise.reject(error);
  }
);

export default API;