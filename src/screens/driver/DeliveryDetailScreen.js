import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  fetchOrderById,
  updateOrderStatus,
  uploadProof,
  clearCurrentOrder,
} from '../../store/slices/ordersSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import colors from '../../constants/colors';
import { ORDER_STATUS } from '../../constants/orderStatus';
import { formatDateTime, getStatusLabel } from '../../utils/helpers';

const DeliveryDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { orderId } = route.params;
  const { currentOrder, loading } = useSelector(state => state.orders);
  const [uploading, setUploading] = useState(false);
  const [proofImage, setProofImage] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, dispatch]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      
      dispatch(addNotification({
        message: `Order status updated to ${getStatusLabel(newStatus)}`,
        type: 'success',
      }));

      // Refresh order details
      dispatch(fetchOrderById(orderId));
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const handleImageSelection = () => {
    Alert.alert(
      'Upload Proof',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
              launchCamera({ mediaType: 'photo', quality: 0.7 }, handleImageResponse);
            } else {
              Alert.alert('Permission Denied', 'Camera permission is required');
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, handleImageResponse);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      return;
    }

    if (response.assets && response.assets[0]) {
      setProofImage(response.assets[0]);
    }
  };

  const handleUploadProof = async () => {
    if (!proofImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);
    try {
      await dispatch(uploadProof({ orderId, imageUri: proofImage.uri })).unwrap();
      
      dispatch(addNotification({
        message: 'Proof of delivery uploaded successfully',
        type: 'success',
      }));

      setProofImage(null);
      dispatch(fetchOrderById(orderId));
    } catch (error) {
      Alert.alert('Error', 'Failed to upload proof');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !currentOrder) {
    return <Loading />;
  }

  const canUpdateToShipped = currentOrder.status === ORDER_STATUS.PLACED;
  const canUpdateToDelivered = currentOrder.status === ORDER_STATUS.SHIPPED;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{currentOrder.id.slice(-8)}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{getStatusLabel(currentOrder.status)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
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
            <Icon name="calendar-outline" size={20} color={colors.text.secondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Order Date</Text>
              <Text style={styles.infoValue}>{formatDateTime(currentOrder.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>

      {canUpdateToShipped && (
        <View style={styles.section}>
          <Button
            title="Mark as Shipped"
            onPress={() => handleStatusUpdate(ORDER_STATUS.SHIPPED)}
            style={styles.actionButton}
          />
        </View>
      )}

      {canUpdateToDelivered && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complete Delivery</Text>
          
          {proofImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: proofImage.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setProofImage(null)}>
                <Icon name="close-circle" size={32} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleImageSelection}>
              <Icon name="camera-outline" size={48} color={colors.primary} />
              <Text style={styles.uploadText}>Upload Proof of Delivery</Text>
              <Text style={styles.uploadSubtext}>Take a photo or choose from gallery</Text>
            </TouchableOpacity>
          )}

          {proofImage && (
            <Button
              title="Upload & Mark as Delivered"
              onPress={handleUploadProof}
              loading={uploading}
              style={styles.actionButton}
            />
          )}

          <Button
            title="Mark as Delivered (No Proof)"
            onPress={() => handleStatusUpdate(ORDER_STATUS.DELIVERED)}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      )}

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
  uploadBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  actionButton: {
    marginTop: 16,
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
});

export default DeliveryDetailScreen;