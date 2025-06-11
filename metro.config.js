const { getDefaultConfig } = require('expo/metro-config'); // Nếu dùng Expo
// const { getDefaultConfig } = require('metro-config'); // Nếu React Native CLI

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = config.resolver;
  config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts = [...sourceExts, 'svg'];
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  return config;
})();