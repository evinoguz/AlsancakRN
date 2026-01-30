// components/mizan/DetailTableView.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {formatCurrency, formatDate} from '../../../utils/functions';
import {width} from '../../../utils/constants';
import {DetailDataTable} from '../detailDataTable';
import {Colors} from '../../../theme/colors';
import {useResponsiveColumns} from '../../../hooks/useResponsiveColumns';

export const DetailTableViewTahsilat = ({
  detail,
  isLoading,
  ListEmptyComponent,
}) => {
  const COLUMN_WIDTHS = useResponsiveColumns({
    TARIH: {mobile: 0.2, tablet: 0.12},
    UN: {mobile: 0.3, tablet: 0.22},
    TAHSILTUTAR: {mobile: 0.25, tablet: 0.16},
    ODTUTAR: {mobile: 0.25, tablet: 0.16},
    SAYI: {mobile: 0.15, tablet: 0.1},
    ACIK: {mobile: 0.3, tablet: 0.18},
    BILGI: {mobile: 0.25, tablet: 0.16},
  });

  const columns = [
    {label: 'TARİH', width: COLUMN_WIDTHS.TARIH},
    {label: 'TAHS.KİŞİ | KAYIT', width: COLUMN_WIDTHS.UN},
    {label: 'TAHSİL T.', width: COLUMN_WIDTHS.TAHSILTUTAR},
    {label: 'ÖDENEN T.', width: COLUMN_WIDTHS.ODTUTAR},
    {label: 'SAYI', width: COLUMN_WIDTHS.SAYI},
    {label: 'AÇIK', width: COLUMN_WIDTHS.ACIK},
    {label: 'BİLGİ', width: COLUMN_WIDTHS.BILGI},
  ];

  const renderRowCells = item => [
    {
      text: formatDate(item.tar) || '',
      width: COLUMN_WIDTHS.TARIH,
      isCentered: true,
    },
    {
      text: item.un || '',
      width: COLUMN_WIDTHS.UN,
    },
    {
      text: formatCurrency(item.tutar) || '0',
      width: COLUMN_WIDTHS.TAHSILTUTAR,
      isCentered: true,
    },
    {
      text: formatCurrency(item.odtutar) || '0',
      width: COLUMN_WIDTHS.ODTUTAR,
      isCentered: true,
    },
    {
      text: item.sayi || '0',
      width: COLUMN_WIDTHS.SAYI,
      isCentered: true,
    },

    {
      text: item.acik || '',
      width: COLUMN_WIDTHS.ACIK,
    },
    {
      text: item.bilgi || '',
      width: COLUMN_WIDTHS.BILGI,
    },
  ];

  return (
    <View style={styles.detailContainer}>
      <DetailDataTable
        columns={columns}
        data={detail}
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
