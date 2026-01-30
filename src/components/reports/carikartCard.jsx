import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {Map} from '../../assets/icons';
import {PhoneRow} from '../ui/phoneRow';

const CarikartCard = ({item}) => {
  const handleOpenAddress = address => {
    if (!address) {
      return;
    }
    const query = encodeURIComponent(address);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${query}`,
      android: `geo:0,0?q=${query}`,
    });
    Linking.openURL(url).catch(err =>
      console.warn('Haritalar açılırken hata:', err),
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cariUnvanText}>Cari Ünvanı:</Text>
        <Text style={styles.un}>{item.un}</Text>
      </View>

      <View style={styles.cardBody}>
        {item.adres?.trim() ? (
          <View style={styles.infoRow}>
            <View style={styles.ltRow}>
              <Map stroke={Colors.DARK_GRAY} width={12} height={12} />
              <Text style={styles.label}>Adres:</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleOpenAddress(item.adres)}
              style={styles.link}>
              <Text style={styles.text}>{item.adres.trim()}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <PhoneRow label="Cep Tel" phone={item.ctel} />
        <PhoneRow label="Tel1" phone={item.tel1} />
        <PhoneRow label="Tel2" phone={item.tel2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'flex-start',
    borderBottomWidth: 0.7,
    borderBottomColor: Colors.SOFT_GRAY,
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardBody: {marginTop: 5},
  un: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
    flex: 1,
    flexWrap: 'wrap',
  },
  cariUnvanText: {
    fontSize: 12,
    color: Colors.GRAY,
    marginRight: 5,
  },
  label: {fontSize: 12, fontWeight: '600', color: Colors.GRAY, width: 60},
  text: {
    fontWeight: '500',
    fontSize: 12,
    color: Colors.PRIMARY_LINK,
    flex: 1,
    flexWrap: 'wrap',
  },
  ltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  link: {
    flex: 1,
  },
});

export default CarikartCard;
