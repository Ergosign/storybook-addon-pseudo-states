import { makeDecorator, MakeDecoratorResult, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';
import {
  AttributeState,
  PseudoState,
  StatesComposition, StatesCompositionDefault
} from './types';
import { style_ps_container } from './styles';

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

function enableAttributeState(story: any, attribute: AttributeState, selector: string | null) {

  let element = story.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  console.log('selector:', selector);
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  stateHostElement.setAttribute(attribute, 'true');

  return element;
}

function getStoryContainer() {
  const container = document.createElement('div');
  // container.classList.add('pseudo-states__container');
  Object.assign(container.style, style_ps_container.style);
  return container;
}

function wrapStoryinStateContainer(story: HTMLElement, state: PseudoState | AttributeState) {
  const stateContainer = document.createElement('div');
  const header = document.createElement('div');
  header.innerHTML = state;
  stateContainer.appendChild(header);

  const content = document.createElement('div');
  content.appendChild(story);
  stateContainer.appendChild(content);

  return stateContainer;
}

function pseudoStateFn(getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperSettings) {


  //console.log(getStory, context, settings);
  const story = getStory(context);

  const addonDisabled = settings?.parameters?.disabled;
  if (addonDisabled) {
    return story;
  }
  
  const container = getStoryContainer();

  // use selector form parameters or if not set use settings selector or null
  const selector: string | null =
    settings?.parameters?.selector || settings?.options?.selector;

  const composition: StatesComposition =
    settings?.parameters.stateComposition || StatesCompositionDefault;

  // show default story at first
  if (composition?.pseudo && composition?.pseudo.length > 0) {
    container.appendChild(wrapStoryinStateContainer(story, 'Default'));
  }

  if (composition?.pseudo) {
    // create pseudo states of story
    for (const state of composition?.pseudo) {
      const elementWithPseudo = enablePseudoState(story, state, selector);
      container.appendChild(wrapStoryinStateContainer(elementWithPseudo, state));
      console.log(elementWithPseudo);
    }
  }

  if (composition?.attributes) {
    // create attribute states of story
    for (const state of composition?.attributes) {
      const elementWithPseudo = enableAttributeState(story, state, selector);
      container.appendChild(wrapStoryinStateContainer(elementWithPseudo, state));
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
