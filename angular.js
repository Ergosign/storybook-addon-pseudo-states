import fromWithPseudo from './dist/angular';
import {makeDecorator} from "@storybook/addons";
//
export const withPseudo = fromWithPseudo;


// export const testAddonInLib = makeDecorator({
//     name: "testAddon",
//     parameterName: "testAddon",
//     skipIfNoParametersOrOptions: false,
//     allowDeprecatedUsage: false,
//     wrapper: (getStory, context, settings) => {
//         const story = getStory(context);
//         console.log("Addon external", story);
//         return story;
//     }
// });
