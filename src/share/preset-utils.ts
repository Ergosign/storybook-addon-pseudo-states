import {
  RuleSetCondition,
  RuleSetLoader,
  RuleSetRule,
  RuleSetUse,
} from 'webpack';
import { logger } from '@storybook/node-logger';
import * as util from 'util';
// @ts-ignore
import postcssPseudoClasses from 'postcss-pseudo-classes';

export interface PostCssLoaderOptions {
  // pseudo-class postcss addon option prefix
  prefix?: string;
  // pseudo-class postcss addon option blacklist
  blacklist?: Array<string>;
  // rules to apply postcss plugin, if empty set to existing scss rules
  rules?: Array<RuleSetCondition>;
}

export interface PseudoStatesPresetOptions {
  postCssLoaderOptions?: PostCssLoaderOptions;
}

export const postCSSOptionsDefault: PostCssLoaderOptions = {};

const postCssLoaderName = 'postcss-loader';

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
    // rules.filter(
    //   (rule: RuleSetRule) => {
    if (!rule.test) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const ruleCondition: RuleSetCondition = rule.test;

    // compare coditions item with rule
    for (const condition of conditions) {
      if (ruleCondition === rule) {
        // return true;
        ruleReferences.push(rule);
      }

      // TODO test if this is working for all types of ruleCondition
      if (ruleCondition.toString() === condition.toString()) {
        // return true;
        ruleReferences.push(rule);
      }

      /* if (
                                      (((typeof ruleCondition === 'string' ||
                                        typeof ruleCondition === 'function') &&
                                        typeof ruleCondition === typeof condition) ||
                                        (ruleCondition instanceof RegExp && condition instanceof RegExp)) &&
                                      ruleCondition.toString() === condition.toString()
                                    ) {
                                      return true;
                                    } */
    }

    // return false;
  }
  return ruleReferences;
  // );
};

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
    // TODO check for .includes(postCssLoaderName) is missing
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

      logger.info(
        `==> before ${util.inspect(useItem.options, {
          showHidden: false,
          depth: null,
        })}`
      );

      if (plugins) {
        if (typeof plugins === 'string') {
          logger.info(`is str`);
          // @ts-ignore
          useItem.options.plugins = [
            postcssPseudoClasses(postCssLoaderOptions),
          ];
        } else if (Array.isArray(plugins)) {
          logger.info(`is arr`);
          // @ts-ignore
          useItem.options.plugins.add(
            postcssPseudoClasses(postCssLoaderOptions)
          );
          // @ts-ignore
          useItem.options.plugins.add(() =>
            postcssPseudoClasses(postCssLoaderOptions)
          );
        } else if (typeof plugins === 'function') {
          logger.info(`is function`);

          const overwrittenPostCssFn = () => [
            plugins,
            postcssPseudoClasses(postCssLoaderOptions),
          ];
          // @ts-ignore
          useItem.options.plugins = overwrittenPostCssFn;
        } else {
          // is object
          logger.info(`is object`);
          // @ts-ignore
          useItem.options.plugins = {
            ...plugins,
            ...() => postcssPseudoClasses(postCssLoaderOptions),
          };
        }

        logger.info(
          `==> after ${util.inspect(useItem.options, {
            showHidden: false,
            depth: null,
          })}`
        );
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

export const addPostCSSLoaderToRule = (
  rules: Array<RuleSetRule>,
  postCssLoaderOptions: PostCssLoaderOptions
) => {
  logger.info(
    `==> postcssPseudoClasses ${util.inspect(
      postcssPseudoClasses(postCssLoaderOptions),
      {
        showHidden: false,
        depth: null,
      }
    )}`
  );

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
