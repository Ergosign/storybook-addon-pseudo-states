import { makeDecorator, MakeDecoratorResult, StoryContext, StoryFn, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';


function pseudoStateFn(getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperSettings): MakeDecoratorResult {

  console.log(getStory, context, settings);
  const story = getStory(context);


  // TODO do something

  return story;
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => pseudoStateFn(getStory, context, settings)
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}


console.log('load angular addon');
