import { RuleSetCondition, RuleSetRule, RuleSetUse } from 'webpack';
import postcssPseudoClasses, {
  PostCssLoaderPseudoClassesPluginOptions,
} from 'postcss-pseudo-classes';

export interface CssLoaderOptions {
  // Enables/Disables url/image-set functions handling
  url?: boolean | (() => boolean);
  // Enables/Disables @import at-rules handling
  import?: boolean | (() => boolean);
  // Enables/Disables CSS Modules and their configuration
  modules?:
    | boolean
    | string
    | {
        localIdentName?: string;
        getLocalIdent?: () => string;
      };
  // Enables/Disables generation of source maps
  sourceMap?: boolean;
  // Enables/Disables or setups number of loaders applied before CSS loader
  importLoaders?: number;
  // Style of exported classnames
  localsConvention?: string;
  // Export only locals
  onlyLocals?: boolean;
  // Use ES modules syntax
  esModule?: boolean;
}

/**
 * Interface to enter PostCss Pseudo-States-Plugin Option to Storybook Preset
 */
export interface PseudoStatesPresetOptions {
  postCssLoaderPseudoClassesPluginOptions?: PostCssLoaderPseudoClassesPluginOptions;
  // rules to apply postcss plugin, if empty set to existing scss rules
  rules?: Array<RuleSetCondition>;
  cssLoaderOptions?: CssLoaderOptions;
  // webpack: 'webpack4' | 'webpack5';
}

const postCssLoaderName = 'postcss-loader';
export const postCSSOptionsDefault: PostCssLoaderPseudoClassesPluginOptions = {
  blacklist: [':root', ':host', ':host-context', ':nth-child', ':nth-of-type'],
};

const cssLoaderName = 'css-loader';
export const cssLoaderOptionsDefault: CssLoaderOptions = {
  modules: {
    // remove [hash] option
    // because hash is not predictable or definable for this addon
    localIdentName: '[path][name]__[local]',
    // getLocalIdent: () => '[path][name]__[local]',
  },
};

/**
 * Find all rules with matching condition
 *
 * @param rules of webpack config.
 * @param conditions of rules to find in webpack config.
 */
export const filterRules = (
  rules: Array<RuleSetRule>,
  conditions: Array<RuleSetCondition>
): Array<RuleSetRule> => {
  const ruleReferences: Array<RuleSetRule> = [];

  for (const rule of rules) {
    if (rule?.test) {
      const ruleCondition: RuleSetCondition = rule.test;

      // compare conditions item with rule
      for (let i = 0; i < conditions.length; i += 1) {
        const condition: RuleSetCondition = conditions[i];

        if (
          typeof condition === 'string' &&
          ruleCondition.toString().includes(condition as string)
        ) {
          ruleReferences.push(rule);
        } else if (condition instanceof RegExp && ruleCondition === condition) {
          ruleReferences.push(rule);
        }

        // TODO test if this is working for all types of ruleCondition
        else if (ruleCondition.toString() === condition.toString()) {
          ruleReferences.push(rule);
        }
      }
    }

    if (rule.oneOf) {
      const subRules = rule.oneOf;
      // for (const subRule of rule.oneOf) {
      const filteredSubRules = filterRules(subRules, conditions);
      // ruleReferences.push(...filteredSubRules);
      for (const filterdRule of filteredSubRules) {
        ruleReferences.push(filterdRule);
      }
    }
  }
  return ruleReferences;
};

/**
 * Check whether pseudo classes is already available in postcss plugins.
 */
const hasAlreadyPseudoClassesPlugin = (
  plugins: string | Array<string | Function> | Function | Object
): boolean => {
  if (typeof plugins === 'string') {
    return plugins.includes('pseudo-states');
  }
  if (Array.isArray(plugins)) {
    for (const e of plugins) {
      if (hasAlreadyPseudoClassesPlugin(e)) return true;
    }
  }
  if (typeof plugins === 'function' || typeof plugins === 'object') {
    // @ts-ignore
    return plugins?.postcssPlugin === 'postcss-pseudo-classes';
  }

  return false;
};

/**
 * Add postcss pseudo classes plugin options to post-css loader object
 * @param plugins
 * @param postCssLoaderOptions
 */
