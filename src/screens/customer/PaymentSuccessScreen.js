import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/common/Button';
import colors from '../../constants/colors';

const PaymentSuccessScreen = ({ navigation }) => {
  const handleGoHome = () => {
    navigation.navigate('HomeMain');
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders', { screen: 'OrdersList' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="checkmark-circle" size={100} color={colors.success} />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            You will receive updates about your delivery via notifications
          </Text>
        </View>

        <Button
          title="View My Orders"
          onPress={handleViewOrders}
          style={styles.button}
        />

        <Button
          title="Back to Home"
          onPress={handleGoHome}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
});

export default PaymentSuccessScreen;