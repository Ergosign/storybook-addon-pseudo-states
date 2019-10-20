import { makeDecorator, MakeDecoratorResult, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';
import {
  PseudoState,
  StatesComposition, StatesCompositionDefault
} from './types';

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
                       settings: WrapperSettings) {


  //console.log(getStory, context, settings);
  const story = getStory(context);
  const container = document.createElement('div');

  // use selector form parameters or if not set use settings selector or null
  const selector: string | null =
    settings?.parameters?.selector || settings?.options?.selector;

  const composition: StatesComposition =
    settings?.parameters.stateComposition || StatesCompositionDefault;

  // show default story at first
  if (composition?.pseudo) {

    if (composition?.pseudo.length > 0) {
      container.appendChild(story);
    }

    // create pseudo states of story
    for (const state of composition?.pseudo) {
      const elementWithPseudo = enablePseudoState(story, state, selector);
      container.appendChild(elementWithPseudo);
      console.log(elementWithPseudo);
    }
  }

  if (container.hasChildNodes()) {
    return container;
  }

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
