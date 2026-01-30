import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {useGetAllCheckBookKasadakiQuery} from '../../store/slices/checkBookSlice';
import {ScrollableDataTable} from '../table/scrollableDataTable';
import {formatCurrency, formatDate, normalizeText} from '../../utils/functions';
import {Colors} from '../../theme/colors';
import {defaultStyles} from '../../styles/defaultStyle';
import CustomInput from '../ui/customInput';
import {Search} from '../../assets/icons';
import SumCountArea from '../ui/sumCountArea';
import ListEmptyArea from '../ui/listEmptyArea';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';

const CheckBookKasadaki = () => {
  const [search, setSearch] = useState('');

  const {
    data: checkBookKasadakiAll,
    isLoading,
    isFetching,
    error,
  } = useGetAllCheckBookKasadakiQuery();

  const checkBookKasadakiItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return checkBookKasadakiAll || [];
  }, [isLoading, isFetching, error, checkBookKasadakiAll]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return checkBookKasadakiItems.filter(item =>
      normalizeText(item.avkayit).includes(q),
    );
  }, [search, checkBookKasadakiItems]);

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
    TARIH: {mobile: 0.3, tablet: 0.15},
    AVKAYIT: {mobile: 0.4, tablet: 0.3},
    CGTUT: {mobile: 0.3, tablet: 0.2},
    CNOSU: {mobile: 0.3, tablet: 0.2},
    CVADETAR: {mobile: 0.3, tablet: 0.15},
    CBANKA: {mobile: 0.4, tablet: 0.25},
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
export default CheckBookKasadaki;
