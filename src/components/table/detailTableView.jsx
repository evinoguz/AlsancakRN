// components/mizan/DetailTableView.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import {DetailDataTable} from './detailDataTable';
import {width} from '../../utils/constants';
import {formatCurrency} from '../../utils/functions';
import {useResponsiveColumns} from '../../hooks/useResponsiveColumns';

export const DetailTableView = ({
  cariEkstreDetail,
  isLoading,
  ListEmptyComponent,
}) => {
  const COLUMN_WIDTHS = useResponsiveColumns({
    STOKID: {mobile: 0.2, tablet: 0.22},
    MIKTAR: {mobile: 0.2, tablet: 0.18},
    NETFIYAT: {mobile: 0.2, tablet: 0.2},
    NETTUTAR: {mobile: 0.2, tablet: 0.2},
    TUR: {mobile: 0.2, tablet: 0.2},
  });

  const columns = [
    {label: 'STOK ADI', width: COLUMN_WIDTHS.STOKID},
    {label: 'MIKTAR', width: COLUMN_WIDTHS.MIKTAR},
    {label: 'NET FIYAT', width: COLUMN_WIDTHS.NETFIYAT},
    {label: 'NET TUTAR', width: COLUMN_WIDTHS.NETTUTAR},
    {label: 'TUR', width: COLUMN_WIDTHS.TUR},
  ];

  const renderRowCells = item => [
    {
      text: item.stokid || '',
      width: COLUMN_WIDTHS.STOKID,
      isCentered: true,
    },
    {
      text: item.miktar || '0',
      width: COLUMN_WIDTHS.MIKTAR,
      isCentered: true,
    },
    {
      text: formatCurrency(item.netfiyat) || '0',
      width: COLUMN_WIDTHS.NETFIYAT,
      isCentered: true,
    },
    {
      text: formatCurrency(item.nettutar) || '0',
      width: COLUMN_WIDTHS.NETTUTAR,
      isCentered: true,
    },
    {text: item.tur || '', width: COLUMN_WIDTHS.TUR, isCentered: true},
  ];

  return (
    <View style={styles.detailContainer}>
      <DetailDataTable
        columns={columns}
        data={cariEkstreDetail}
        renderRowCells={renderRowCells}
        isLoading={isLoading}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    backgroundColor: Colors.YELLOW,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SOFT_GRAY,
  },
});
