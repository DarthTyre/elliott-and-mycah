load("@npm//rollup:index.bzl", "rollup")

def app_bundle(name, srcs, deps, config = "", config_deps = [], bundle_prefix = "app", plugins = [], plugin_deps = [], sourcemaps = False):
    """app_bundle runs rollup with outs

    Args:
        name: name of the build
        srcs: input files to bundle from
        deps: for the rollup build
        config: rollup config to use
        config_deps: dependencies used in the rollup config
        bundle_prefix: prefix to add to the begining of the bundle name
        plugins: plugins used in rollup configuration
        plugin_deps: dependencies for plugins
        sourcemaps: bool to add sourcemaps
    """

    plugin_args = []
    plugin_deps = []
    if plugins:
        for plugin in plugins:
            plugin_args.append("--plugin")
            plugin_args.append(plugin)
            plugin_deps.append("@npm//@rollup/plugin-" + plugin)

    input_files = []
    for src in srcs:
        input_files.append("$(locations " + src + ")")

    output_file = bundle_prefix + ".bundle.js"

    outs = [output_file]
    sourcemap_args = []
    if sourcemaps:
        outs.append(output_file + ".map")
        sourcemap_args.append("--sourcemap")
    
    config_args = []
    config_data = []
    if config != "":
        config_args.extend(["--config", "$(location " + config + ")"])
        config_data.append(config)

    rollup(
        name = name,
        outs = outs,
        args = config_args + [
            "--file",
            "$(location " + output_file + ")",
        ] + sourcemap_args + plugin_args + ["--"] + input_files,
        data = srcs + deps + plugin_deps + config_data + config_deps,
        visibility = ["//visibility:public"],
    )