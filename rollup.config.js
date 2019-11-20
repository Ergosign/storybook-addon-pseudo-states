import ts from "@wessberg/rollup-plugin-ts";
import dts from "rollup-plugin-dts";

module.exports = {
    output: {
    },
    plugins: [
        ts({
            /* Plugin options */
            // tsconfig: "tsconfig.json"
        })
        // dts()
    ],
    context: ["window", "react"]
};
