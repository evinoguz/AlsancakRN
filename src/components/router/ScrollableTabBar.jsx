// components/router/ScrollableTabBar.js
import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import TabIcon from './tabIcon';
import {Colors} from '../../theme/colors';

const ScrollableTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}>
              <TabIcon
                route={route}
                focused={isFocused}
                color={isFocused ? Colors.PRIMARY : Colors.BLACK}
                size={22}
              />
              <Text
                style={[
                  styles.label,
                  {color: isFocused ? Colors.PRIMARY : Colors.BLACK},
                ]}>
                {options.title || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ScrollableTabBar;

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderTopWidth: 0.5,
    borderColor: Colors.SOFT_GRAY,
    backgroundColor: Colors.WHITE,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tab: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
