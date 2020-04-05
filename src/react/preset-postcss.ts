import { PostCssLoaderPseudoClassesPluginOptions } from 'postcss-pseudo-classes';
import { logger } from '@storybook/node-logger';
import { Configuration } from 'webpack';
// import * as util from 'util';
import {
  addPostCSSLoaderToRules,
  CssLoaderOptions,
  cssLoaderOptionsDefault,
  filterRules,
  modifyCssLoaderModuleOption,
  postCSSOptionsDefault,
  PseudoStatesPresetOptions,
} from '../share/preset-utils';

/**
 * append postcss' pseudo state postcss-pseudo-classes
 *
 * @param webpackConfig
 * @param options
 */
export function webpackFinal(
  webpackConfig: Configuration = {},
  options: PseudoStatesPresetOptions = {}
) {
  logger.info(`=> Loading Pseudo States Addon Webpack config (for CRA)`);

  if (webpackConfig?.module?.rules) {
    const postCssLoaderOptions: PostCssLoaderPseudoClassesPluginOptions = options?.postCssLoaderPseudoClassesPluginOptions
      ? {
          ...postCSSOptionsDefault,
          ...options.postCssLoaderPseudoClassesPluginOptions,
        }
      : postCSSOptionsDefault;

    const rulesToApply = options?.rules;
    let filteredRules;
    if (rulesToApply && rulesToApply.length > 0) {
      filteredRules = filterRules(webpackConfig.module.rules, rulesToApply);
    } else {
      // find scss rules and apply postscss addon to those
      filteredRules = filterRules(webpackConfig.module.rules, [
        /\.module\.(scss|sass)$/,
        /\.(scss|sass)$/,
      ]);
    }

    if (filteredRules) {
      addPostCSSLoaderToRules(filteredRules, postCssLoaderOptions);

      // change 'css-loader' module option
      const cssLoaderOptions: CssLoaderOptions = options?.cssLoaderOptions
        ? { ...cssLoaderOptionsDefault, ...options.cssLoaderOptions }
        : cssLoaderOptionsDefault;

      modifyCssLoaderModuleOption(filteredRules, cssLoaderOptions);
    }
  }

  // logger.info(
  //   `==> Pseudo States Addon Webpack config rules ${util.inspect(
  //     webpackConfig,
  //     {
  //       showHidden: false,
  //       depth: null,
  //     }
  //   )}`
  // );

  logger.info(
    `=> Added PostCSS postcss-pseudo-classes to enable pseudo states styles.`
  );

  return webpackConfig;
}
