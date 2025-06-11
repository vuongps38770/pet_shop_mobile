module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {

            app: './src/app',
            theme: './src/presentation/theme',
            shared: './src/presentation/shared'
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
