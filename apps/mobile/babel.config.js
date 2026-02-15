module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    // Worklets plugin must be listed last.
    "react-native-worklets/plugin",
  ],
};
