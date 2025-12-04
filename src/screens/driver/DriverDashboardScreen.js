import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchOrders, fetchDashboardStats } from '../../store/slices/ordersSlice';
import DeliveryCard from '../../components/DeliveryCard';
import Loading from '../../components/common/Loading';
import colors from '../../constants/colors';

const DriverDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { orders, stats, loading } = useSelector(state => state.orders);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchOrders({ role: 'driver', userId: user.id }));
    dispatch(fetchDashboardStats({ role: 'driver', userId: user.id }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filter only non-delivered orders for active deliveries
  const activeDeliveries = orders.filter(order => order.status !== 'DELIVERED');

  if (loading && !refreshing && orders.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name}!</Text>
          <Text style={styles.subGreeting}>
            {activeDeliveries.length} active {activeDeliveries.length === 1 ? 'delivery' : 'deliveries'}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBadge}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.statText}>{stats.delivered}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={activeDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeliveryCard
            order={item}
            onPress={() => navigation.navigate('DeliveryDetail', { orderId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="cube-outline" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyText}>No active deliveries</Text>
            <Text style={styles.emptySubtext}>
              New deliveries will appear here when assigned
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 6,
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DriverDashboardScreen;