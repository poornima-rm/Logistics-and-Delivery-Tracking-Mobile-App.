import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP as verifyOTPAction, clearError } from '../../store/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import colors from '../../constants/colors';
import { validateOTP } from '../../utils/validators';

const OTPScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, otpVerified } = useSelector(state => state.auth);

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (otpVerified) {
      // Navigate to appropriate screen after OTP verification
      navigation.replace('Login');
    }
  }, [otpVerified, navigation]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!validateOTP(otp)) {
      newErrors.otp = 'Invalid OTP (must be 4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = () => {
    if (validate()) {
      dispatch(verifyOTPAction(otp));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to your phone
        </Text>
        <Text style={styles.hint}>(Use: 1234 for testing)</Text>

        <Input
          label="OTP"
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter 4-digit OTP"
          keyboardType="number-pad"
          error={errors.otp}
          style={styles.input}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          style={styles.verifyButton}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 30,
  },
  input: {
    width: '100%',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 16,
  },
  verifyButton: {
    width: '100%',
    marginBottom: 20,
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OTPScreen;