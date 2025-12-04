import React from 'react';
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
import { logout } from '../../store/slices/authSlice';
import colors from '../../constants/colors';

const AdminProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { stats } = useSelector(state => state.orders);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="shield-checkmark" size={40} color={colors.primary} />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>System Administrator</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.placed}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.delivered}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Information</Text>
        
        <View style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Icon name="person-outline" size={24} color={colors.primary} />
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Full Name</Text>
                <Text style={styles.menuValue}>{user.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Icon name="mail-outline" size={24} color={colors.primary} />
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Email</Text>
                <Text style={styles.menuValue}>{user.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Icon name="call-outline" size={24} color={colors.primary} />
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Phone</Text>
                <Text style={styles.menuValue}>{user.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Icon name="shield-checkmark-outline" size={24} color={colors.primary} />
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>Role</Text>
                <Text style={styles.menuValue}>Administrator</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Access</Text>
        
        <View style={styles.accessCard}>
          <View style={styles.accessItem}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.accessText}>Full Order Management</Text>
          </View>
          <View style={styles.accessItem}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.accessText}>Driver Assignment</Text>
          </View>
          <View style={styles.accessItem}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.accessText}>System Dashboard</Text>
          </View>
          <View style={styles.accessItem}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.accessText}>User Management</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
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
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuContent: {
    marginLeft: 16,
    flex: 1,
  },
  menuLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  menuValue: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  accessCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accessText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 8,
  },
});

export default AdminProfileScreen;