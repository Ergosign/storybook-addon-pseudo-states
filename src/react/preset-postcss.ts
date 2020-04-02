// @ts-nocheck

import postcssPseudoClasses from 'postcss-pseudo-classes';
import { Configuration } from 'webpack';
import { PseudoStatesPresetOptions } from '../share/preset-utils';

function modifyRules(rule, options: PseudoStatesPresetOptions = {}) {
  if (rule.test) {
    // logger.info(
    //   `==> REACT webpack config - rule: ${util.inspect(rule.test, {
    //     showHidden: false,
    //     depth: null,
    //   })}`
    // );
    if (rule.test && rule.test.toString().match(/.(scss|sass)/)) {
      // logger.info(
      //   `==> REACT webpack config - rule: ${util.inspect(rule, {
      //     showHidden: false,
      //     depth: null,
      //   })}`
      // );
      rule.use.map((loader) => {
        if (
          loader &&
          loader.loader &&
          loader.loader.indexOf('/postcss-loader') >= 0
        ) {
          // logger.info(
          //   `==> REACT webpack config - loader: ${util.inspect(loader, {
          //     showHidden: false,
          //     depth: null,
          //   })}`
          // );
          // logger.info(
          //   `==> REACT webpack config - loader: ${util.inspect(
          //     loader.options.plugins(),
          //     {
          //       showHidden: false,
          //       depth: null,
          //     }
          //   )}`
          // );

          const defaultPlugins = loader.options.plugins;

          const postCssLoaderOptions = options?.postCssLoaderOptions
            ? { ...options.postCssLoaderOptions }
            : {};

          // eslint-disable-next-line no-param-reassign
          loader.options.plugins = () => {
            return [
              ...defaultPlugins(),
              postcssPseudoClasses(postCssLoaderOptions),
            ];
          };
          // logger.info(
          //   `==> REACT webpack config - loader: ${util.inspect(
          //     loader.options.plugins(),
          //     {
          //       showHidden: false,
          //       depth: null,
          //     }
          //   )}`
          // );
        }

        if (
          loader &&
          loader.loader &&
          loader.loader.indexOf('/css-loader') >= 0
        ) {
          // logger.info(
          //   `==> REACT webpack config - css-loader: ${util.inspect(loader, {
          //     showHidden: false,
          //     depth: null,
          //   })}`
          // );

          // overwrite css-loader's module ident name
          if (loader.options && loader.options.modules) {
            // eslint-disable-next-line no-param-reassign
            loader.options.modules.localIdentName = '[path][name]__[local]';
            // TODO check if nothing breaks
            // eslint-disable-next-line no-param-reassign
            delete loader.options.modules.getLocalIdent; // = () => '[path][name]__[local]';
          }
        }
        return loader;
      });
      return rule;
    }
  } else if (rule.oneOf) {
    rule.oneOf.map((innerRule) => {
      modifyRules(innerRule);
      return rule;
    });
  }
  return rule;
}

export function webpackFinal(
  webpackConfig: Configuration = {},
  options: PseudoStatesPresetOptions = {}
) {
  webpackConfig.module.rules.map((r) => {
    modifyRules(r, options);
    return r;
  });

  return webpackConfig;
}
