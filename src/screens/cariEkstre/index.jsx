import React, {useMemo, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Colors} from '../../theme/colors';
import {Search} from '../../assets/icons';
import {defaultStyles} from '../../styles/defaultStyle';
import {formatCurrency, formatDate, normalizeText} from '../../utils/functions';
import {useGetAllCariKartQuery} from '../../store/slices/cariListSlice';
import {CustomDropDown} from '../../components/ui/customDropDown';
import {useGetAllCariEkstreQuery} from '../../store/slices/cariEkstreSlice';
import {height} from '../../utils/constants';
import {ScrollableDataTable} from '../../components/table/scrollableDataTable';
import CustomInput from '../../components/ui/customInput';
import SumCountArea from '../../components/ui/sumCountArea';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import {useResponsiveColumns} from '../../hooks/useResponsiveColumns';

export const CariEkstre = () => {
  const [searchCariId, setSearchCariId] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCariID, setSelectedCariID] = useState(null);
  const [modalCariList, setModalCariList] = useState(false);

  // Cari listesi çek
  const {
    data: cariList = [],
    isLoading: isCariListLoading,
    isFetching: isCariListFetching,
    error: cariListError,
  } = useGetAllCariKartQuery();

  // Ekstre çek
  const {
    data: cariEkstreAll = [],
    isLoading,
    isFetching,
    error,
  } = useGetAllCariEkstreQuery(
    {id: selectedCariID},
    {skip: !selectedCariID, refetchOnMountOrArgChange: true},
  );

  // Cari listesi hazırla
  const cariListItems = useMemo(() => {
    if (isCariListLoading || isCariListFetching || cariListError) {
      return [];
    }
    return cariList.map(c => ({
      label: c.un,
      value: c.id,
    }));
  }, [isCariListLoading, isCariListFetching, cariListError, cariList]);

  // Cari arama filtre
  const filteredCariItems = useMemo(() => {
    const q = normalizeText(searchCariId);
    return cariListItems.filter(item => normalizeText(item.label).includes(q));
  }, [searchCariId, cariListItems]);

  // Ekstre listesi hazırla
  const cariEkstreItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return cariEkstreAll;
  }, [isLoading, isFetching, error, cariEkstreAll]);

  // Ekstre arama filtre
  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return cariEkstreItems.filter(item =>
      normalizeText(item.aciknot).includes(q),
    );
  }, [search, cariEkstreItems]);

  // Toplam hesap
  const totals = useMemo(() => {
    const sum = filteredItems.reduce(
      (acc, item) => {
        acc.gtut += item.gtut || 0;
        acc.ctut += item.ctut || 0;
        return acc;
      },
      {gtut: 0, ctut: 0},
    );
    return {
      ...sum,
      diff: sum.ctut - sum.gtut,
    };
  }, [filteredItems]);

  // Tablo kolonları
  const COLUMN_WIDTHS = useResponsiveColumns({
    TARIH: {mobile: 0.3, tablet: 0.25},
    BILGI: {mobile: 0.4, tablet: 0.3},
    GTUTAR: {mobile: 0.3, tablet: 0.15},
    CTUTAR: {mobile: 0.3, tablet: 0.15},
    HARTIP: {mobile: 0.3, tablet: 0.15},
    FORMTUR: {mobile: 0.3, tablet: 0.15},
    ACIKLAMA: {mobile: 0.4, tablet: 0.25},
  });

  const columns = [
    {label: 'TARİH', width: COLUMN_WIDTHS.TARIH},
    {label: 'BİLGİ', width: COLUMN_WIDTHS.BILGI},
    {label: 'GİREN TUTAR', width: COLUMN_WIDTHS.GTUTAR},
    {label: 'ÇIKAN TUTAR', width: COLUMN_WIDTHS.CTUTAR},
    {label: 'HAR.TIP', width: COLUMN_WIDTHS.HARTIP},
    {label: 'FORM TÜR', width: COLUMN_WIDTHS.FORMTUR},
    {label: 'AÇIKLAMA', width: COLUMN_WIDTHS.ACIKLAMA},
  ];

  const labels = [
    {label: 'GIREN TIP TUTAR', key: 'first'},
    {label: 'ÇIKAN TIP TUTAR', key: 'second'},
    {label: 'BORÇLU', key: 'diff'},
  ];

  const renderRowCells = item => [
    {
      text: formatDate(item.tar) || '',
      width: COLUMN_WIDTHS.TARIH,
      extraDetail: item,
    },
    {text: item.aciknot || '', width: COLUMN_WIDTHS.BILGI},
    {
      text: formatCurrency(item.gtut) || '0',
      width: COLUMN_WIDTHS.GTUTAR,
      isCentered: true,
    },
    {
      text: formatCurrency(item.ctut) || '0',
      width: COLUMN_WIDTHS.CTUTAR,
      isCentered: true,
    },
    {
      text: item.hartipi || '',
      width: COLUMN_WIDTHS.HARTIP,
      isCentered: true,
    },
    {
      text: item.formtur || '',
      width: COLUMN_WIDTHS.FORMTUR,
      isCentered: true,
    },
    {
      text: item.acik || '',
      width: COLUMN_WIDTHS.ACIKLAMA,
    },
  ];

  return (
    <SafeAreaView style={defaultStyles.mainContainer}>
      {/* Cari DropDown */}
      <View style={defaultStyles.searchContainer}>
        <CustomDropDown
          label="Cari Kayıt Adı"
          items={filteredCariItems}
          selectedValue={selectedCariID}
          onSelect={val => setSelectedCariID(val)}
          modalVisible={modalCariList}
          setModalVisible={setModalCariList}
          searchable
          searchPlaceholder="Cari ara..."
          searchQuery={searchCariId}
          setSearchQuery={setSearchCariId}
          loading={isCariListLoading}
          error={cariListError}
          placeholder="Cari seçin"
        />
      </View>

      {/* Ekstre Tablosu */}
      {selectedCariID && (
        <View style={[defaultStyles.mainContainer]}>
          <View style={defaultStyles.searchContainer}>
            <CustomInput
              onChangeText={setSearch}
              value={search}
              label=""
              placeholder="Ara"
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
            totals={{
              first: totals.gtut,
              second: totals.ctut,
              diff: totals.diff,
            }}
            labels={labels}
            isLoading={isLoading || isFetching}
            isCentered={true}
            ListEmptyComponent={<ListEmptyArea error={error} />}
            style={{minHeight: height * 0.4}}
            showExpandButton={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
