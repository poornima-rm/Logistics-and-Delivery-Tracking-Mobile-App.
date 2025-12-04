import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from './common/Card';
import colors from '../constants/colors';
import { ORDER_STATUS_COLORS } from '../constants/orderStatus';
import { getStatusLabel, truncateText } from '../utils/helpers';

const DeliveryCard = ({ order, onPress }) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: ORDER_STATUS_COLORS[order.status] }]}>
          <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
        </View>
      </View>
      
      <View style={styles.customerInfo}>
        <Icon name="person-outline" size={16} color={colors.text.secondary} />
        <Text style={styles.customerName}>{order.customerName}</Text>
      </View>
      
      <View style={styles.addressInfo}>
        <Icon name="location-outline" size={16} color={colors.text.secondary} />
        <Text style={styles.address}>{truncateText(order.address, 50)}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginLeft: 8,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  address: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
});

export default DeliveryCard;