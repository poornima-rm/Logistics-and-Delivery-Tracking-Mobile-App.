import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchOrders, fetchDashboardStats } from '../../store/slices/ordersSlice';
import { fetchDrivers } from '../../store/slices/driversSlice';
import colors from '../../constants/colors';

const AdminDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { orders, stats, loading } = useSelector(state => state.orders);
  const { drivers } = useSelector(state => state.drivers);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchOrders({ role: 'admin', userId: null }));
    dispatch(fetchDashboardStats({ role: 'admin', userId: null }));
    dispatch(fetchDrivers());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>System Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
          <Icon name="cube-outline" size={32} color={colors.white} />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.warning }]}>
          <Icon name="time-outline" size={32} color={colors.white} />
          <Text style={styles.statValue}>{stats.placed}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
          <Icon name="car-outline" size={32} color={colors.white} />
          <Text style={styles.statValue}>{stats.shipped}</Text>
          <Text style={styles.statLabel}>In Transit</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.success }]}>
          <Icon name="checkmark-circle-outline" size={32} color={colors.white} />
          <Text style={styles.statValue}>{stats.delivered}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Drivers Overview</Text>
        <View style={styles.driversCard}>
          <View style={styles.driversStat}>
            <Icon name="people-outline" size={28} color={colors.primary} />
            <View style={styles.driversStatContent}>
              <Text style={styles.driversStatValue}>{drivers.length}</Text>
              <Text style={styles.driversStatLabel}>Active Drivers</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.driversStat}>
            <Icon name="cube-outline" size={28} color={colors.warning} />
            <View style={styles.driversStatContent}>
              <Text style={styles.driversStatValue}>
                {drivers.reduce((sum, d) => sum + d.assignedOrders, 0)}
              </Text>
              <Text style={styles.driversStatLabel}>Assigned Orders</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllOrders')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate('AllOrders', {
              screen: 'AdminOrderDetail',
              params: { orderId: order.id },
            })}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
              <View style={[styles.orderStatus, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.orderStatusText}>{order.status}</Text>
              </View>
            </View>
            <Text style={styles.orderCustomer}>{order.customerName}</Text>
            <Text style={styles.orderAddress} numberOfLines={1}>{order.address}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Drivers')}>
          <Icon name="people-outline" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Manage Drivers</Text>
          <Icon name="chevron-forward-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('AllOrders')}>
          <Icon name="list-outline" size={24} color={colors.primary} />
          <Text style={styles.quickActionText}>Manage Orders</Text>
          <Icon name="chevron-forward-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PLACED': return colors.warning;
    case 'SHIPPED': return colors.secondary;
    case 'DELIVERED': return colors.success;
    default: return colors.gray[400];
  }
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
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: -10,
  },
  statCard: {
    width: '47%',
    margin: '1.5%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  driversCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driversStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  driversStatContent: {
    marginLeft: 12,
  },
  driversStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  driversStatLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
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
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  orderCustomer: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 12,
  },
});

export default AdminDashboardScreen;