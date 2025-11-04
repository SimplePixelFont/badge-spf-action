const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const copy = require("rollup-plugin-copy");

module.exports = {
  input: "src/index.js",
  output: {
    esModule: false,
    file: "dist/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    commonjs(), 
    nodeResolve({ preferBuiltins: true }),
    copy({
      targets: [
        { src: 'node_modules/web-spf/node/*.wasm', dest: 'dist' }
      ]
    })
  ],
};