const addPostCssClassesPluginOptions = (
  plugins: string | Array<any> | Function | Object,
  postCssLoaderOptions: PostCssLoaderPseudoClassesPluginOptions
): string | Array<any> | Function | Object => {
  if (plugins) {
    if (typeof plugins === 'string') {
      if (!hasAlreadyPseudoClassesPlugin(plugins)) {
        // eslint-disable-next-line no-param-reassign
        plugins = [postcssPseudoClasses(postCssLoaderOptions)];
      }
    } else if (Array.isArray(plugins)) {
      if (!hasAlreadyPseudoClassesPlugin(plugins)) {
        plugins.push(postcssPseudoClasses(postCssLoaderOptions));
        plugins.push(() => postcssPseudoClasses(postCssLoaderOptions));
      }
    } else if (typeof plugins === 'function') {
      if (!hasAlreadyPseudoClassesPlugin(plugins)) {
        const replaceFunction = (f: Function): Array<any> => {
          return [
            // TODO not correct in general but react-scripts returns array
            // @ts-ignore
            ...f(),
            postcssPseudoClasses(postCssLoaderOptions),
          ];
        };

        // eslint-disable-next-line no-param-reassign
        plugins = replaceFunction(plugins);
      }
    } else {
      // is object
      // eslint-disable-next-line no-param-reassign
      plugins = {
        ...plugins,
        ...() => postcssPseudoClasses(postCssLoaderOptions),
      };
    }
  }
  return plugins;
};

/**
 * add 'postcss-pseudo-classes' plugin to 'postcss-loader`.
 * If 'postcss-loader` is not available in rule's use add it ,
 * if 'postcss-loader` is already available, append plugin
 *
 * @param use set of loaders of webpack rule
 * @param postCssLoaderOptions configuration of 'postcss-pseudo-classes' plugin
 */
const addPostCssLoader = (
  use: RuleSetUse,
  postCssLoaderOptions: PostCssLoaderPseudoClassesPluginOptions
): RuleSetUse => {
  if (typeof use === 'string' && use.includes(postCssLoaderName)) {
    return {
      loader: postCssLoaderName,
      options: {
        // postcss-loader <= 4.3.0 and react-scripts <= v4.0.3
        // plugins: () => [postcssPseudoClasses(postCssLoaderOptions)],
        // >= 4.3.0
        postcssOptions: () => [postcssPseudoClasses(postCssLoaderOptions)],
      },
    };
  }
  if (typeof use === 'function') {
    // TODO check if this is working
    // TODO check for .includes(postCssLoaderName) is missing but done in recursive step
    // @ts-ignore
    return (data: any): RuleSetUse => {
      // return use(data);
      const useFnResult = use(data);
      return addPostCssLoader(useFnResult, postCssLoaderOptions);
    };
  }
  if (Array.isArray(use)) {
    for (const item of use) {
      addPostCssLoader(item, postCssLoaderOptions);
    }
    return use;
  }

  // use is of type RuleSetLoader
  const useItem = use as RuleSetRule;
  if (
    useItem?.loader &&
    typeof useItem?.loader === 'string' &&
    useItem.loader.includes(postCssLoaderName)
  ) {
    // add options if not available
    if (!useItem.options) {
      useItem.options = {
        // plugins: [postcssPseudoClasses(postCssLoaderOptions)],
        postcssOptions: {
          plugins: [postcssPseudoClasses(postCssLoaderOptions)],
        },
      };
      return use;
    }

    // postcss-loader <= 4.3.0 and react-scripts <= v4.0.3 uses options.plugins instead of options.postcssOptions.plugins
    // if options.plugins is available in >= 4.3.0 (for instance CRA) add postcss-pseudo-classes there, too
    // @ts-ignore
    if (useItem?.options?.plugins) {
      // @ts-ignore
      useItem.options.plugins = addPostCssClassesPluginOptions(
        // @ts-ignore
        useItem?.options?.plugins,
        postCssLoaderOptions
      );
    }

    const { postcssOptions } = useItem.options as {
      plugins: any;
      postcssOptions: { plugins: Array<any> };
    };
    if (!postcssOptions) {
      // @ts-ignore
      useItem.options.postcssOptions = {
        plugins: [postcssPseudoClasses(postCssLoaderOptions)],
      };
    } else if (typeof postcssOptions === 'function') {
      // get function value and append 'postcss-pseudo-classes' to plugins
      // @ts-ignore
      useItem.options.postcssOptions = (loader: any) => {
        // @ts-ignore
        const _postcssOptions = postcssOptions(loader);
        _postcssOptions.plugins = [
          ..._postcssOptions.plugins,
          postcssPseudoClasses(postCssLoaderOptions),
        ];

        return _postcssOptions;
      };
    } else if (typeof postcssOptions === 'object') {
      if (!postcssOptions.plugins) {
        // @ts-ignore
        postcssOptions.plugins = [];
      }
      // add plugin to object
      // @ts-ignore
      postcssOptions.plugins = addPostCssClassesPluginOptions(
        postcssOptions.plugins,
        postCssLoaderOptions
      );
    }

    return use;
  }

  // TODO if not found add automatically after scss-loader or css loader

  // if not found, do not alter the RuleSetUse
  return use;
};

