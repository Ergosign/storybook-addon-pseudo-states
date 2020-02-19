import {
  addons,
  makeDecorator,
  OptionsParameter,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import {
  AttributesStatesDefault,
  AttributeState,
  PseudoState,
  PseudoStatesDefault,
  PseudoStatesDefaultPrefix,
  PseudoStatesParameters,
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
  const element = story.cloneNode(true);

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
  const element = story.cloneNode(true);

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
  container: Element,
  params: PseudoStatesParameters
) {
  // show default story at first
  if (params?.pseudos && params?.pseudos.length > 0) {
    container.appendChild(wrapStoryinStateContainer(story, 'Default'));
  }

  if (params?.pseudos) {
    // create pseudo states of story
    for (const state of params?.pseudos) {
      const elementWithPseudo = enablePseudoState(
        story,
        state,
        params.selector || null,
        params.prefix || PseudoStatesDefaultPrefix // TODO
      );
      container.appendChild(
        wrapStoryinStateContainer(elementWithPseudo, state)
      );
    }
  }

  if (params?.attributes) {
    // create attribute states of story
    for (const state of params?.attributes) {
      const elementWithPseudo = enableAttributeState(
        story,
        state,
        params.selector || null
      );
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
  const container = getStoryContainer();

  // are options set by user
  const options: OptionsParameter = settings?.options;

  // Are addonParameters set by user
  const addonParameters: PseudoStatesParameters = settings?.parameters || {};

  let addonDisabled = settings?.parameters?.disabled || false;
  channel.on('saps/toolbutton-click', value => {
    addonDisabled = value;
    if (value) {
      container.innerHTML = '';
      container.append(story);
    } else {
      container.innerHTML = '';
      renderStates(story, container, addonParameters);
    }
  });
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);
  // when disabled return default story
  if (addonDisabled) {
    return story;
  }

  // use selector form addonParameters or if not set use settings selector or null
  addonParameters.selector = settings?.parameters?.selector || null;
  // TODO support Array<string>

  // Use user values, default user options or default values
  addonParameters.pseudos =
    addonParameters?.pseudos || options?.pseudos || PseudoStatesDefault;
  addonParameters.attributes =
    addonParameters?.attributes ||
    options?.attributes ||
    AttributesStatesDefault;

  // Use prefix without `:` because angular add component scope before each `:`
  // Maybe not editable by user in angular context?
  addonParameters.prefix =
    addonParameters?.prefix || options?.prefix || PseudoStatesDefaultPrefix;

  return renderStates(story, container, addonParameters);
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
