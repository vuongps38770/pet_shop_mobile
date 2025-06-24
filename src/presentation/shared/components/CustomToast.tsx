import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Toast from 'react-native-toast-message';

interface CustomToastProps {
  text1?: string;
  text2?: string;
  type?: 'success' | 'error' | 'info';
}

const CustomToast: React.FC<CustomToastProps> = ({ text1, text2, type = 'success' }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'info':
        return colors.app.primary.main;
      default:
        return colors.success;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    color: colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
});

export default CustomToast;
type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  text1?: string;
  text2?: string;
  type?: ToastType;
}

export const useToast = () => {
  return {
    show: (type: 'success' | 'error' | 'info', text1?: string, text2?: string) => {
      Toast.show({
        type,
        text1,
        text2,
      });
    }
  };
};

