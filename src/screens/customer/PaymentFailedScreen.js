import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/common/Button';
import colors from '../../constants/colors';

const PaymentFailedScreen = ({ navigation }) => {
  const handleRetry = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate('HomeMain');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="close-circle" size={100} color={colors.danger} />
        </View>

        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.subtitle}>
          Your payment could not be processed. Please try again.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Common reasons for payment failure:
          </Text>
          <Text style={styles.infoItem}>• Insufficient balance</Text>
          <Text style={styles.infoItem}>• Network issues</Text>
          <Text style={styles.infoItem}>• Incorrect payment details</Text>
        </View>

        <Button
          title="Try Again"
          onPress={handleRetry}
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
    backgroundColor: colors.danger + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    marginTop: 4,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
});

export default PaymentFailedScreen;