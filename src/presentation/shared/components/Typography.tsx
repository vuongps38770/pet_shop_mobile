import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'button' | 'caption';
type TypographyColor = 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'success';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  bold?: boolean;
  center?: boolean;
}

const getVariantStyles = (variant: TypographyVariant) => {
  switch (variant) {
    case 'h1':
      return {
        fontSize: 32,
        lineHeight: 40,
        fontFamily: Fonts.roboto.bold,
      };
    case 'h2':
      return {
        fontSize: 28,
        lineHeight: 36,
        fontFamily: Fonts.roboto.bold,
      };
    case 'h3':
      return {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: Fonts.roboto.bold,
      };
    case 'h4':
      return {
        fontSize: 20,
        lineHeight: 28,
        fontFamily: Fonts.roboto.bold,
      };
    case 'h5':
      return {
        fontSize: 18,
        lineHeight: 26,
        fontFamily: Fonts.roboto.bold,
      };
    case 'h6':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Fonts.roboto.bold,
      };
    case 'body1':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Fonts.roboto.regular,
      };
    case 'body2':
      return {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Fonts.roboto.regular,
      };
    case 'button':
      return {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Fonts.roboto.medium,
        textTransform: 'uppercase' as const,
      };
    case 'caption':
      return {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: Fonts.roboto.regular,
      };
    default:
      return {};
  }
};

const getColor = (color: TypographyColor) => {
  switch (color) {
    case 'primary':
      return colors.blue.main;
    case 'secondary':
      return colors.pink.main;
    case 'textPrimary':
      return colors.text.primary;
    case 'textSecondary':
      return colors.text.secondary;
    case 'error':
      return colors.red.main;
    case 'success':
      return colors.green.main;
    default:
      return colors.text.primary;
  }
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'textPrimary',
  bold = false,
  center = false,
  style,
  ...props
}) => {
  const variantStyles = getVariantStyles(variant);
  const colorValue = getColor(color);

  return (
    <Text
      style={[
        styles.base,
        variantStyles,
        { color: colorValue },
        bold && { fontFamily: Fonts.roboto.bold },
        center && { textAlign: 'center' },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: Fonts.roboto.regular,
  },
}); 