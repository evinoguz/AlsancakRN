import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {useGetAllCheckBookTakastakiQuery} from '../../store/slices/checkBookSlice';
import {Colors} from '../../theme/colors';
import {defaultStyles} from '../../styles/defaultStyle';
import CustomInput from '../ui/customInput';
import {Search} from '../../assets/icons';
import {ScrollableDataTable} from '../table/scrollableDataTable';
import {formatCurrency, formatDate, normalizeText} from '../../utils/functions';
import SumCountArea from '../ui/sumCountArea';
import ListEmptyArea from '../ui/listEmptyArea';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';

const CheckBookTakastaki = () => {
  const [search, setSearch] = useState('');

  const {
    data: checkBookTakastakiAll,
    isLoading,
    isFetching,
    error,
  } = useGetAllCheckBookTakastakiQuery();

  const checkBookTakastakiItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return checkBookTakastakiAll || [];
  }, [isLoading, isFetching, error, checkBookTakastakiAll]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return checkBookTakastakiItems.filter(item =>
      normalizeText(item.avkayit).includes(q),
    );
  }, [search, checkBookTakastakiItems]);

  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc.cgtut += item.cgtut || 0;
        return acc;
      },
      {cgtut: 0},
    );
  }, [filteredItems]);

  const COLUMN_WIDTHS = useResponsiveColumns({
    TARIH: {mobile: 0.3, tablet: 0.2},
    AVKAYIT: {mobile: 0.4, tablet: 0.3},
    CGTUT: {mobile: 0.3, tablet: 0.3},
    CNOSU: {mobile: 0.3, tablet: 0.2},
    CVADETAR: {mobile: 0.3, tablet: 0.25},
    CBANKA: {mobile: 0.4, tablet: 0.25},
    CVERTAR: {mobile: 0.3, tablet: 0.25},
    VKAYIT: {mobile: 0.3, tablet: 0.3},
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
      width: COLUMN_WIDTHS.CGTUT,
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
    {
      label: 'C.VER TARİHİ',
      width: COLUMN_WIDTHS.CVERTAR,
    },
    {
      label: 'V.KAYIT',
      width: COLUMN_WIDTHS.VKAYIT,
    },
  ];

  const labels = [{label: 'CG.TUTAR', key: 'first'}];

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
      text: formatCurrency(item.cgtut) || '0',
      width: COLUMN_WIDTHS.CGTUT,
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
    {
      text: formatDate(item.cvertar) || '',
      width: COLUMN_WIDTHS.CVERTAR,
      isCentered: true,
    },
    {
      text: item.vkayit || '',
      width: COLUMN_WIDTHS.VKAYIT,
    },
  ];

  return (
    <>
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
        totals={{first: totals.cgtut}}
        labels={labels}
        isLoading={isLoading || isFetching}
        ListEmptyComponent={<ListEmptyArea error={error} />}
        style={{minHeight: 300}}
      />
    </>
  );
};
export default CheckBookTakastaki;
