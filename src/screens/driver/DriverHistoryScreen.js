import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/ordersSlice';
import DeliveryCard from '../../components/DeliveryCard';
import Loading from '../../components/common/Loading';
import colors from '../../constants/colors';
import { ORDER_STATUS } from '../../constants/orderStatus';

const DriverHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { orders, loading } = useSelector(state => state.orders);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    dispatch(fetchOrders({ role: 'driver', userId: user.id }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // Filter only delivered orders for history
  const deliveredOrders = orders.filter(order => order.status === ORDER_STATUS.DELIVERED);

  if (loading && !refreshing && orders.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={deliveredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeliveryCard
            order={item}
            onPress={() => navigation.navigate('Deliveries', {
              screen: 'DeliveryDetail',
              params: { orderId: item.id },
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No delivery history</Text>
            <Text style={styles.emptySubtext}>
              Completed deliveries will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
  },
});

export default DriverHistoryScreen;