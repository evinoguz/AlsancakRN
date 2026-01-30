import React from 'react';
import {View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {PhoneCall, Whatsapp} from '../../assets/icons';
import {Colors} from '../../theme/colors';

export const PhoneRow = ({label, phone}) => {
  const cleanPhone = (phone || '').trim();
  if (!cleanPhone) {
    return null;
  }
  const numericPhone = cleanPhone.replace(/[^0-9]/g, '');

  return (
    <View style={styles.infoRow}>
      {label && (
        <View style={styles.ltRow}>
          <PhoneCall stroke={Colors.DARK_GRAY} width={12} height={12} />
          <Text selectable style={styles.label}>
            {label}:
          </Text>
        </View>
      )}

      <View style={styles.containerTel}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${numericPhone}`)}>
          <Text style={styles.textTel}>{cleanPhone}</Text>
        </TouchableOpacity>
        {numericPhone.length >= 10 && ( // 🔹 Geçerli numara varsa sadece o zaman WhatsApp göster
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://wa.me/${numericPhone}`)}>
            <View style={styles.containerWp}>
              <Whatsapp width={14} height={14} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  ltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.GRAY,
    width: 60,
  },
  textTel: {
    fontSize: 12,
    color: Colors.GREEN,
    marginRight: 6,
  },
  containerTel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  containerWp: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    backgroundColor: Colors.LIGHT_GREEN,
    borderRadius: 5,
  },
});
