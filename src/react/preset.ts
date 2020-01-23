// @ts-nocheck

import { logger } from '@storybook/node-logger';
import { Configuration } from 'webpack';

function wrapLoader(loader, options) {
  if (options === false) {
    return [];
  }

  return [
    {
      loader,
      options,
    },
  ];
}

const sassModuleRule = {
  test: /\.module\.s(a|c)ss$/,
  loader: [
    // isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          // localIdentName: '[name]__[local]',
          localIdentName: '[path][name]__[local]',
        },
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

// Ensure that loaders are resolved from react-scripts.
const managerWebpack = (webpackConfig: Configuration = {}): Configuration => {
  logger.info(`=> TEST TEST TEST managerWebpack`);

  return {
    ...webpackConfig,
    // resolveLoader,
  };
};

// Update the core Webpack config.
const webpack = (
  webpackConfig: Configuration = {},
  options = {}
): Configuration => {
  logger.info(`=> TEST TEST TEST webpack`);

  const { module = {} } = webpackConfig;
  const {
    styleLoaderOptions,
    cssLoaderOptions,
    postCssLoaderOptions,
    sassLoaderOptions,
    rule = {},
  } = options;

  /*// replace module.scss rule with own to enable post-css
  webpackConfig.module.rules = webpackConfig.module.rules.map(ruleParam => {

    if (ruleParam.test.toString() === '/\\.module\\.(scss|sass)$/') {
      return sassModuleRule;
    } else {
      return ruleParam;
    }
  });

  return webpackConfig;*/

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          // test: /\.s[ca]ss$/,
          test: /\.module\.s[ca]ss$/,
          ...rule,
          use: [
            ...wrapLoader('style-loader', styleLoaderOptions),
            ...wrapLoader('css-loader', cssLoaderOptions),
            ...wrapLoader('postcss-loader', postCssLoaderOptions),
            ...wrapLoader('sass-loader', sassLoaderOptions),
          ],
        },
      ],
    },
  };
};

export default { managerWebpack, webpack };
