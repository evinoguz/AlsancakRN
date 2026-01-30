import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {Colors} from '../../theme/colors';
import CustomInput from '../../components/ui/customInput';
import {Search} from '../../assets/icons';
import CarikartCard from '../../components/reports/carikartCard';
import {defaultStyles} from '../../styles/defaultStyle';
import {useGetAllCariKartQuery} from '../../store/slices/cariListSlice';
import {normalizeText} from '../../utils/functions';
import SumCountArea from '../../components/ui/sumCountArea';
import ListEmptyArea from '../../components/ui/listEmptyArea';
import {SkeletonCard} from '../../components/table/skeletonCard';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const CariList = () => {
  const [search, setSearch] = useState('');
  const {
    data: carikartAll,
    isLoading,
    isFetching,
    error,
  } = useGetAllCariKartQuery();

  // Data hazırlığı
  const carikartItems = useMemo(() => {
    if (isLoading || isFetching || error) {
      return [];
    }
    return carikartAll || [];
  }, [isLoading, isFetching, error, carikartAll]);

  // Filtreleme
  const filteredItems = useMemo(() => {
    const q = normalizeText(search);
    return carikartItems.filter(item => normalizeText(item.un).includes(q));
  }, [search, carikartItems]);

  // Layout animasyonu
  const prevLoading = useRef(isLoading && isFetching);
  useEffect(() => {
    if (prevLoading.current !== isLoading) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevLoading.current = isLoading;
    }
  }, [isLoading]);
  const isSkeletonVisible = isLoading || isFetching;
  return (
    <SafeAreaView style={defaultStyles.mainContainer}>
      {/* Arama Alanı */}
      <View style={defaultStyles.searchContainer}>
        <CustomInput
          onChangeText={setSearch}
          value={search}
          label=""
          placeholder="Ünvan ara"
          icon={<Search stroke={Colors.GRAY} width={15} height={15} />}
          clearButton
        />
      </View>

      {/* Kayıt Sayısı */}
      <SumCountArea items={filteredItems.length} />

      {/* Liste */}
      <View style={defaultStyles.container}>
        {isSkeletonVisible ? (
          <View>
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({item}) => <CarikartCard item={item} />}
            contentContainerStyle={{paddingBottom: 16}}
            ListEmptyComponent={<ListEmptyArea error={error} />}
            initialNumToRender={20}
            windowSize={20}
            maxToRenderPerBatch={20}
            removeClippedSubviews
          />
        )}
      </View>
    </SafeAreaView>
  );
};
