import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

export const useResponsiveColumns = ratios => {
  const {width, height} = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  const isTablet = shortestSide >= 600;

  return useMemo(() => {
    return Object.fromEntries(
      Object.keys(ratios).map(key => [
        key,
        width * (isTablet ? ratios[key].tablet : ratios[key].mobile),
      ]),
    );
  }, [width, isTablet, ratios]);
};
