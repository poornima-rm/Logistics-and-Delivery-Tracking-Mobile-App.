import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import colors from '../../constants/colors';
import { DELIVERY_TYPES, DELIVERY_TYPE_LABELS } from '../../constants/deliveryTypes';
import { validateAddress } from '../../utils/validators';

const CreateOrderScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    address: user.address || '',
    deliveryType: DELIVERY_TYPES.STANDARD,
    packageDetails: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (!validateAddress(formData.address)) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validate()) {
      navigation.navigate('Payment', { orderData: formData });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Input
            label="Complete Address"
            value={formData.address}
            onChangeText={(value) => updateField('address', value)}
            placeholder="Enter full delivery address"
            multiline
            numberOfLines={3}
            error={errors.address}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Type</Text>
          {Object.values(DELIVERY_TYPES).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                formData.deliveryType === type && styles.optionSelected,
              ]}
              onPress={() => updateField('deliveryType', type)}>
              <View style={styles.radioOuter}>
                {formData.deliveryType === type && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    formData.deliveryType === type && styles.optionTextSelected,
                  ]}>
                  {DELIVERY_TYPE_LABELS[type]}
                </Text>
                <Text style={styles.optionSubtext}>
                  {type === DELIVERY_TYPES.STANDARD && '3-5 business days'}
                  {type === DELIVERY_TYPES.EXPRESS && '1-2 business days'}
                  {type === DELIVERY_TYPES.SAME_DAY && 'Delivered today'}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionPrice,
                  formData.deliveryType === type && styles.optionPriceSelected,
                ]}>
                {type === DELIVERY_TYPES.STANDARD && '₹99'}
                {type === DELIVERY_TYPES.EXPRESS && '₹299'}
                {type === DELIVERY_TYPES.SAME_DAY && '₹599'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details (Optional)</Text>
          <Input
            value={formData.packageDetails}
            onChangeText={(value) => updateField('packageDetails', value)}
            placeholder="Describe your package (optional)"
            multiline
            numberOfLines={2}
          />
        </View>

        <Button
          title="Proceed to Payment"
          onPress={handleProceed}
          style={styles.proceedButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  optionSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  optionPriceSelected: {
    color: colors.primary,
  },
  proceedButton: {
    margin: 20,
  },
});

export default CreateOrderScreen;