import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

export const useResponsiveColumns = ratios => {
  const {width, height} = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  const isTablet = shortestSide >= 600;

  return useMemo(() => {
    // 📊 Toplam oranlar
    const totalTabletRatio = Object.values(ratios).reduce(
      (sum, r) => sum + r.tablet,
      0,
    );

    const shouldScrollOnTablet = totalTabletRatio > 1;

    // 📱 Mobile → her zaman scroll (px)
    if (!isTablet || shouldScrollOnTablet) {
      return Object.fromEntries(
        Object.keys(ratios).map(key => [key, width * ratios[key].mobile]),
      );
    }

    // 📲 Tablet → sığdır (oran normalize)
    return Object.fromEntries(
      Object.keys(ratios).map(key => [
        key,
        width * (ratios[key].tablet / totalTabletRatio),
      ]),
    );
  }, [width, isTablet, ratios]);
};
