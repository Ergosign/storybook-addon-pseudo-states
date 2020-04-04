import {
  RuleSetCondition,
  RuleSetLoader,
  RuleSetRule,
  RuleSetUse,
} from 'webpack';
import postcssPseudoClasses, {
  PostCssLoaderOptions,
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
  postCssLoaderOptions?: PostCssLoaderOptions;
  // rules to apply postcss plugin, if empty set to existing scss rules
  rules?: Array<RuleSetCondition>;
  cssLoaderOptions?: CssLoaderOptions;
}

const postCssLoaderName = 'postcss-loader';
export const postCSSOptionsDefault: PostCssLoaderOptions = {};

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
    if (rule.test) {
      const ruleCondition: RuleSetCondition = rule.test;

      // compare conditions item with rule
      for (const condition of conditions) {
        if (ruleCondition === rule) {
          ruleReferences.push(rule);
        }

        // TODO test if this is working for all types of ruleCondition
        if (ruleCondition.toString() === condition.toString()) {
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
 * add 'postcss-pseudo-classes' plugin to 'postcss-loader`.
 * If 'postcss-loader` is not available in rule's use add it ,
 * if 'postcss-loader` is already available, append plugin
 *
 * @param use set of loaders of webpack rule
 * @param postCssLoaderOptions configuration of 'postcss-pseudo-classes' plugin
 */
const addPostCssLoader = (
  use: RuleSetUse,
  postCssLoaderOptions: PostCssLoaderOptions
): RuleSetUse => {
  if (typeof use === 'string' && use.includes(postCssLoaderName)) {
    return {
      loader: postCssLoaderName,
      options: {
        plugins: [postcssPseudoClasses(postCssLoaderOptions)],
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
  const useItem = use as RuleSetLoader;
  if (useItem?.loader && useItem.loader.includes(postCssLoaderName)) {
    if (useItem.options) {
      const { plugins } = useItem.options as { plugins: any };

      if (plugins) {
        if (typeof plugins === 'string') {
          // @ts-ignore
          useItem.options.plugins = [
            postcssPseudoClasses(postCssLoaderOptions),
          ];
        } else if (Array.isArray(plugins)) {
          // @ts-ignore
          useItem.options.plugins.add(
            postcssPseudoClasses(postCssLoaderOptions)
          );
          // @ts-ignore
          useItem.options.plugins.add(() =>
            postcssPseudoClasses(postCssLoaderOptions)
          );
        } else if (typeof plugins === 'function') {
          const overwrittenPostCssFn = () => [
            plugins,
            postcssPseudoClasses(postCssLoaderOptions),
          ];
          // @ts-ignore
          useItem.options.plugins = overwrittenPostCssFn;
        } else {
          // is object
          // @ts-ignore
          useItem.options.plugins = {
            ...plugins,
            ...() => postcssPseudoClasses(postCssLoaderOptions),
          };
        }

        // logger.info(
        //   `==> useItem.options after ${util.inspect(useItem.options, {
        //     showHidden: false,
        //     depth: null,
        //   })}`
        // );
      }
    } else {
      useItem.options = {
        plugins: [postcssPseudoClasses(postCssLoaderOptions)],
      };
    }
    return use;
  }

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
  postCssLoaderOptions: PostCssLoaderOptions
) => {
  for (const rule of rules) {
    // check if RuleSetRule has use property
    if (rule.use) {
      rule.use = addPostCssLoader(rule.use, postCssLoaderOptions);
    } else {
      // TODO look deeper (does not work due to filterRules cannot look deeper to find equal rule)
      // if there is no use: RuleSetUse, add your own and add PostCssLoader with Plugin
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
  const useItem = use as RuleSetLoader;
  if (useItem?.loader && useItem.loader.includes(cssLoaderName)) {
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
