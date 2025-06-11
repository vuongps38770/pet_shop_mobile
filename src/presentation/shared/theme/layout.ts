import { Dimensions, StyleSheet } from 'react-native';
import { colors } from './colors';

const { width, height } = Dimensions.get('window');

export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
};

// Spacing
export const SPACING = {
  XS: 4,
  S: 8,
  M: 16,
  L: 24,
  XL: 32,
  XXL: 48,
};



// Border radius
export const BORDER_RADIUS = {
  XS: 4,
  S: 8,
  M: 12,
  L: 16,
  XL: 24,
  ROUND: 9999,
};

// Layout
export const LAYOUT = StyleSheet.create({
  // Container
  CONTAINER: {
    flex: 1,
    padding: SPACING.M,
  },
  
  // Row
  ROW: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ROW_BETWEEN: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ROW_CENTER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Column
  COLUMN: {
    flexDirection: 'column',
  },
  COLUMN_CENTER: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Card
  CARD: {
    padding: SPACING.M,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Input
  INPUT_CONTAINER: {
    marginBottom: SPACING.M,
  },
  INPUT: {
    height: 48,
    paddingHorizontal: SPACING.M,
    borderRadius: BORDER_RADIUS.S,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  // Button
  BUTTON: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BUTTON_PRIMARY: {
    backgroundColor: colors.blue.main,
  },
  BUTTON_SECONDARY: {
    backgroundColor: colors.background.default,
  },
  BUTTON_DANGER: {
    backgroundColor: colors.red.main,
  },
  BUTTON_SUCCESS: {
    backgroundColor: colors.green.main,
  },
  BUTTON_DISABLED: {
    opacity: 0.7,
  },
  
  // List
  LIST_CONTAINER: {
    flex: 1,
  },
  LIST_ITEM: {
    padding: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  // Header
  HEADER: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  // Bottom Tab
  BOTTOM_TAB: {
    height: 60,
    paddingBottom: SPACING.S,
    paddingTop: SPACING.S,
  },
  
  // Modal
  MODAL_CONTAINER: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  MODAL_CONTENT: {
    width: SCREEN.WIDTH * 0.9,
    padding: SPACING.M,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: 'white',
  },
}); 
