import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseURL = process.env.REACT_NATIVE_APP_API_BASE_URL
console.log('Base URL::', baseURL);
const instance = axios.create({
  baseURL: "https://backend-chat-app-4.onrender.com/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Thêm interceptor cho request (tự động đính kèm token)
instance.interceptors.request.use(
  async (config) => {
    try {
      // Lấy token từ SecureStorage hoặc AsyncStorage
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Thêm interceptor cho response (xử lý lỗi chung)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error)
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
        // Thêm logic xử lý khi token hết hạn
      } else if (status === 500) {
        console.error('Server error! Please try again later.');
      }
    } else {
      console.error('Network error or timeout! Check your connection.');
    }
    return Promise.reject(error);
  },
);

// Hàm giả lập lấy token từ AsyncStorage hoặc SecureStorage
const getToken = async () => {
  const token = await AsyncStorage.getItem("userToken")
  return token; // Thay thế bằng logic lấy token thực tế
};

export default instance;
