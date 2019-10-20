import { makeDecorator, StoryContext, StoryGetter, StoryFn, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';
import { WrapperPseudoStateSettings } from './types';
import { StoryFnAngularReturnType } from '@storybook/angular/dist/client/preview/types';


function pseudoStateFn(getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperPseudoStateSettings): StoryFnAngularReturnType {

  console.log(getStory, context, settings);
  const story: StoryFnAngularReturnType = getStory(context);

  console.log(story);

  // TODO do something

  return story;
}

export const withPseudo = makeDecorator({
  ...parameters,
  // wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => test(getStory as StoryFn)
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => pseudoStateFn(getStory, context, settings)
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}


console.log('load angular addon');
