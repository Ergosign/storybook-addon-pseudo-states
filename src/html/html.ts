import {
  addons,
  makeDecorator,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import {
  AttributeState,
  PseudoState,
  PseudoStatesDefaultPrefix,
  Selector,
  StatesComposition,
  StatesCompositionDefault,
  WrapperPseudoStateSettings,
} from '../share/types';
import { styles } from '../share/styles';
import { parameters } from '../share/constants';
import { SAPS_INIT_PSEUDO_STATES } from '../share/events';

function enablePseudoState(
  story: any,
  pseudoState: PseudoState,
  selector: string | Array<string> | null,
  prefix: string
) {
  let element = story.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  const stateClass = prefix + pseudoState;
  stateHostElement?.classList?.add(stateClass);

  return element;
}

function enableAttributeState(
  story: any,
  attribute: AttributeState,
  selector: string | Array<string> | null
) {
  let element = story.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  if (stateHostElement) {
    stateHostElement.setAttribute(attribute, 'true');
  }

  // set on host too
  element.setAttribute(attribute, 'true');
  return element;
}

function getStoryContainer() {
  const container = document.createElement('div');
  // container.classList.add('pseudo-states__container');
  Object.assign(container.style, styles.style);
  return container;
}

function wrapStoryinStateContainer(
  story: HTMLElement,
  state: PseudoState | AttributeState
) {
  const stateContainer = document.createElement('div');
  const header = document.createElement('div');
  header.innerHTML = state;
  stateContainer.appendChild(header);

  const content = document.createElement('div');
  content.appendChild(story);
  stateContainer.appendChild(content);

  return stateContainer;
}

function renderStates(
  story: HTMLElement,
  composition: StatesComposition,
  container: Element,
  selector: Selector | null,
  prefix: string
) {
  // show default story at first
  if (composition?.pseudo && composition?.pseudo.length > 0) {
    container.appendChild(wrapStoryinStateContainer(story, 'Default'));
  }

  if (composition?.pseudo) {
    // create pseudo states of story
    for (const state of composition?.pseudo) {
      const elementWithPseudo = enablePseudoState(
        story,
        state,
        selector,
        prefix
      );
      container.appendChild(
        wrapStoryinStateContainer(elementWithPseudo, state)
      );
    }
  }

  if (composition?.attributes) {
    // create attribute states of story
    for (const state of composition?.attributes) {
      const elementWithPseudo = enableAttributeState(story, state, selector);
      container.appendChild(
        wrapStoryinStateContainer(elementWithPseudo, state)
      );
    }
  }
  return container;
}

function pseudoStateFn(
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
) {
  const channel = addons.getChannel();
  const story = getStory(context);
  let container = getStoryContainer();

  let addonDisabled = settings?.parameters?.disabled || false;
  channel.on('saps/toolbutton-click', value => {
    addonDisabled = value;
    if (value) {
      container.innerHTML = '';
      container.append(story);
    } else {
      container.innerHTML = '';
      renderStates(story, composition, container, selector, prefix);
    }
  });
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);
  // when disabled return default story
  if (addonDisabled) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: Selector | null =
      settings?.parameters?.selector || null /*|| settings?.options?.selector*/;
  // TODO support Array<string>

  const composition: StatesComposition =
    settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string =
    settings?.parameters?.prefix || PseudoStatesDefaultPrefix;

  return renderStates(story, composition, container, selector, prefix);
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => pseudoStateFn(getStory, context, settings),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
