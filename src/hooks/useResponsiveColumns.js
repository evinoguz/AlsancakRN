import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

const TABLET_BREAKPOINT = 768;

export const useResponsiveColumns = ratios => {
  const {width} = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  return useMemo(() => {
    // 📱 Mobile → direkt px (scroll)
    if (!isTablet) {
      return Object.fromEntries(
        Object.keys(ratios).map(key => [key, width * ratios[key].mobile]),
      );
    }

    // 📲 Tablet → oranla sığdır
    const total = Object.values(ratios).reduce((sum, r) => sum + r.tablet, 0);

    return Object.fromEntries(
      Object.keys(ratios).map(key => [
        key,
        width * (ratios[key].tablet / total),
      ]),
    );
  }, [width, isTablet, ratios]);
};
