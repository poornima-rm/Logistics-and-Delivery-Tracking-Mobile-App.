import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './common/Card';
import colors from '../constants/colors';
import { ORDER_STATUS_COLORS } from '../constants/orderStatus';
import { formatDate, formatCurrency, getStatusLabel, truncateText } from '../utils/helpers';

const OrderCard = ({ order, onPress }) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id.slice(-8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: ORDER_STATUS_COLORS[order.status] }]}>
          <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.address}>{truncateText(order.address, 60)}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.amount}>{formatCurrency(order.amount)}</Text>
        <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  date: {
    fontSize: 12,
    color: colors.text.light,
  },
});

export default OrderCard;