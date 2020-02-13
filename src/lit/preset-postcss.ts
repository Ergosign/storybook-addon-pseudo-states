// @ts-nocheck
import { logger } from '@storybook/node-logger';
import { Configuration, RuleSetCondition, RuleSetRule } from 'webpack';
import postcssPseudoClasses from 'postcss-pseudo-classes';
import * as util from 'util';

export interface Options {
  postCssLoaderOptions: {
    // rules where postcss plugin is applied to
    rules?: Array<RuleSetCondition>;
    prefix?: string;
  };
}

const postCssLoaderOptions = {
  /* blacklist: [':root', ':host'], */
};

const applyPostSCSSLoader = (rule: RuleSetCondition): RuleSetCondition => {
  let foundIndex = -1;
  let index = 0;
  for (const loader of rule.use) {
    const loaderPath = loader?.loader || loader;
    if (
      loaderPath.indexOf('scss-loader') >= 0 ||
      loaderPath.indexOf('sass-loader') >= 0
    ) {
      foundIndex = index;
      logger.info(
        `=> added post-scss to scss|sass config: ${rule.test.toString()} -  ${loaderPath} at ${foundIndex}`
      );
    }
    index += 1;
  }
  if (rule?.use.length > 0 && foundIndex >= 0) {
    const postCssConfig = {
      loader: 'postcss-loader',
      options: {
        plugins: () => {
          return [
            postcssPseudoClasses({
              postCssLoaderOptions,
            }),
          ];
        },
      },
    };

    rule.use.splice(foundIndex, 0, postCssConfig);

    logger.info(
      `==> postcss rule::::: ${util.inspect(postCssConfig.options.plugins(), {
        showHidden: false,
        depth: null,
      })}`
    );

    logger.info(
      `==> Final rule::::: ${util.inspect(rule, {
        showHidden: false,
        depth: null,
      })}`
    );
  }

  return rule;
};

/**
 * append postcss' pseudo state postcss-pseudo-classes
 *
 * @param webpackConfig
 * @param options
 */
export function webpackFinal(
  webpackConfig: Configuration = {},
  options: Options = {}
): Configuration {
  logger.info(`=> Loading Pseudo States Addon Webpack config`);

  // const postCSSDefaultOptions = {
  //   // overwrite default prefix `\\:`
  //   // use prefix without `:` because angular add component scope before each `:`
  //   prefix: PseudoStatesDefaultPrefix,
  // };

  // options?.postCssLoaderOptions || postCSSDefaultOptions;

  if (
    options &&
    options.postCssLoaderOptions &&
    options.postCssLoaderOptions.rules &&
    options.postCssLoaderOptions.rules.length > 0
  ) {
    for (const userRule of options.postCssLoaderOptions.rules) {
      // find user defined rules
      let scssRules = webpackConfig.module.rules.filter(
        ({ test }: RuleSetCondition) => {
          if (test instanceof RegExp) {
            return test.toString() === new RegExp(userRule).toString();
          }
          if (test instanceof String) {
            return test === new RegExp(userRule).toString();
          }
          return false;
        }
      );
      // apply postscss plugin to those rules
      scssRules = scssRules.map(applyPostSCSSLoader);

      logger.info(
        `=> Added PostCSS postcss-pseudo-classes to enable pseudo states styles.`
      );
    }
  } else {
    let scssRuleFound = 0;

    // find rules responsible for styling
    webpackConfig.module.rules.forEach((r: Array<RuleSetRule>) => {
      let rule = r;
      const ruleCondition: RuleSetCondition = rule?.test;

      // find rules with scss or sass
      if (new RegExp(ruleCondition).toString().match(/\.(scss|sass)/)) {
        // loggerPack.logger.info(`==> Installed Runle in webpack Final ${util.inspect(r, {showHidden: false, depth: null})}`);
        scssRuleFound += 1;

        let loaderRuleFound = false;

        for (const loader of rule.use) {
          const loaderPath = loader?.loader || loader;

          // try to find postcss loader in rule.use
          if (loaderPath.indexOf('postcss-loader') >= 0) {
            loaderRuleFound = true;
            if (loader.options) {
              // overwrite plugin (hopefully only base-webpack.config
              // https://github.com/storybookjs/storybook/blob/3026db93031720849576d4064fa2df62e17c8996/lib/core/src/server/preview/base-webpack.config.js
              // eslint-disable-next-line no-loop-func
              loader.options.plugins = () => [
                postcssPseudoClasses(postCssLoaderOptions),
              ];
            }
          }
        }
        // add loader rule before 'sass-loader'
        if (!loaderRuleFound) {
          rule = applyPostSCSSLoader(r);
        }
      }
    });

    // if no existing rule was found add own
    if (scssRuleFound <= 0) {
      logger.info(
        `=> no exisitng scss rule was found. Please add default config.`
      );
    } else {
      // TODO add default/base-webpack.config (should already be done by storybook)
      logger.info(
        `=> Added PostCSS postcss-pseudo-classes to enable pseudo states styles.`
      );
    }
  }

  return webpackConfig;
}
