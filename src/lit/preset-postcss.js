const presetPostcss = require('./dist/lit/preset-postcss');

// const { webpack, webpackFinal } = presetPostcss;
// module.exports = { webpack, webpackFinal };

const { webpackFinal } = presetPostcss;
module.exports = { webpackFinal };
