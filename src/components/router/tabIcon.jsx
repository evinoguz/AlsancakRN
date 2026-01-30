import React from 'react';
import {TABNAVIGATOR} from '../../utils/route';
import {
  Archive,
  BarChart,
  Calendar,
  CheckBook,
  Kasa,
  List,
  MyCheckBook,
  Repeat,
  UserAvatar,
} from '../../assets/icons';

const TabIcon = ({color, route, focused}) => {
  const size = focused ? 20 : 18;
  switch (route.name) {
    case TABNAVIGATOR.MIZAN:
      return <BarChart size={size} stroke={color} />;
    case TABNAVIGATOR.CARI_EKTRE:
      return <Repeat size={size} stroke={color} />;
    case TABNAVIGATOR.CHECK_BOOK:
      return <CheckBook size={size} stroke={color} />;
    case TABNAVIGATOR.MY_CHECK_BOOK:
      return <MyCheckBook size={size} stroke={color} />;
    case TABNAVIGATOR.HAL_BORC_LIST:
      return <Archive size={size} stroke={color} />;
    case TABNAVIGATOR.CARI_LIST:
      return <List size={size} stroke={color} />;
    case TABNAVIGATOR.KASA:
      return <Kasa size={size} stroke={color} />;
    case TABNAVIGATOR.TAHSILAT:
      return <Calendar size={size} stroke={color} />;
    case TABNAVIGATOR.PROFILE:
      return <UserAvatar size={size} stroke={color} />;
    default:
      return null;
  }
};

export default TabIcon;
