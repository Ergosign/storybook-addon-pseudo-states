//
// import { makeDecorator, MakeDecoratorResult, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
// import parameters from './parameters';
//
// function pseudoStateFn(getStory: StoryGetter,
//                        context: StoryContext,
//                        settings: WrapperSettings): MakeDecoratorResult {
//
//   console.log(getStory, context, settings);
//   const element = getStory(context);
//
//
//   // TODO do something
//
//   return element;
// }
//
// export const withPseudo = makeDecorator({
//   ...parameters,
//   wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => pseudoStateFn(getStory, context, settings)
//
//   /*wrapper: (getStory, context, {options, parameters}) => {
//     // Get an instance to the channel where you can communicate with the manager and the preview.
//     // const channel = addons.getChannel();
//     const story = getStory(context);
//
//     // Our simple API above simply sets the notes parameter to a string,
//     // which we send to the channel
//     // channel.emit('pseudo/addPseudo', parameters);
//     // we can also add subscriptions here using channel.on('eventName', callback);
//
//     // plain html
//     //  story.classList.add('testclass');
//     //  return html`<div> test ${story} </div>`;
//     /!*
//             console.log('context', context, options, parameters);
//             //
//             // const test = [first, story.strings.slice(1, -1), last].flat();
//             const container = document.createElement('div');
//
//             container.append(story.cloneNode(true));
//             story.classList.add('hover');
//
//             container.append(story);
//
//
//             return container;*!/
//
//
//     console.log('story', story);
//
//     // const obj = <div></div>;
//     // const obj = document.createElement('div');
//     // obj.append(story);
//     //
//     // const container = document.createElement('div');
//     // container.append(obj);
//
//
//     // ReactDOM.render(obj, container);
//
//     // const test2 = html`<div> wtf: ${story}</div>`;
//     //
//     // console.log(story, test2);
//     //
//     // render(test2, container);
//     // // container.innerHTML = 'test';
//     // return container;
//
//     /!*const tmpl = html`<div> test ${story} </div>`;
//     const tmpl2 = <div>so funktioniert's?</div>;
//     // render(tmpl, container);
//     // return <div>so funktioniert's?</div>;
//     console.log('vgl', story, '2', tmpl, '3', tmpl2);
//
//     const parser = new DOMParser();
//     // var el = parser.parseFromString(`<div>testing</div>`, "text/html");
//     const el = document.createElement('span');
//     el.innerHTML = 'testing';
//     container.append(tmpl.getTemplateElement());
//
//     // return <PseudoStateGenerator stroy={story}/>;
//
//     const test = <Fragment><div>tool test {getStory(context)}</div></Fragment>;
//
//     console.log('test', test);
//     // return html`<div>lit-html test</div>`;
//     // return () => <Fragment><div>tool test {getStory(context)}</div></Fragment>;
//
// *!/
//     return story;
//   }*/
// });
//
// console.log('register decorator', 'hiho', 'hohoho');

/*
import { deprecate } from 'util';


const withPseudo = deprecate(
  () => {
  },
  `
  Using "import {withPseudo} from "@storybook/addon-pseudo-states";" is deprecated.
  Please use framework specific files:
  "import {withPseudo} from "@storybook/addon-pseudo-states/html";"
  "import {withPseudo} from "@storybook/addon-pseudo-states/angular";"
  "import {withPseudo} from "@storybook/addon-pseudo-states/react";"
`
)();

export default withPseudo;

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
*/
