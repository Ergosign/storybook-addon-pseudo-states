import { makeDecorator, MakeDecoratorResult, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';
import { PseudoState, PseudoStateEnum } from './types';

function enablePseudoState(story: any, pseudoState: PseudoState, selector: string | null) {

  let element = story.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  console.log('selector:', selector);
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  stateHostElement?.classList?.add(pseudoState);

  return element;
}

function pseudoStateFn(getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperSettings): MakeDecoratorResult {

  console.log(getStory, context, settings);
  const story = getStory(context);

  console.log(story);
  // use selector form parameters or if not set use settings selector or null
  const selector: string | null =
    settings?.parameters?.selector || settings?.options?.selector;

  const active = enablePseudoState(story, PseudoStateEnum.ACTIVE, selector);
  console.log(active);

  return story;
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => pseudoStateFn(getStory, context, settings)
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}


console.log('load html addon');
