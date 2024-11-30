const obfuscateWrapper = require("webpack-obfuscator");

module.exports = {
  plugins: [
    new obfuscateWrapper(
      {
        rotateStringArray: true,
        stringArray: true,
        stringArrayThreshold: 0.7,
      },
      ["vendor.js"]
    ),
  ],
};
