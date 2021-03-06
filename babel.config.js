module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['babel-plugin-root-import', { rootPathSuffix: 'src' }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'babel-plugin-parameter-decorator',
    ],
  };
};
