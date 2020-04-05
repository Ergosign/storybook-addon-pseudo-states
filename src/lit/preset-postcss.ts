import { logger } from '@storybook/node-logger';
import { Configuration } from 'webpack';
import * as util from 'util';
import {
  addPostCSSLoaderToRules,
  filterRules,
  postCSSOptionsDefault,
  PseudoStatesPresetOptions,
} from '../share/preset-utils';
import { PseudoStatesDefaultPrefixAlternative } from '../share/types';

/* export function webpack(
  webpackConfig: Configuration = {},
  options: Options = {}
) {
  logger.info(
    `== webpack() ==> Pseudo States Addon Webpack ${util.inspect(
      options?.postCssLoaderPseudoClassesPluginOptions,
      {
        showHidden: false,
        depth: null,
      }
    )}`
  );
  return webpackConfig;
}
*/

/**
 * append postcss' pseudo state postcss-pseudo-classes
 *
 * @param webpackConfig
 * @param options
 */
export function webpackFinal(
  webpackConfig: Configuration = {},
  options: PseudoStatesPresetOptions = {}
): Configuration {
  logger.info(`=> Loading Pseudo States Addon Webpack config`);

  logger.info(
    `== webpack() ==> Pseudo States Addon Options ${util.inspect(
      options.postCssLoaderPseudoClassesPluginOptions,
      {
        showHidden: false,
        depth: null,
      }
    )}`
  );

  // logger.info(
  //   `== webpack() ==> Pseudo States Addon Webpack ${util.inspect(
  //     webpackConfig?.module?.rules,
  //     {
  //       showHidden: false,
  //       depth: null,
  //     }
  //   )}`
  // );

  if (webpackConfig?.module?.rules) {
    const postCssLoaderOptions = options?.postCssLoaderPseudoClassesPluginOptions
      ? {
          prefix: PseudoStatesDefaultPrefixAlternative,
          ...postCSSOptionsDefault,
          ...options.postCssLoaderPseudoClassesPluginOptions,
        }
      : {
          prefix: PseudoStatesDefaultPrefixAlternative,
          ...postCSSOptionsDefault,
        };

    const rulesToApply = options?.rules;
    if (rulesToApply && rulesToApply.length > 0) {
      const rules = filterRules(webpackConfig.module.rules, rulesToApply);

      logger.info(
        `== webpack() ==> found rules ${util.inspect(rules, {
          showHidden: false,
          depth: null,
        })}`
      );

      addPostCSSLoaderToRules(rules, postCssLoaderOptions);

      logger.info(
        `== webpack() ==> altered rules ${util.inspect(rules, {
          showHidden: false,
          depth: null,
        })}`
      );
    } else {
      // find scss rules and apply postscss addon to those
      const rules = filterRules(webpackConfig.module.rules, [
        /\.scss$|\.sass$/,
        /\.(scss|sass)$/,
      ]);
      addPostCSSLoaderToRules(rules, postCssLoaderOptions);
    }
  }

  logger.info(
    `=> Added PostCSS postcss-pseudo-classes to enable pseudo states styles.`
  );

  return webpackConfig;
}
