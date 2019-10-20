import { makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';
import { WrapperPseudoStateSettings } from './types';

function pseudoStateFn(getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperPseudoStateSettings) {

  console.log(getStory, context, settings);

  const story = getStory(context);

  console.log(story);

  return story;
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory, context, settings) => {

    console.log(getStory, context, settings);
    const story = getStory(context);
    console.log(story);
    return story;
  }
  /*wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => {
    console.log('wiehtPseudeo Addon');
    return pseudoStateFn(getStory, context, settings);
  }*/
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}


console.log('load lit addon');
