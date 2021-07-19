import {
  addons,
  makeDecorator,
  OptionsParameter,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import {
  AttributesStatesDefault,
  AttributeStates,
  PseudoState,
  PseudoStatesDefault,
  PseudoStatesDefaultPrefix,
  PseudoStatesParameters,
  WrapperPseudoStateSettings,
} from '../share/types';
import { styles } from '../share/styles';
import { addonParameters } from '../share/constants';
import { SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { AttributeStatesObj } from '../share/AttributeStatesObj';
import { PermutationStatsObj } from '../share/PermutationsStatesObj';

function enablePseudoState(
  story: any,
  pseudoState: PseudoState,
  selector: string | Array<string> | null,
  prefix: string
) {
  let tmpStroy = story;
  if (typeof story === 'string') {
    const storyNode = new DOMParser().parseFromString(story, 'text/html');
    if (storyNode.body.childNodes && storyNode.body.childNodes[0]) {
      tmpStroy = storyNode.body.childNodes[0];
    }
  }

  const element = tmpStroy.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  const stateClass = prefix + pseudoState;
  stateHostElement?.classList?.add(stateClass);

  return element;
}

// eslint-disable-next-line no-undef
function stringToNode(input: string): ChildNode | null {
  const storyNode = new DOMParser().parseFromString(input, 'text/html');
  if (storyNode.body.childNodes && storyNode.body.childNodes[0]) {
    return storyNode.body.childNodes[0];
  }
  return null;
}

function enableAttributeState(
  story: any,
  attribute: AttributeStatesObj,
  selector: string | Array<string> | null
) {
  let tmpStroy = story;
  if (typeof story === 'string') {
    tmpStroy = stringToNode(story);
  }
  const element = tmpStroy.cloneNode(true);

  let stateHostElement: HTMLElement = element;
  if (selector) {
    stateHostElement = element.querySelector(selector);
  }
  if (stateHostElement) {
    stateHostElement.setAttribute(attribute.attr, String(attribute.value));
  }

  // set on host too
  element.setAttribute(attribute.attr, String(attribute.value));
  return element;
}

function getStoryContainer(parameters: PseudoStatesParameters) {
  const container = document.createElement('div');
  // container.classList.add('pseudo-states__container');
  const attrLength = parameters?.attributes?.length || 0;
  const pseudoLength = parameters?.pseudos?.length || 0;
  const permutationLenth = parameters?.permutations?.length || 0;

  // compute grid template
  // TODO support row orientation
  const gridContainer = {
    ...styles.gridContainer,
    gridTemplate: `repeat(${
      1 + pseudoLength + attrLength
    } , min-content) / repeat(${1 + permutationLenth}, 1fr)`,
  };

  Object.assign(container.style, gridContainer);
  return container;
}

function wrapStoryInStateContainer(
  story: HTMLElement | string,
  state: AttributeStatesObj
) {
  const stateContainer = document.createElement('div');
  // TODO add orientation
  stateContainer.classList.toggle('pseudo-states-addon__story', true);
  stateContainer.classList.toggle(
    `pseudo-states-addon__story--${state.attr}`,
    true
  );
  const header = document.createElement('div');
  header.classList.toggle('pseudo-states-addon__story__header', true);
  header.innerHTML = state.attr;
  stateContainer.appendChild(header);

  const content = document.createElement('div');
  content.classList.toggle('pseudo-states-addon__story__container', true);
  if (typeof story === 'string') {
    const tmpStory = stringToNode(story);
    if (tmpStory) {
      content.appendChild(tmpStory);
    }
  } else {
    content.appendChild(story);
  }

  stateContainer.appendChild(content);

  return stateContainer;
}

function renderStatePermuation(
  story: HTMLElement,
  container: Element,
  params: PseudoStatesParameters,
  attributes: Array<AttributeStatesObj>,
  permutation: PermutationStatsObj | null
) {
  let tmpStroy = story;
  // enable permutation
  if (permutation) {
    tmpStroy = enableAttributeState(
      tmpStroy,
      permutation,
      params.selector || null
    );
  }

  // show default story at first
  if (params?.pseudos && params?.pseudos.length > 0) {
    container.appendChild(
      wrapStoryInStateContainer(
        tmpStroy,
        new AttributeStatesObj(permutation?.attr || 'Default')
      )
    );
  }

  if (params?.pseudos) {
    // create pseudo states of story
    for (const state of params?.pseudos) {
      const elementWithPseudo = enablePseudoState(
        tmpStroy,
        state,
        params.selector || null,
        params.prefix || PseudoStatesDefaultPrefix // TODO
      );
      container.appendChild(
        wrapStoryInStateContainer(
          elementWithPseudo,
          new AttributeStatesObj(state)
        )
      );
    }
  }

  if (attributes) {
    // create attribute states of story
    for (const state of attributes) {
      const elementWithAttribute = enableAttributeState(
        tmpStroy,
        state,
        params.selector || null
      );
      container.appendChild(
        wrapStoryInStateContainer(elementWithAttribute, state)
      );
    }
  }

  return container;
}

function renderStates(
  story: HTMLElement,
  container: Element,
  params: PseudoStatesParameters,
  attributes: Array<AttributeStatesObj>,
  permutations: Array<PermutationStatsObj>
) {
  // render default  (not listed in permutations array)
  renderStatePermuation(story, container, params, attributes, null);

  // render permutations
  if (permutations) {
    for (const permutation of permutations) {
      renderStatePermuation(story, container, params, attributes, permutation);
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

  // are options set by user
  const options: OptionsParameter = settings?.options;

  // Are parameters set by user
  const parameters: PseudoStatesParameters = settings?.parameters || {};

  let addonDisabled = settings?.parameters?.disabled || false;

  // use selector form parameters or if not set use settings selector or null
  parameters.selector = settings?.parameters?.selector || null;
  // TODO support Array<string>

  // Use user values, default user options or default values
  parameters.pseudos =
    parameters?.pseudos || options?.pseudos || PseudoStatesDefault;

  // ensure attributes are defined
  parameters.attributes =
    parameters?.attributes || options?.attributes || AttributesStatesDefault;

  const attributesAsObject: Array<AttributeStatesObj> = [
    ...(parameters.attributes as AttributeStates),
  ].map((item) => AttributeStatesObj.fromAttributeState(item));

  let permuttionsAsObject: Array<PermutationStatsObj> = [];
  if (parameters.permutations) {
    permuttionsAsObject = [...parameters?.permutations].map((item) =>
      PermutationStatsObj.fromPermutationState(item)
    );
  }

  const container = getStoryContainer(parameters);

  // Use prefix without `:` because angular add component scope before each `:`
  // Maybe not editable by user in angular context?
  parameters.prefix =
    parameters?.prefix || options?.prefix || PseudoStatesDefaultPrefix;

  channel.on('saps/toolbutton-click', (value) => {
    addonDisabled = value;
    if (value) {
      container.innerHTML = '';

      if (typeof story === 'string') {
        const tmpStory = stringToNode(story);
        if (tmpStory) {
          container.appendChild(tmpStory);
        }
      } else {
        container.appendChild(story);
      }
    } else {
      container.innerHTML = '';
      renderStates(
        story,
        container,
        parameters,
        attributesAsObject,
        permuttionsAsObject
      );
    }
  });

  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);
  // when disabled return default story
  if (addonDisabled) {
    if (typeof story === 'string') {
      const tmpStory = stringToNode(story);
      if (tmpStory) {
        return tmpStory;
      }
    } else {
      return story;
    }
  }

  return renderStates(
    story,
    container,
    parameters,
    attributesAsObject,
    permuttionsAsObject
  );
}

export const withPseudo = makeDecorator({
  ...addonParameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => pseudoStateFn(getStory, context, settings),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