/**
 * add 'postcss-pseudo-classes' plugin to 'postcss-loader`. in rules
 * @param rules
 * @param postCssLoaderOptions
 */
export const addPostCSSLoaderToRules = (
  rules: Array<RuleSetRule>,
  postCssLoaderOptions: PostCssLoaderPseudoClassesPluginOptions
) => {
  for (const rule of rules) {
    if (rule?.rules) {
      addPostCSSLoaderToRules(rule.rules, postCssLoaderOptions);
      // eslint-disable-next-line no-continue
      continue;
    }
    if (rule?.use) {
      rule.use = addPostCssLoader(rule.use, postCssLoaderOptions);
    } else if (rule?.oneOf) {
      for (const r of rule.oneOf) {
        addPostCssLoader(r?.use as RuleSetUse, postCssLoaderOptions);
      }
    } else {
      // TODO
    }
  }
};

/**
 * change or add modules property of 'css-loader'.options
 * that are required to display pseudo states properly
 * @param use
 * @param cssLoaderOptions
 */
const modifyCssLoader = (
  use: RuleSetUse,
  cssLoaderOptions: CssLoaderOptions
): RuleSetUse => {
  if (typeof use === 'string' && use.includes(cssLoaderName)) {
    return {
      loader: cssLoaderName,
      options: {
        ...cssLoaderOptions,
      },
    };
  }
  if (typeof use === 'function') {
    // TODO check if this is working
    // TODO check for .includes(cssLoaderName) is missing but done in recursive step
    // @ts-ignore
    return (data: any): RuleSetUse => {
      // return use(data);
      const useFnResult = use(data);
      return modifyCssLoader(useFnResult, cssLoaderOptions);
    };
  }
  if (Array.isArray(use)) {
    for (const item of use) {
      modifyCssLoader(item, cssLoaderOptions);
    }
    return use;
  }

  // use is of type RuleSetLoader
  const useItem = use as RuleSetRule;
  if (
    useItem?.loader &&
    typeof useItem?.loader === 'string' &&
    useItem.loader.includes(cssLoaderName)
  ) {
    if (useItem.options) {
      const { modules } = useItem.options as { modules: any };

      if (modules) {
        if (typeof modules === 'string' && modules === 'true') {
          // @ts-ignore
          useItem.options.modules = cssLoaderOptions.modules;
        } else if (typeof modules === 'boolean' && modules) {
          // @ts-ignore
          useItem.options.modules = cssLoaderOptions.modules;
        } else {
          // is object
          if (
            useItem.options &&
            // @ts-ignore
            useItem.options.modules &&
            // @ts-ignore
            useItem.options.modules.getLocalIdent
          ) {
            // @ts-ignore
            delete useItem.options.modules.getLocalIdent;
          }

          // @ts-ignore
          useItem.options.modules = {
            // @ts-ignore
            ...useItem.options.modules,
            // @ts-ignore
            ...cssLoaderOptions?.modules,
          };
        }

        // logger.info(
        //   `==> modules after ${util.inspect(useItem.options, {
        //     showHidden: false,
        //     depth: null,
        //   })}`
        // );
      }
    } else {
      // if there are no options available add default options
      useItem.options = {
        ...cssLoaderOptions,
      };
    }
    return use;
  }
  // if not found, do not alter the RuleSetUse
  return use;
};

/**
 *
 * @param rules
 * @param cssLoaderOptions
 */
export const modifyCssLoaderModuleOption = (
  rules: Array<RuleSetRule>,
  cssLoaderOptions: CssLoaderOptions
) => {
  for (const rule of rules) {
    // check if RuleSetRule has use property
    if (rule.use) {
      rule.use = modifyCssLoader(rule.use, cssLoaderOptions);
    } else {
      // TODO look deeper (does not work due to filterRules cannot look deeper to find equal rule)
      // if there is no use: RuleSetUse, add your own and add PostCssLoader with Plugin
    }
  }
};
