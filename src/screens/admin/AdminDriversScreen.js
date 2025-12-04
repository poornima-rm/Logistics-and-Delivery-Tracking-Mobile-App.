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
import { fetchDrivers } from '../../store/slices/driversSlice';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import colors from '../../constants/colors';

const AdminDriversScreen = () => {
  const dispatch = useDispatch();
  const { drivers, loading } = useSelector(state => state.drivers);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    dispatch(fetchDrivers());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrivers();
    setRefreshing(false);
  };

  if (loading && !refreshing && drivers.length === 0) {
    return <Loading />;
  }

  const renderDriver = ({ item }) => (
    <Card style={styles.driverCard}>
      <View style={styles.driverHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item.name}</Text>
          <Text style={styles.driverDetail}>{item.email}</Text>
          <Text style={styles.driverDetail}>{item.phone}</Text>
        </View>
      </View>

      <View style={styles.driverStats}>
        <View style={styles.driverStat}>
          <Icon name="car-outline" size={20} color={colors.primary} />
          <Text style={styles.driverStatText}>{item.vehicleNumber}</Text>
        </View>

        <View style={styles.driverStat}>
          <Icon name="cube-outline" size={20} color={colors.warning} />
          <Text style={styles.driverStatText}>
            {item.assignedOrders} assigned
          </Text>
        </View>

        <View style={styles.driverStat}>
          <Icon name="checkmark-circle-outline" size={20} color={colors.success} />
          <Text style={styles.driverStatText}>
            {item.completedOrders} completed
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Drivers: <Text style={styles.summaryValue}>{drivers.length}</Text>
        </Text>
        <Text style={styles.summaryText}>
          Active Orders:{' '}
          <Text style={styles.summaryValue}>
            {drivers.reduce((sum, d) => sum + d.assignedOrders, 0)}
          </Text>
        </Text>
      </View>

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        renderItem={renderDriver}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyText}>No drivers found</Text>
            <Text style={styles.emptySubtext}>
              Drivers will appear here when added to the system
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
  summary: {
    backgroundColor: colors.white,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    padding: 16,
  },
  driverCard: {
    padding: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  driverInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  driverDetail: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  driverStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverStatText: {
    fontSize: 13,
    color: colors.text.primary,
    marginLeft: 6,
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
    paddingHorizontal: 40,
  },
});

export default AdminDriversScreen;