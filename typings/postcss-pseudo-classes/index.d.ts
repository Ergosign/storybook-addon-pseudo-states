declare module 'postcss-pseudo-classes' {
  export type BlackListItem = string | { [key: string]: boolean };

  export interface PostCssLoaderPseudoClassesPluginOptions {
    // pseudo-class postcss addon option blacklist
    blacklist?: Array<BlackListItem>;
    // pseudo-class postcss addon option prefix
    prefix?: string;
    preserveBeforeAfter?: boolean;
    restrictTo?: Array<string>;
    allCombinations?: boolean;
  }

  export const postcssPseudoClasses = (
    option: PostCssLoaderPseudoClassesPluginOptions
  ): ((css: Array<any>) => void) => {};

  export const createCombinations = (a: string, b: string): Array<string> => {};

  export const createSerialCombinations = (
    arr: Array<unknown>,
    fn: (combination: string, element: unknown) => unknown
  ): Array<unknown> => {};

  export default postcssPseudoClasses;
}
