import React, {useMemo, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Colors} from '../../theme/colors';
import CustomInput from '../../components/ui/customInput';
import {Search} from '../../assets/icons';
import {formatCurrency, formatDate, normalizeText} from '../../utils/functions';
import {defaultStyles} from '../../styles/defaultStyle';
import {width} from '../../utils/constants';
import {ScrollableDataTable} from '../../components/table/scrollableDataTable';
import {useGetAllMyCheckBookQuery} from '../../store/slices/myCheckBookSlice';
import SumCountArea from '../../components/ui/sumCountArea';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';

export const MyCheckBook = () => {
  const [search, setSearch] = useState('');
  const {
    data: myCheckBookAll,
    isLoading,
    isFetching,
    error,
  } = useGetAllMyCheckBookQuery();

  const myCheckBookItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return myCheckBookAll || [];
  }, [isLoading, isFetching, error, myCheckBookAll]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return myCheckBookItems.filter(item =>
      normalizeText(item.avkayit).includes(q),
    );
  }, [search, myCheckBookItems]);

  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc.cctut += item.cctut || 0;
        return acc;
      },
      {cctut: 0},
    );
  }, [filteredItems]);

  const COLUMN_WIDTHS = useResponsiveColumns({
    TARIH: {mobile: 0.3, tablet: 0.12},
    AVKAYIT: {mobile: 0.4, tablet: 0.22},
    CCTUT: {mobile: 0.3, tablet: 0.14},
    CNOSU: {mobile: 0.3, tablet: 0.14},
    CVADETAR: {mobile: 0.3, tablet: 0.14},
    CBANKA: {mobile: 0.4, tablet: 0.22},
  });

  const columns = [
    {
      label: 'TARİH',
      width: COLUMN_WIDTHS.TARIH,
    },
    {
      label: 'ÜNVAN',
      width: COLUMN_WIDTHS.AVKAYIT,
    },
    {
      label: 'CG.TUTARI',
      width: COLUMN_WIDTHS.CCTUT,
    },
    {
      label: 'C.NOSU',
      width: COLUMN_WIDTHS.CNOSU,
    },
    {
      label: 'C.VADE TARİHİ',
      width: COLUMN_WIDTHS.CVADETAR,
    },
    {
      label: 'C.BANKA',
      width: COLUMN_WIDTHS.CBANKA,
    },
  ];

  const labels = [{label: 'CC.TUTAR', key: 'first'}];

  const renderRowCells = item => [
    {
      text: formatDate(item.tar) || '',
      width: COLUMN_WIDTHS.TARIH,
    },
    {
      text: item.avkayit || '',
      width: COLUMN_WIDTHS.AVKAYIT,
    },
    {
      text: formatCurrency(item.cctut) || '0',
      width: COLUMN_WIDTHS.CCTUT,
      isCentered: true,
    },
    {
      text: item.cnosu || '',
      width: COLUMN_WIDTHS.CNOSU,
      isCentered: true,
    },
    {
      text: formatDate(item.cvadetar) || '',
      width: COLUMN_WIDTHS.CVADETAR,
      isCentered: true,
    },
    {
      text: item.cbanka || '',
      width: COLUMN_WIDTHS.CBANKA,
    },
  ];

  return (
    <SafeAreaView style={defaultStyles.mainContainer}>
      <View style={defaultStyles.searchContainer}>
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
        totals={{first: totals.cctut}}
        labels={labels}
        isLoading={isLoading || isFetching}
        ListEmptyComponent={<ListEmptyArea error={error} />}
        style={{minHeight: 300}}
      />
    </SafeAreaView>
  );
};
