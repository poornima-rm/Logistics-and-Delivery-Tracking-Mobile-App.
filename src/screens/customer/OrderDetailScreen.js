import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchOrderById, clearCurrentOrder } from '../../store/slices/ordersSlice';
import StatusTimeline from '../../components/StatusTimeline';
import Loading from '../../components/common/Loading';
import colors from '../../constants/colors';
import {
  formatDateTime,
  formatCurrency,
  getStatusLabel,
  getDeliveryTypeLabel,
  getPaymentMethodLabel,
} from '../../utils/helpers';

const OrderDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { orderId } = route.params;
  const { currentOrder, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, dispatch]);

  if (loading || !currentOrder) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{currentOrder.id.slice(-8)}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{getStatusLabel(currentOrder.status)}</Text>
        </View>
      </View>

      <StatusTimeline currentStatus={currentOrder.status} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Icon name="calendar-outline" size={20} color={colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Order Date</Text>
              <Text style={styles.detailValue}>{formatDateTime(currentOrder.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="location-outline" size={20} color={colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Address</Text>
              <Text style={styles.detailValue}>{currentOrder.address}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="cube-outline" size={20} color={colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Package Details</Text>
              <Text style={styles.detailValue}>
                {currentOrder.packageDetails || 'Not specified'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="car-outline" size={20} color={colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Type</Text>
              <Text style={styles.detailValue}>
                {getDeliveryTypeLabel(currentOrder.deliveryType)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="card-outline" size={20} color={colors.text.secondary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>
                {getPaymentMethodLabel(currentOrder.paymentMethod)}
              </Text>
            </View>
          </View>

          {currentOrder.driverName && (
            <View style={styles.detailRow}>
              <Icon name="person-outline" size={20} color={colors.text.secondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Assigned Driver</Text>
                <Text style={styles.detailValue}>{currentOrder.driverName}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {currentOrder.proofImageUri && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proof of Delivery</Text>
          <View style={styles.proofCard}>
            <Image
              source={{ uri: currentOrder.proofImageUri }}
              style={styles.proofImage}
              resizeMode="cover"
            />
            <Text style={styles.proofText}>Delivered on {formatDateTime(currentOrder.updatedAt)}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{formatCurrency(currentOrder.amount)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
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
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  proofCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  proofImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.gray[200],
  },
  proofText: {
    fontSize: 14,
    color: colors.text.secondary,
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
});

export default OrderDetailScreen;