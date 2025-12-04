import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import {
  fetchOrderById,
  updateOrderStatus,
  assignDriver,
  deleteOrder as deleteOrderAction,
  clearCurrentOrder,
} from '../../store/slices/ordersSlice';
import { fetchDrivers } from '../../store/slices/driversSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import colors from '../../constants/colors';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import {
  formatDateTime,
  formatCurrency,
  getStatusLabel,
  getDeliveryTypeLabel,
  getPaymentMethodLabel,
} from '../../utils/helpers';

const AdminOrderDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { orderId } = route.params;
  const { currentOrder, loading } = useSelector(state => state.orders);
  const { drivers } = useSelector(state => state.drivers);

  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
    dispatch(fetchDrivers());

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, dispatch]);

  useEffect(() => {
    if (currentOrder) {
      setSelectedDriver(currentOrder.driverId || '');
      setSelectedStatus(currentOrder.status);
    }
  }, [currentOrder]);

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      Alert.alert('Error', 'Please select a driver');
      return;
    }

    try {
      await dispatch(assignDriver({ orderId, driverId: selectedDriver })).unwrap();
      
      dispatch(addNotification({
        message: 'Driver assigned successfully',
        type: 'success',
      }));

      dispatch(fetchOrderById(orderId));
    } catch (error) {
      Alert.alert('Error', 'Failed to assign driver');
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === currentOrder.status) {
      Alert.alert('Info', 'Status is already set to this value');
      return;
    }

    try {
      await dispatch(updateOrderStatus({ orderId, status: selectedStatus })).unwrap();
      
      dispatch(addNotification({
        message: `Order status updated to ${getStatusLabel(selectedStatus)}`,
        type: 'success',
      }));

      dispatch(fetchOrderById(orderId));
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleDeleteOrder = () => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteOrderAction(orderId)).unwrap();
              
              dispatch(addNotification({
                message: 'Order deleted successfully',
                type: 'success',
              }));

              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete order');
            }
          },
        },
      ]
    );
  };

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="person-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Customer Name</Text>
              <Text style={styles.infoValue}>{currentOrder.customerName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>{currentOrder.address}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="cube-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Package Details</Text>
              <Text style={styles.infoValue}>
                {currentOrder.packageDetails || 'Not specified'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="car-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Delivery Type</Text>
              <Text style={styles.infoValue}>
                {getDeliveryTypeLabel(currentOrder.deliveryType)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="card-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>
                {getPaymentMethodLabel(currentOrder.paymentMethod)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="cash-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Amount</Text>
              <Text style={styles.infoValue}>{formatCurrency(currentOrder.amount)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Order Date</Text>
              <Text style={styles.infoValue}>{formatDateTime(currentOrder.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assign Driver</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDriver}
            onValueChange={setSelectedDriver}
            style={styles.picker}>
            <Picker.Item label="Select a driver..." value="" />
            {drivers.map((driver) => (
              <Picker.Item
                key={driver.id}
                label={`${driver.name} - ${driver.vehicleNumber}`}
                value={driver.id}
              />
            ))}
          </Picker>
        </View>
        <Button
          title="Assign Driver"
          onPress={handleAssignDriver}
          style={styles.actionButton}
        />
        {currentOrder.driverName && (
          <Text style={styles.currentDriver}>
            Current Driver: {currentOrder.driverName}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={setSelectedStatus}
            style={styles.picker}>
            {Object.values(ORDER_STATUS).map((status) => (
              <Picker.Item
                key={status}
                label={ORDER_STATUS_LABELS[status]}
                value={status}
              />
            ))}
          </Picker>
        </View>
        <Button
          title="Update Status"
          onPress={handleUpdateStatus}
          style={styles.actionButton}
        />
      </View>

      {currentOrder.proofImageUri && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proof of Delivery</Text>
          <Image
            source={{ uri: currentOrder.proofImageUri }}
            style={styles.proofImage}
            resizeMode="cover"
          />
          <Text style={styles.deliveredText}>
            Delivered on {formatDateTime(currentOrder.updatedAt)}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Button
          title="Delete Order"
          onPress={handleDeleteOrder}
          variant="danger"
          style={styles.deleteButton}
        />
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
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  actionButton: {
    marginBottom: 8,
  },
  currentDriver: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  proofImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
  },
  deliveredText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
  deleteButton: {
    marginTop: 8,
  },
});

export default AdminOrderDetailScreen;