import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useGetTahsilatByMonthYearQuery} from '../../../store/slices/tahsilatSlice';
import {Minus, Plus} from '../../../assets/icons';
import {DetailTableViewTahsilat} from './detailTableViewTahsilat';
import ListEmptyArea from '../../ui/listEmptyArea';
import {Colors} from '../../../theme/colors';

export const TableRowTahsilat = ({
  cells,
  index,
  showExpandButton = false,
  isColor = true,
}) => {
  const [selectedParams, setSelectedParams] = useState(null); // {ay, yil}
  const [isExpanded, setIsExpanded] = useState(false);

  const rowBackground = index % 2 === 0 ? Colors.WHITE : Colors.LIGHT_WHITE;
  const tahsilatYil = cells[0]?.extraDetail?.yil;
  const tahsilatAy = cells[0]?.extraDetail?.ay;

  const {
    data: tahsilatDetail = [],
    isLoading,
    isFetching,
    error,
  } = useGetTahsilatByMonthYearQuery(
    {ay: selectedParams?.ay, yil: selectedParams?.yil},
    {skip: !selectedParams, refetchOnMountOrArgChange: true},
  );

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setSelectedParams({ay: tahsilatAy, yil: tahsilatYil});
    } else {
      setSelectedParams(null);
    }
    setIsExpanded(prev => !prev);
  };

  return (
    <View>
      <View
        style={[
          styles.container,
          isColor
            ? {backgroundColor: rowBackground}
            : {backgroundColor: Colors.YELLOW},
        ]}>
        {cells.map((cell, idx) => (
          <View
            key={idx}
            style={[
              showExpandButton ? styles.btncell : styles.cell,
              {width: cell.width},
              cell.isCentered && styles.centeredCell,
            ]}>
            {idx === 0 && showExpandButton ? (
              <View style={styles.dateWithButton}>
                <Pressable
                  onPress={handleToggleExpand}
                  hitSlop={10}
                  style={({pressed}) => [
                    styles.plusButtonWrapper,
                    pressed && {opacity: 0.8},
                  ]}>
                  <View style={styles.plusButton}>
                    {isExpanded ? (
                      <Minus stroke={Colors.WHITE} width={12} height={12} />
                    ) : (
                      <Plus stroke={Colors.WHITE} width={12} height={12} />
                    )}
                  </View>
                </Pressable>
                <Text
                  style={[styles.text, {color: cell.color || Colors.BLACK}]}>
                  {cell.text}
                </Text>
              </View>
            ) : (
              <Text style={[styles.text, {color: cell.color || Colors.BLACK}]}>
                {cell.text}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Detay Tablosu */}
      {showExpandButton && isExpanded && (
        <DetailTableViewTahsilat
          detail={tahsilatDetail}
          isLoading={isLoading || isFetching}
          index={index}
          ListEmptyComponent={
            <ListEmptyArea error={error} isColor={Colors.YELLOW} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  btncell: {
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  centeredCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
  },
  centerText: {
    textAlign: 'center',
  },
  dateWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  plusButtonWrapper: {
    paddingVertical: 10,
    borderRadius: 20,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButtonDisabled: {
    backgroundColor: Colors.PRIMARY_DISABLED,
  },
});
