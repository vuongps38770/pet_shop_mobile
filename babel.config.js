module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {

            app: './src/app',
            theme: './src/presentation/shared/theme',
            shared: './src/presentation/shared'
          },
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
