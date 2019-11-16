"Illustrates how a reusable high-level workflow can be assembled from individual tools"

load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")
load("@npm_bazel_typescript//:index.bzl", "ts_library")

def differential_loading(name, entry_point, srcs):
    "Common workflow to serve TypeScript to modern browsers"

    ts_library(
        name = name + "_lib",
        srcs = srcs,
    )

    rollup_bundle(
        name = name + "_chunks",
        deps = [name + "_lib"],
        sourcemap = "inline",
        entry_points = {
            entry_point: "index",
        },
        output_dir = True,
    )
