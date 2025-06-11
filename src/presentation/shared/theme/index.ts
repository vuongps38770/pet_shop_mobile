export * from './colors';
export * from './typography';
export * from './spacing';
export * from './sizes';

export const theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  sizes: require('./sizes').sizes,
}; 