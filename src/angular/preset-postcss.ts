import { logger } from '@storybook/node-logger';
import { Configuration } from 'webpack';
import { PostCssLoaderPseudoClassesPluginOptions } from 'postcss-pseudo-classes';
import { PseudoStatesDefaultPrefixAlternative } from '../share/types';
import {
  addPostCSSLoaderToRules,
  filterRules,
  postCSSOptionsDefault,
  PseudoStatesPresetOptions,
} from '../share/preset-utils';

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
  logger.info(`=> Loading Pseudo States Addon Webpack config (Angular Cli)`);

  if (webpackConfig?.module?.rules) {
    const postCSSDefaultOptions: PostCssLoaderPseudoClassesPluginOptions = {
      ...postCSSOptionsDefault,
      // overwrite default prefix `\\:`
      // use prefix without `:` because angular add component scope before each `:`
      prefix: PseudoStatesDefaultPrefixAlternative,
    };

    // default
    let postCssLoaderOptions = postCSSDefaultOptions;
    // if user set options
    if (options?.postCssLoaderPseudoClassesPluginOptions) {
      // if user set blacklist options, merge with default
      if (options.postCssLoaderPseudoClassesPluginOptions?.blacklist) {
        const mergedBlacklist = new Set([
          // @ts-ignore
          ...postCSSDefaultOptions.blacklist,
          // @ts-ignore
          ...options.postCssLoaderPseudoClassesPluginOptions?.blacklist,
        ]);

        postCssLoaderOptions = {
          ...postCSSDefaultOptions,
          ...options.postCssLoaderPseudoClassesPluginOptions,
          blacklist: Array.from(mergedBlacklist),
        };
      } else {
        postCssLoaderOptions = {
          ...postCSSDefaultOptions,
          ...options.postCssLoaderPseudoClassesPluginOptions,
        };
      }
    }
    const rulesToApply = options?.rules;
    if (rulesToApply && rulesToApply.length > 0) {
      const rules = filterRules(webpackConfig.module.rules, rulesToApply);
      addPostCSSLoaderToRules(rules, postCssLoaderOptions);
    } else {
      // find scss rules and apply postscss addon to those
      const rules = filterRules(webpackConfig.module.rules, [
        /\.scss$|\.sass$/,
      ]);
      addPostCSSLoaderToRules(rules, postCssLoaderOptions);
    }
  }
  /* // find rules responsible for styling
    webpackConfig.module.rules.forEach((r) => {
      // TODO Is this regex always valid??
      if (r.test.toString() === '/\\.scss$|\\.sass$/') {
        // loggerPack.logger.info(`==> Installed Runle in webpack Final ${util.inspect(r, {showHidden: false, depth: null})}`);
  
        for (const loader of r.use) {
          const loaderPath = loader?.loader || loader;
  
          // try to find postcss loader in rule.use
          if (loaderPath.indexOf('postcss-loader') >= 0) {
            if (loader.options) {
              // overwrite plugin (hopefully only base-webpack.config
              // https://github.com/storybookjs/storybook/blob/3026db93031720849576d4064fa2df62e17c8996/lib/core/src/server/preview/base-webpack.config.js
              // eslint-disable-next-line no-loop-func
              loader.options.plugins = () => [
                postcssPseudoClasses(postCssLoaderPseudoClassesPluginOptions),
              ];
            }
          }
        }
      }
    }); */

  logger.info(
    `=> Added PostCSS postcss-pseudo-classes to enable pseudo states styles.`
  );

  return webpackConfig;
}
