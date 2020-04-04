declare module 'postcss-pseudo-classes' {
  export type BlackListItem = string | { [key: string]: boolean };

  export interface PostCssLoaderOptions {
    // pseudo-class postcss addon option blacklist
    blacklist?: Array<BlackListItem>;
    // pseudo-class postcss addon option prefix
    prefix?: string;
    preserveBeforeAfter?: boolean;
  }

  const postcssPseudoClasses = (
    option: PostCssLoaderOptions
  ): ((css: Array<any>) => void) => {};

  const createCombinations = (a: string, b: string): Array<string> => {};

  const createSerialCombinations = (
    arr: Array<T>,
    fn: (combination: string, element: T) => T
  ): Array<T> => {};

  export default postcssPseudoClasses;
}
