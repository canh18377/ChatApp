import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRegister, fetchLogin } from '../redux/api/authApi';
const baseURL = process.env.REACT_NATIVE_APP_API_BASE_URL;

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.authReducer.authenticated);
  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email không được để trống');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải ít nhất 6 ký tự');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };
  const handleEmailChange = (text) => {
    setEmail(text);

    if (!text) {
      setEmailError('Email không được để trống');
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setEmailError('Email không hợp lệ');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);

    if (!text) {
      setPasswordError('Mật khẩu không được để trống');
    } else if (text.length < 6) {
      setPasswordError('Mật khẩu phải ít nhất 6 ký tự');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = () => {
    const isValid = validateForm();
    if (isValid) {
      dispatch(fetchLogin({ email: email, password: password }));
    } else {
      console.log('Form không hợp lệ');
    }
  };
  useEffect(() => {
    if (authenticated) {
      setSuccessModalVisible(true);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  const handleGoogleLogin = () => {
    Linking.openURL(`https://backend-chat-app-4.onrender.com/api/auth/google`);
  };

  const handleFacebookLogin = () => {
    Linking.openURL(`https://backend-chat-app-4.onrender.com/api/auth/facebook`);
  };
  useEffect(() => {
    const handleDeepLink = async (event) => {
      if (event.url) {
        const url = event.url;
        const tokenPart = url.split('token=');
        if (tokenPart.length > 1) {
          const token = tokenPart[1];
          await AsyncStorage.setItem('userToken', token);
          setSuccessModalVisible(true);
          setSuccessModalVisible(false);
          // Sử dụng navigation.reset để xóa stack login khỏi lịch sử
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          console.log('No token found in the URL');
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeAllListeners('url', handleDeepLink);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Tiêu đề */}
      <Text>Đăng nhập</Text>

      {/* Input Email */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={handleEmailChange}
        mode="outlined"
        style={styles.input}
        error={!!emailError}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Input Password */}
      <TextInput
        label="Mật khẩu"
        value={password}
        onChangeText={handlePasswordChange}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        error={!!passwordError}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity>
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        icon="login"
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogin}
      >
        Đăng nhập
      </Button>

      {/* OR Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>hoặc</Text>
        <View style={styles.line} />
      </View>

      {/* Social login */}
      <Button
        mode="contained"
        icon={() => <Icon name="facebook" size={20} color="white" />}
        style={[styles.button, { backgroundColor: '#4267B2' }]}
        onPress={handleFacebookLogin}
      >
        Đăng nhập bằng Facebook
      </Button>

      <Button
        mode="contained"
        icon={() => <Icon name="google" size={20} color="white" />}
        style={[styles.button, { backgroundColor: '#DB4437' }]}
        onPress={handleGoogleLogin}
      >
        Đăng nhập bằng Google
      </Button>

      {/* Chuyển đến màn hình đăng ký */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{' '}
          <Text style={styles.registerLink} onPress={handleRegister}>
            Đăng ký
          </Text>
        </Text>
      </View>
      {/* Modal thông báo thành công */}
      {/* <SuccessModal visible={successModalVisible} message="Đăng nhập thành công!" /> */}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
    marginLeft: 4,
  },
  registerText: {
    fontSize: 14,
    color: '#444',
  },
  registerLink: {
    color: '#1e88e5',
    fontWeight: 'bold',
  },

  input: {
    marginVertical: 6,
  },
  forgotText: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    color: '#1e88e5',
  },
  button: {
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  or: {
    marginHorizontal: 10,
    color: '#666',
  },
  registerBtn: {
    marginTop: 8,
    borderColor: '#555',
  },
});
