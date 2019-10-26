import { addons, makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import { AttributeState, PseudoState, StatesComposition, StatesCompositionDefault, WrapperPseudoStateSettings } from '../share/types';
import { style_ps_container } from '../share/styles';
import parameters from '../share/parameters';
import { PseudoStateEventsEnum } from '../share/events';
import { API, useChannel } from '@storybook/api';
import { forceReRender } from '@storybook/html';


function enablePseudoState(story: any, pseudoState: PseudoState, selector: string | Array<string> | null, prefix: string | null) {

  let element = story.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  const stateClass = prefix ? prefix : '' + pseudoState;
  stateHostElement?.classList?.add(stateClass);

  return element;
}

function enableAttributeState(story: any, attribute: AttributeState, selector: string | Array<string> | null) {

  let element = story.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  stateHostElement.setAttribute(attribute, 'true');

  // set on host too
  element.setAttribute(attribute, 'true');

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
                       settings: WrapperPseudoStateSettings) {

  const channel = addons.getChannel();



  const story = getStory(context);

  let addonDisabled = settings?.parameters?.disabled || false;
  channel.on('saps/toolbutton-click', (value) => {
    console.log('button clicked emitted to addon', value);
    addonDisabled = value;
  });
  channel.emit(PseudoStateEventsEnum.INIT_PSEUDO_STATES, addonDisabled);
  // when disabled return default story
  if (addonDisabled) {
    return story;
  }

  const container = getStoryContainer();

  // use selector form parameters or if not set use settings selector or null
  const selector: string | Array<string> | null =
    settings?.parameters?.selector || null/*|| settings?.options?.selector*/;
  // TODO support Array<string>

  const composition: StatesComposition =
    settings?.parameters.stateComposition || StatesCompositionDefault;

  const prefix: string | null = settings?.parameters?.prefix || null;

  // show default story at first
  if (composition?.pseudo && composition?.pseudo.length > 0) {
    container.appendChild(wrapStoryinStateContainer(story, 'Default'));
  }

  if (composition?.pseudo) {
    // create pseudo states of story
    for (const state of composition?.pseudo) {
      const elementWithPseudo = enablePseudoState(story, state, selector, prefix);
      container.appendChild(wrapStoryinStateContainer(elementWithPseudo, state));
    }
  }

  if (composition?.attributes) {
    // create attribute states of story
    for (const state of composition?.attributes) {
      const elementWithPseudo = enableAttributeState(story, state, selector);
      container.appendChild(wrapStoryinStateContainer(elementWithPseudo, state));
    }
  }

  return container;
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) => pseudoStateFn(getStory, context, settings)
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
