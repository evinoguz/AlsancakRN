import React, {useMemo, useState} from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import {Colors} from '../../theme/colors';
import CustomInput from '../../components/ui/customInput';
import {Calendar, Search} from '../../assets/icons';
import {
  formatCurrency,
  formatDate,
  formatDisplayDate,
  formatPickerDate,
  getTodayDateString,
  normalizeText,
  parseDisplayDateToApiDate,
  subtractOneDay,
} from '../../utils/functions';
import {defaultStyles} from '../../styles/defaultStyle';
import {width} from '../../utils/constants';
import {ScrollableDataTable} from '../../components/table/scrollableDataTable';
import SumCountArea from '../../components/ui/sumCountArea';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import {
  useGetAllKasaQuery,
  useGetKasaDevirQuery,
  useGetKasaSumQuery,
} from '../../store/slices/kasaSlice.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useResponsiveColumns} from '../../hooks/useResponsiveColumns.js';

export const Kasa = () => {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [startDateText, setStartDateText] = useState(
    formatDisplayDate(getTodayDateString()),
  );

  const [endDate, setEndDate] = useState(getTodayDateString());
  const [endDateText, setEndDateText] = useState(
    formatDisplayDate(getTodayDateString()),
  );
  const [isStartVisible, setIsStartVisible] = useState(false);
  const [isEndVisible, setIsEndVisible] = useState(false);

  const {
    data: kasaAll,
    isLoading,
    isFetching,
    error,
  } = useGetAllKasaQuery({
    ilktarih: startDate,
    sontarih: endDate,
  });
  const {data: kasaDevirAll} = useGetKasaDevirQuery({
    tarih: subtractOneDay(startDate),
  });
  const {data: kasaSumAll} = useGetKasaSumQuery({
    ilktarih: startDate,
    sontarih: endDate,
    devnakit: kasaDevirAll?.devnakit ?? 0,
  });

  const kasaItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return kasaAll || [];
  }, [isLoading, isFetching, error, kasaAll]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return kasaItems.filter(item => normalizeText(item.unvan).includes(q));
  }, [search, kasaItems]);

  const COLUMN_WIDTHS = useResponsiveColumns({
    TARIH: {mobile: 0.3, tablet: 0.12},
    UNVAN: {mobile: 0.4, tablet: 0.22},
    HALNO: {mobile: 0.3, tablet: 0.12},
    GTUTAR: {mobile: 0.3, tablet: 0.14},
    CTUTAR: {mobile: 0.3, tablet: 0.14},
    HARTIP: {mobile: 0.3, tablet: 0.1},
    BILGI: {mobile: 0.4, tablet: 0.18},
    ACIKLAMA: {mobile: 0.4, tablet: 0.22},
  });

  const columns = [
    {
      label: 'TARİH',
      width: COLUMN_WIDTHS.TARIH,
    },
    {
      label: 'ÜNVAN',
      width: COLUMN_WIDTHS.UNVAN,
    },
    {
      label: 'G.TUTAR',
      width: COLUMN_WIDTHS.GTUTAR,
    },
    {
      label: 'Ç.TUTAR',
      width: COLUMN_WIDTHS.CTUTAR,
    },
    {
      label: 'HAR.TİP',
      width: COLUMN_WIDTHS.HARTIP,
    },
    {
      label: 'HALNO',
      width: COLUMN_WIDTHS.HALNO,
    },
    {
      label: 'BİLGİ',
      width: COLUMN_WIDTHS.BILGI,
    },
    {
      label: 'AÇIKLAMA',
      width: COLUMN_WIDTHS.ACIKLAMA,
    },
  ];

  const labels = [
    {label: 'DEVREDEN NAKİT', key: 'first'},
    {label: 'GÜNÜN NAKİTİ', key: 'second'},
    {label: 'KASADAKİ NAKİTİ', key: 'diff'},
  ];
  const renderRowCells = item => [
    {
      text: formatDate(item.tar) || '',
      width: COLUMN_WIDTHS.TARIH,
    },
    {
      text: item.unvan || '',
      width: COLUMN_WIDTHS.UNVAN,
    },
    {
      text: formatCurrency(item.gtut) || '',
      width: COLUMN_WIDTHS.GTUTAR,
      isCentered: true,
    },
    {
      text: formatCurrency(item.ctut) || '',
      width: COLUMN_WIDTHS.CTUTAR,
      isCentered: true,
    },
    {
      text: item.hartipi || '',
      width: COLUMN_WIDTHS.HARTIP,
    },
    {
      text: item.halno || '',
      width: COLUMN_WIDTHS.HALNO,
      isCentered: true,
    },
    {
      text: item.aciknot || '',
      width: COLUMN_WIDTHS.BILGI,
    },
    {
      text: item.acik || '',
      width: COLUMN_WIDTHS.ACIKLAMA,
    },
  ];
  const hideStartDatePicker = () => {
    setIsStartVisible(false);
  };
  const handleConfirmStartDate = date => {
    hideStartDatePicker();
    const apiDate = formatPickerDate(date); // 2025-12-24
    const displayDate = formatDisplayDate(apiDate); // 24.12.2025

    setStartDate(apiDate); // API için
    setStartDateText(displayDate); // Input için
  };

  const hideEndDatePicker = () => {
    setIsEndVisible(false);
  };

  const handleConfirmEndDate = date => {
    hideEndDatePicker();
    const apiDate = formatPickerDate(date);
    const displayDate = formatDisplayDate(apiDate);

    setEndDate(apiDate);
    setEndDateText(displayDate);
  };

  return (
    <SafeAreaView style={defaultStyles.mainContainer}>
      <View style={defaultStyles.searchContainer}>
        <View style={styles.row}>
          <CustomInput
            label="İLK TARİHİ"
            placeholder="GG.AA.YYYY"
            value={startDateText}
            onChangeText={text => {
              const cleaned = text.replace(/[^0-9.]/g, '');
              setStartDateText(cleaned);
              const apiDate = parseDisplayDateToApiDate(cleaned);
              if (apiDate) {
                setStartDate(apiDate);
              }
            }}
            icon={<Calendar stroke={Colors.GRAY} width={18} height={18} />}
            openModalOnIconPress
            onIconPress={() => setIsStartVisible(true)}
            style={{width: width * 0.46}}
          />

          <CustomInput
            label="SON TARİHİ"
            placeholder="GG.AA.YYYY"
            value={endDateText}
            onChangeText={text => {
              const cleaned = text.replace(/[^0-9.]/g, '');
              setEndDateText(cleaned);
              const apiDate = parseDisplayDateToApiDate(cleaned);
              if (apiDate) {
                setEndDate(apiDate);
              }
            }}
            icon={<Calendar stroke={Colors.GRAY} width={18} height={18} />}
            openModalOnIconPress
            onIconPress={() => setIsEndVisible(true)}
            style={{width: width * 0.46}}
          />
        </View>

        <DateTimePickerModal
          isVisible={isStartVisible}
          mode="date"
          date={new Date(startDate)}
          onConfirm={handleConfirmStartDate}
          onCancel={hideStartDatePicker}
        />

        <DateTimePickerModal
          mode="date"
          date={new Date(endDate)}
          onConfirm={handleConfirmEndDate}
          onCancel={hideEndDatePicker}
          isVisible={isEndVisible}
        />
        <CustomInput
          onChangeText={setSearch}
          value={search}
          label=""
          placeholder="Ünvan ara"
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
          first: kasaDevirAll?.devnakit ?? 0,
          second: kasaSumAll?.gunnakit ?? 0,
          diff: kasaSumAll?.kasanakit ?? 0,
          title: 'KASADAKİ NAKİT',
        }}
        labels={labels}
        isLoading={isLoading || isFetching}
        ListEmptyComponent={<ListEmptyArea error={error} />}
        style={{minHeight: 300}}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
