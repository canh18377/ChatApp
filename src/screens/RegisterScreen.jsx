import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { fetchRegister } from '../redux/api/authApi';
import { useDispatch } from 'react-redux';
const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const handleNameChange = (text) => {
    setName(text);
    if (!text.trim()) {
      setNameError('Họ và tên không được để trống');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text.trim()) {
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

    // Đồng thời kiểm tra lại confirmPassword nếu có nhập
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu');
    } else if (text !== password) {
      setConfirmPasswordError('Mật khẩu không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleRegister = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Họ và tên không được để trống');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email không được để trống');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Mật khẩu không được để trống');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải ít nhất 6 ký tự');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Mật khẩu không khớp');
      isValid = false;
    }

    if (!isValid) return;
    dispatch(fetchRegister({ email: email, password: password, userName: name }));

    navigation.navigate('LoginScreen');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Đăng ký</Text>

            <TextInput
              label="Họ và tên"
              value={name}
              onChangeText={handleNameChange}
              mode="outlined"
              style={styles.input}
              error={!!nameError}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <TextInput
              label="Email"
              value={email}
              onChangeText={handleEmailChange}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!emailError}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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

            <TextInput
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              error={!!confirmPasswordError}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}

            <Button mode="contained" onPress={handleRegister} style={styles.button}>
              Đăng ký
            </Button>

            <View style={styles.loginTextContainer}>
              <Text>
                Đã có tài khoản?{' '}
                <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
                  Đăng nhập
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginTop: -12,
    fontSize: 13,
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loginTextContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLink: {
    color: '#1e88e5',
    fontWeight: 'bold',
  },
});
