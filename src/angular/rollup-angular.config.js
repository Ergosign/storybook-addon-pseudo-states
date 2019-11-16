import typescript from 'rollup-plugin-typescript';

module.exports = {
    output: {
    },
    plugins: [
        typescript()
    ],
    context: "window"
};
