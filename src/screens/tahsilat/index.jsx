import React, {useMemo, useState} from 'react';
import {SafeAreaView, Switch, Text, TouchableOpacity, View} from 'react-native';
import {defaultStyles} from '../../styles/defaultStyle';
import {formatCurrency} from '../../utils/functions';
import {height, width} from '../../utils/constants';
import {ScrollableDataTable} from '../../components/table/scrollableDataTable';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import {useGetAllTahsilatQuery} from '../../store/slices/tahsilatSlice';
import {Colors} from '../../theme/colors';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';

export const Tahsilat = () => {
  const {
    data: tahsilatAll,
    isLoading,
    isFetching,
    error,
  } = useGetAllTahsilatQuery();

  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(prev => {
      const newState = !prev;
      console.log(newState ? 'ON' : 'OFF');
      return newState;
    });
  };
  const tahsilatItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return tahsilatAll || [];
  }, [isLoading, isFetching, error, tahsilatAll]);

  // Toplam hesap
  const totals = useMemo(() => {
    const sum = tahsilatItems.reduce(
      (acc, item) => {
        acc.tut += item.tut || 0;
        acc.odtut += item.odtut || 0;
        return acc;
      },
      {tut: 0, odtut: 0},
    );
    return {
      ...sum,
      diff: sum.tut - sum.odtut,
    };
  }, [tahsilatItems]);

  // Tablo kolonları
  const COLUMN_WIDTHS = useResponsiveColumns({
    YIL: {mobile: 0.25, tablet: 0.12},
    AY: {mobile: 0.15, tablet: 0.08},
    AYLAR: {mobile: 0.25, tablet: 0.14},
    TAHSILATTUT: {mobile: 0.35, tablet: 0.18},
    ODTUT: {mobile: 0.35, tablet: 0.18},
    KALTUT: {mobile: 0.35, tablet: 0.18},
  });

  const columns = [
    {label: 'YIL', width: COLUMN_WIDTHS.YIL},
    {label: 'AY', width: COLUMN_WIDTHS.AY},
    {label: 'AYLAR', width: COLUMN_WIDTHS.AYLAR},
    {label: 'TAHSİLAT T.', width: COLUMN_WIDTHS.TAHSILATTUT},
    {label: 'ÖDENEN T.', width: COLUMN_WIDTHS.ODTUT},
    {label: 'KALAN T.', width: COLUMN_WIDTHS.KALTUT},
  ];

  const labels = [
    {label: 'TP.TAHSİLAT', key: 'first'},
    {label: 'TP.ÖDENEN', key: 'second'},
    {label: 'TP.KALAN', key: 'diff'},
  ];

  const renderRowCells = item => [
    {
      text: item.yil || '',
      width: COLUMN_WIDTHS.YIL,
      extraDetail: item,
    },
    {
      text: item.ay || '',
      width: COLUMN_WIDTHS.AY,
      isCentered: true,
    },
    {
      text: item.aylar || '',
      width: COLUMN_WIDTHS.AYLAR,
      isCentered: true,
    },
    {
      text: formatCurrency(item.tut) || '0',
      width: COLUMN_WIDTHS.TAHSILATTUT,
      isCentered: true,
    },
    {
      text: formatCurrency(item.odtut) || '0',
      width: COLUMN_WIDTHS.ODTUT,
      isCentered: true,
    },
    {
      text: formatCurrency(item.kaltut) || '0',
      width: COLUMN_WIDTHS.KALTUT,
      isCentered: true,
    },
  ];

  return (
    <SafeAreaView style={defaultStyles.mainContainer}>
      {/* Tahsilat Tablosu */}
      <View style={[defaultStyles.mainContainer]}>
        <View style={{paddingVertical: 34}}>
          <Text></Text>
        </View>
        {/* Üst kısım: Toggle Butonu */}
        {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingVertical: 10,
              marginVertical: 18,
            }}>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                marginRight: 10,
                color: Colors.BLACK,
              }}>
              Bildirimleri Göster
            </Text>
            <Switch
              value={isOn}
              onValueChange={handleToggle}
              trackColor={{false: Colors.GRAY, true: Colors.GRAY}}
              thumbColor={isOn ? Colors.LIGHT_GREEN : Colors.SOFT_GRAY}
            />
          </View> */}

        <ScrollableDataTable
          columns={columns}
          data={tahsilatItems}
          renderRowCells={renderRowCells}
          isTahsilat={true}
          totals={{
            first: totals.tut,
            second: totals.odtut,
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
    </SafeAreaView>
  );
};
