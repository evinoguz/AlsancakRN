import React, {useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../theme/colors';
import TabIcon from '../components/router/tabIcon';
import {TABNAVIGATOR} from '../utils/route';
import {
  CariEkstre,
  CariList,
  CheckBook,
  HalciBorcList,
  Kasa,
  Mizan,
  MyCheckBook,
  Profile,
  Tahsilat,
} from '../screens';
import ScrollableTabBar from '../components/router/ScrollableTabBar';
import {Platform, useWindowDimensions} from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const {width, height} = useWindowDimensions();
  const shortestSide = Math.min(width, height);
  const isMobile = shortestSide < 600;
  const renderTabBar = useCallback(
    props => <ScrollableTabBar {...props} />,
    [],
  );
  const tabBarStyle =
    Platform.OS === 'android'
      ? {
          paddingVertical: 4,
          paddingBottom: 6,
          height: 50,
        }
      : undefined;

  return (
    <Tab.Navigator
      initialRouteName={TABNAVIGATOR.MIZAN}
      tabBar={isMobile ? renderTabBar : undefined}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.BLACK,
        headerTitleAlign: 'center',
        tabBarStyle,
        headerShown: false,
        safeAreaInsets: {bottom: 0},
        tabBarIcon: ({size, color, focused}) => {
          return (
            <TabIcon
              focused={focused}
              color={color}
              size={isMobile ? size : size + 4}
              route={route}
            />
          );
        },
      })}>
      <Tab.Screen name={TABNAVIGATOR.MIZAN} component={Mizan} />
      <Tab.Screen name={TABNAVIGATOR.CARI_EKTRE} component={CariEkstre} />
      <Tab.Screen name={TABNAVIGATOR.KASA} component={Kasa} />
      <Tab.Screen name={TABNAVIGATOR.CHECK_BOOK} component={CheckBook} />
      <Tab.Screen name={TABNAVIGATOR.MY_CHECK_BOOK} component={MyCheckBook} />
      <Tab.Screen name={TABNAVIGATOR.HAL_BORC_LIST} component={HalciBorcList} />
      <Tab.Screen name={TABNAVIGATOR.TAHSILAT} component={Tahsilat} />
      <Tab.Screen name={TABNAVIGATOR.CARI_LIST} component={CariList} />
      <Tab.Screen name={TABNAVIGATOR.PROFILE} component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
