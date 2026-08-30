import { StyleSheet } from 'react-native';

export const fontNames = {
  regular: 'PlusJakarta-Regular',
  bold: 'PlusJakarta-Bold',
};

export const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',

    left: 16,
    right: 16,

    height: 68,
    borderRadius: 16,

    backgroundColor: '#ffffff',

    paddingTop: 8,
    paddingBottom: 8,

    borderTopWidth: 0,

    // Android
    elevation: 8,

    // iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  tabBarLabel: {
    fontFamily: fontNames.bold,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  tabBarIconStyle: {
    marginBottom: -2,
  },
});

export const colors = {
  active: '#249057',
  inactive: '#9CA3AF',
};