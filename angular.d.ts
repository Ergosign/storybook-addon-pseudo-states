// declare module '@storybook/addon-pseudo-states/angular' {
//   export function withPseudo(story: StoryFn<StoryFnAngularReturnType>): IStory;
// }

// import { StoryFn } from "@storybook/addons";
// import fromWithPseudo from './dist/angular';
import {testAddonInLib as test} from './angular';
//
// export interface ICollection {
//   [p: string]: any;
// }
//
// export interface NgModuleMetadata {
//   declarations?: any[];
//   entryComponents?: any[];
//   imports?: any[];
//   schemas?: any[];
//   providers?: any[];
// }
//
// export interface IStory {
//   component?: any;
//   props?: ICollection;
//   propsMeta?: ICollection;
//   moduleMetadata?: NgModuleMetadata;
//   template?: string;
//   styles?: string[];
// }
//
// declare module '@storybook/addon-pseudo-states/angular' {
//   export function withPseudo(story: StoryFn<IStory>): IStory;
// }
//
// export const withPseudo = fromWithPseudo;
export const testAddonInLib = test;
