import React, {useMemo, useState} from 'react';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import CustomInput from '../../components/ui/customInput';
import {Search} from '../../assets/icons';
import {formatCurrency, normalizeText} from '../../utils/functions';
import {useGetAllMizanQuery} from '../../store/slices/mizanSlice';
import {defaultStyles} from '../../styles/defaultStyle';
import {width} from '../../utils/constants';
import {ScrollableDataTable} from '../../components/table/scrollableDataTable';
import SumCountArea from '../../components/ui/sumCountArea';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import {PhoneRow} from '../../components/ui/phoneRow';
import { useResponsiveColumns } from '../../hooks/useResponsiveColumns';

export const Mizan = () => {
  const [search, setSearch] = useState('');
  const {data: mizanAll, isLoading, isFetching, error} = useGetAllMizanQuery();
  const mizanItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return mizanAll || [];
  }, [isLoading, isFetching, error, mizanAll]);

  const filteredItems = useMemo(() => {
    const q = normalizeText(search);

    return mizanItems.filter(item => {
      const un = normalizeText(item.un || '');
      const hno = normalizeText(item.hno || '');
      const ctel = normalizeText(item.ctel || '');
      const tel1 = normalizeText(item.tel1 || '');

      return (
        un.includes(q) ||
        hno.includes(q) ||
        ctel.includes(q) ||
        tel1.includes(q)
      );
    });
  }, [search, mizanItems]);

  const totals = useMemo(() => {
    const sum = filteredItems.reduce(
      (acc, item) => {
        acc.borc += item.borc || 0;
        acc.alacak += item.alacak || 0;
        return acc;
      },
      {borc: 0, alacak: 0},
    );

    return {
      ...sum,
      diff: sum.alacak - sum.borc,
    };
  }, [filteredItems]);

  const COLUMN_WIDTHS = useResponsiveColumns({
    UNVAN: {mobile: 0.4, tablet: 0.4},
    ALACAK: {mobile: 0.3, tablet: 0.3},
    BORC: {mobile: 0.3, tablet: 0.3},
  });

  const columns = [
    {
      label: 'ÜNVAN',
      width: COLUMN_WIDTHS.UNVAN,
    },
    {
      label: 'ALACAK TUTARI',
      width: COLUMN_WIDTHS.ALACAK,
    },
    {
      label: 'BORÇ TUTARI',
      width: COLUMN_WIDTHS.BORC,
    },
  ];
  const labels = [
    {label: 'TP.ALACAK', key: 'first'},
    {label: 'TP.BORC', key: 'second'},
    {label: 'TP.FARK', key: 'diff'},
  ];
  const renderRowCells = item => [
    {
      text: (
        <View style={{width: COLUMN_WIDTHS.UNVAN}}>
          {/* ÜNVAN */}
          <Text style={styles.textUn} numberOfLines={10}>
            {item.un}
          </Text>
          {/* ctel */}
          <PhoneRow phone={item.ctel} />
          {/* telcep1 */}
          <PhoneRow phone={item.tel1} />

          {/* HNO */}
          <Text style={{fontSize: 11, color: Colors.BLACK}} numberOfLines={10}>
            {item.hno}
          </Text>
        </View>
      ),
      copyText: item.un,
      width: COLUMN_WIDTHS.UNVAN,
    },
    {
      text: formatCurrency(item.alacak) || '0',
      width: COLUMN_WIDTHS.ALACAK,
      isCentered: true,
    },
    {
      text: formatCurrency(item.borc) || '0',
      width: COLUMN_WIDTHS.BORC,
      isCentered: true,
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
        totals={{
          first: totals.alacak,
          second: totals.borc,
          diff: totals.diff,
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
