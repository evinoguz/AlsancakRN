import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../theme/colors';
import {Search} from '../../assets/icons';
import {defaultStyles} from '../../styles/defaultStyle';
import {formatCurrency, normalizeText} from '../../utils/functions';
import {CustomDropDown} from '../../components/ui/customDropDown';
import {height, width} from '../../utils/constants';
import {ScrollableDataTable} from '../../components/table/scrollableDataTable';
import CustomInput from '../../components/ui/customInput';
import SumCountArea from '../../components/ui/sumCountArea';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import {
  useGetAllHalQuery,
  useGetHalBagcariQuery,
} from '../../store/slices/halSlice.js';
import {PhoneRow} from '../../components/ui/phoneRow.jsx';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns.js';

export const HalciBorcList = () => {
  const [search, setSearch] = useState('');
  const [searchHalID, setSearchHalID] = useState('');
  const [selectedHalID, setSelectedHalID] = useState(null);
  const [modalHalKoduList, setModalHalKoduList] = useState(false);

  const {
    data: halList = [],
    isLoading: isHalListLoading,
    isFetching: isHalListFetching,
    error: halListError,
  } = useGetAllHalQuery();

  const {
    data: cariList = [],
    isLoading,
    isFetching,
    error,
  } = useGetHalBagcariQuery(
    {id: selectedHalID},
    {skip: !selectedHalID, refetchOnMountOrArgChange: true},
  );

  // Hal listesi hazırla
  const halListItems = useMemo(() => {
    if (isHalListLoading || isHalListFetching || halListError) {
      return [];
    }
    return halList.map(c => ({
      label: `${c.kodu} - ${c.un}`,
      kodu: c.kodu,
      value: c.id,
    }));
  }, [isHalListLoading, isHalListFetching, halListError, halList]);

  // Hal arama filtre
  const filteredHalItems = useMemo(() => {
    const q = normalizeText(searchHalID);
    return halListItems.filter(item => {
      const un = normalizeText(item.label || ''); // Ünvan
      const kodu = normalizeText(item.kodu || ''); // Kod
      return un.includes(q) || kodu.includes(q);
    });
  }, [searchHalID, halListItems]);

  // cariList listesi hazırla
  const cariListItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return cariList;
  }, [isLoading, isFetching, error, cariList]);

  // Carilist arama filtre
  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return cariListItems.filter(item => normalizeText(item.cadi).includes(q));
  }, [search, cariListItems]);
  // Toplam hesap
  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc.borclu += item.borclu || 0;
        return acc;
      },
      {borclu: 0},
    );
  }, [filteredItems]);

  // Tablo kolonları
  const COLUMN_WIDTHS = useResponsiveColumns({
    CARI_KAYIT: {mobile: 0.3, tablet: 0.25},
    ACIKLAMA: {mobile: 0.4, tablet: 0.45},
    BORC_TUTAR: {mobile: 0.3, tablet: 0.3},
  });

  const columns = [
    {label: 'CARİ KAYIT ADI', width: COLUMN_WIDTHS.CARI_KAYIT},
    {label: 'AÇIKLAMA', width: COLUMN_WIDTHS.ACIKLAMA},
    {label: 'BORÇ TUTARI', width: COLUMN_WIDTHS.BORC_TUTAR},
  ];
  const labels = [{label: 'TOPLAM BORÇ TUTARI', key: 'first'}];

  const renderRowCells = item => [
    {
      text: (
        <View style={{width: COLUMN_WIDTHS.CARI_KAYIT}}>
          {/* ÜNVAN */}
          <Text style={styles.textUn} numberOfLines={10}>
            {item.cadi}
          </Text>
          {/* ctel */}
          <PhoneRow phone={item.ctel} />
        </View>
      ),
      width: COLUMN_WIDTHS.CARI_KAYIT,
    },
    {text: item.acik1 || '', width: COLUMN_WIDTHS.ACIKLAMA},
    {
      text: formatCurrency(item.borclu) || '0',
      width: COLUMN_WIDTHS.BORC_TUTAR,
      isCentered: true,
    },
  ];

  return (
    <SafeAreaView style={defaultStyles.mainContainer}>
      {/* Hal DropDown */}
      <View style={defaultStyles.searchContainer}>
        <CustomDropDown
          label="Hal No - Halci Ünvan"
          items={filteredHalItems}
          selectedValue={selectedHalID}
          onSelect={val => setSelectedHalID(val)}
          modalVisible={modalHalKoduList}
          setModalVisible={setModalHalKoduList}
          searchable
          searchPlaceholder="Hal No veya Ünvanı ara..."
          searchQuery={searchHalID}
          setSearchQuery={setSearchHalID}
          loading={isHalListLoading}
          error={halListError}
          placeholder="Halci seçin"
        />
      </View>

      {/* Cari List Tablosu */}
      {selectedHalID && (
        <View style={[defaultStyles.mainContainer]}>
          <View style={defaultStyles.searchContainer}>
            <CustomInput
              onChangeText={setSearch}
              value={search}
              label=""
              placeholder="Cari Kayıt Adı Ara"
              icon={<Search stroke={Colors.GRAY} width={15} height={15} />}
              clearButton={true}
            />
          </View>

          {/* Kayıt sayısı */}
          <SumCountArea items={filteredItems.length} />

          <ScrollableDataTable
            columns={columns}
            data={filteredItems}
            renderRowCells={renderRowCells}
            totals={{first: totals.borclu}}
            labels={labels}
            isLoading={isLoading || isFetching}
            isCentered={true}
            ListEmptyComponent={<ListEmptyArea error={error} />}
            style={{minHeight: height * 0.4}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerWp: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    backgroundColor: Colors.LIGHT_GREEN,
    borderRadius: 5,
  },
  textUn: {
    fontSize: 11,
    color: Colors.BLACK,
  },
  textTel: {
    fontSize: 12,
    color: Colors.GREEN,
    marginRight: 6,
  },
  containerTel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
});
