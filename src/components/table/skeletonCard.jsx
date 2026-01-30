import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Colors} from '../../theme/colors';
import {width} from '../../utils/constants';

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

export const SkeletonCard = () => (
  <View style={styles.card}>
    <ShimmerPlaceholder style={styles.title} />
    <View style={{marginTop: 10}}>
      <ShimmerPlaceholder style={styles.desc} />
      <ShimmerPlaceholder style={styles.desc} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    width: width - 24,
    alignSelf: 'center',
    shadowColor: Colors.GRAY,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  title: {
    height: 18,
    borderRadius: 6,
    marginBottom: 10,
    width: '70%',
  },
  desc: {
    height: 14,
    borderRadius: 4,
    marginBottom: 10,
    width: '90%',
  },
});
