import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../constants/orderStatus';

const StatusTimeline = ({ currentStatus }) => {
  const statuses = [
    { key: ORDER_STATUS.PLACED, label: ORDER_STATUS_LABELS.PLACED, icon: 'checkmark-circle' },
    { key: ORDER_STATUS.SHIPPED, label: ORDER_STATUS_LABELS.SHIPPED, icon: 'car' },
    { key: ORDER_STATUS.DELIVERED, label: ORDER_STATUS_LABELS.DELIVERED, icon: 'gift' },
  ];

  const currentIndex = statuses.findIndex(s => s.key === currentStatus);

  return (
    <View style={styles.container}>
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex;
        const isLast = index === statuses.length - 1;

        return (
          <View key={status.key} style={styles.statusContainer}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
                <Icon
                  name={status.icon}
                  size={24}
                  color={isActive ? colors.white : colors.gray[400]}
                />
              </View>
              {!isLast && (
                <View style={[styles.line, isActive && styles.lineActive]} />
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {status.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconCircleActive: {
    backgroundColor: colors.primary,
  },
  line: {
    position: 'absolute',
    top: 25,
    left: 25,
    right: -50,
    height: 2,
    backgroundColor: colors.gray[300],
    zIndex: 1,
  },
  lineActive: {
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default StatusTimeline;