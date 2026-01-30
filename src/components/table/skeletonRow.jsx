import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Colors} from '../../theme/colors';

const ShimmerPlaceholder = ({style}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.base, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{translateX}],
          },
        ]}
      />
    </View>
  );
};

export const SkeletonRow = ({columns}) => (
  <View style={styles.row}>
    {columns.map((col, i) => (
      <ShimmerPlaceholder
        key={i}
        style={[styles.cell, {flex: col.flex || 1}]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cell: {
    height: 14,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  base: {
    backgroundColor: Colors.SOFT_GRAY,
    overflow: 'hidden',
    borderRadius: 6,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
