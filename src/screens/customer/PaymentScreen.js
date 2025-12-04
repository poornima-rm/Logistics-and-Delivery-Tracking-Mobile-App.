import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { createOrder } from '../../store/slices/ordersSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import Button from '../../components/common/Button';
import colors from '../../constants/colors';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../../constants/deliveryTypes';

const PaymentScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.orders);
  const { orderData } = route.params;

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS.CARD);

  const getAmount = () => {
    const baseAmounts = {
      STANDARD: 99,
      EXPRESS: 299,
      SAME_DAY: 599,
    };
    return baseAmounts[orderData.deliveryType] || 99;
  };

  const handlePayment = async () => {
    // Simulate payment success/failure (80% success rate)
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      try {
        const completeOrderData = {
          ...orderData,
          customerId: user.id,
          customerName: user.name,
          paymentMethod: selectedMethod,
          amount: getAmount(),
        };

        await dispatch(createOrder(completeOrderData)).unwrap();
        
        dispatch(addNotification({
          message: 'Order placed successfully!',
          type: 'success',
        }));

        navigation.navigate('PaymentSuccess');
      } catch (error) {
        Alert.alert('Error', 'Failed to create order. Please try again.');
      }
    } else {
      navigation.navigate('PaymentFailed');
    }
  };

  const paymentIcons = {
    CARD: 'card-outline',
    UPI: 'phone-portrait-outline',
    COD: 'cash-outline',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Address:</Text>
              <Text style={styles.summaryValue}>{orderData.address.substring(0, 40)}...</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package Details:</Text>
              <Text style={styles.summaryValue}>
                {orderData.packageDetails || 'Not specified'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {Object.values(PAYMENT_METHODS).map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                selectedMethod === method && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedMethod(method)}>
              <View style={styles.paymentLeft}>
                <Icon
                  name={paymentIcons[method]}
                  size={24}
                  color={selectedMethod === method ? colors.primary : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.paymentText,
                    selectedMethod === method && styles.paymentTextSelected,
                  ]}>
                  {PAYMENT_METHOD_LABELS[method]}
                </Text>
              </View>
              <View style={styles.radioOuter}>
                {selectedMethod === method && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{getAmount()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Pay ₹${getAmount()}`}
          onPress={handlePayment}
          loading={loading}
          style={styles.payButton}
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 12,
  },
  paymentTextSelected: {
    color: colors.primary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payButton: {
    width: '100%',
  },
});

export default PaymentScreen;