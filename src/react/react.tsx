import React, { useState } from 'react';
import {
  addons,
  makeDecorator,
  OptionsParameter,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
// import { useAddonState } from '@storybook/client-api';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import {
  ADDON_GLOBAL_DISABLE_STATE,
  addonParameters,
} from '../share/constants';
import {
  AttributesStatesDefault,
  Orientation,
  PseudoState,
  PseudoStates,
  PseudoStatesDefault,
  PseudoStatesDefaultPrefix,
  PseudoStatesParameters,
  Selector,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { getMixedPseudoStates, sanitizePseudoName } from '../share/utils';
import { AttributeStatesObj } from '../share/AttributeStatesObj';
import { PermutationStatsObj } from '../share/PermutationsStatesObj';
import { styles } from '../share/styles';

interface IState {
  name: string;
  // eslint-disable-next-line no-undef
  states: Array<JSX.Element>;
  pseudos?: PseudoStates;
  permutation?: PermutationStatsObj;
}

function pseudoStateFn(
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
) {
  const story = getStory(context);
  const channel = addons.getChannel();

  // are options set by user
  const options: OptionsParameter = settings?.options;

  // Are addonParameters set by user
  const parameters: PseudoStatesParameters = settings?.parameters || {};

  const addonDisabled = settings?.parameters?.disabled || false;

  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  const globallyDisabled =
    sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';
  // const [isStoryDisabled, setIsStoryDisabled] = useAddonState<boolean>(ADDON_GLOBAL_DISABLE_STATE, false);
  const [isStoryDisabled, setIsStoryDisabled] = useState(globallyDisabled);

  if (addonDisabled) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: Selector | null = settings?.parameters?.selector || null;

  // Use user values, default user options or default values
  parameters.pseudos =
    parameters?.pseudos || options?.pseudos || PseudoStatesDefault;
  parameters.attributes =
    parameters?.attributes || options?.attributes || AttributesStatesDefault;

  let permutationsAsObject: Array<PermutationStatsObj> = [];
  if (parameters.permutations) {
    permutationsAsObject = [...parameters?.permutations].map((item) =>
      PermutationStatsObj.fromPermutationState(item)
    );
  }

  const attributesAsObject: Array<AttributeStatesObj> = [
    ...parameters?.attributes,
  ].map((item) => AttributeStatesObj.fromAttributeState(item));

  // Use prefix without `:` because angular add component scope before each `:`
  // Maybe not editable by user in angular context?
  parameters.prefix =
    parameters?.prefix || options?.prefix || PseudoStatesDefaultPrefix;

  const states: IState[] = [];

  // Create Normal states
  states.push({
    name: 'Normal',
    pseudos: parameters.pseudos,
    states: createPseudos(story, parameters.pseudos, attributesAsObject),
  });
  // create story's new template
  for (const permutation of permutationsAsObject) {
    states.push({
      // label = permutation name if not specified in parameters
      name: permutation.label || permutation.attr,
      pseudos: parameters.pseudos,
      permutation,
      states: createPseudos(
        story,
        parameters.pseudos,
        attributesAsObject,
        permutation
      ),
    });
  }

  /**
   *
   * @param pseudoState
   * @param containerTmp
   * @param selectorTmp
   * @param permutation
   */
  const applyPseudoStateToHost = (
    pseudoState: PseudoState,
    containerTmp: Element,
    selectorTmp: Selector | null,
    permutation: PermutationStatsObj | undefined
  ) => {
    let host;
    if (!selectorTmp) {
      host = containerTmp.children[0];
    } else if (typeof selectorTmp === 'string') {
      host = containerTmp.querySelector(selectorTmp);
    } else if (Array.isArray(selectorTmp)) {
      for (const s of selectorTmp as Array<PseudoState>) {
        applyPseudoStateToHost(pseudoState, containerTmp, s, permutation);
      }
    }
    // get css module [path][name]__[local] and remove [local]
    // TODO test if first class represents always css module
    let moduleClass = null;
    // try to find css module prefix
    if (host?.classList[0]) {
      moduleClass = host?.classList[0].match(/(.+?)?__/) as Array<string>;
    }

    let cssModulePrefix = '';
    if (moduleClass && moduleClass?.length >= 1) {
      cssModulePrefix = `${moduleClass[1]}__`;
    }

    const subPseudoStates = getMixedPseudoStates(pseudoState);
    if (permutation) {
      subPseudoStates.concat([permutation.attr]);
    }
    for (const s of subPseudoStates) {
      host?.classList.add(`${cssModulePrefix}${parameters.prefix}${s.trim()}`);
    }
  };

  // update pseudo states after story is rendered
  const updatePseudoStates = () => {
    if (parameters.pseudos) {
      for (const state of states) {
        for (const pstateRaw of state.pseudos ?? []) {
          const pstate = sanitizePseudoName(pstateRaw);

          const containers = document.querySelectorAll(
            `.pseudo-states-addon__story--${pstate} .pseudo-states-addon__story__container`
          );

          /**
           * For each story container found (one for every permutation present)
           * cycle through the peudostate elements and add the pseudo state to them
           */
          if (containers && containers.length > 0) {
            containers.forEach((container) => {
              if (container) {
                applyPseudoStateToHost(
                  pstateRaw,
                  container,
                  selector,
                  state.permutation
                );
              }
            });
          }
        }
      }
    }
  };

  // update when story is rendered
  channel.once(STORY_RENDERED, () => {
    updatePseudoStates();
  });

  const clickHandler = (value: boolean) => {
    setIsStoryDisabled(value);
    // update when disable state changed
    updatePseudoStates();
  };

  channel.removeAllListeners(SAPS_BUTTON_CLICK);
  channel.addListener(SAPS_BUTTON_CLICK, clickHandler);

  channel.once(STORY_CHANGED, () => {
    channel.removeAllListeners(SAPS_BUTTON_CLICK);
  });

  const numberOfPseudos = parameters.pseudos ? parameters.pseudos.length : 0;
  const numberOfAttributes = parameters.attributes
    ? parameters.attributes.length
    : 0;

  /**
   * Grid can either be row or column oriented, depening on the
   * parameters.styles variable (ROW or COLUMN). We flip the
   * row / column count when ROW was given.
   */
  const getGridStyles = () => {
    switch (parameters.styles) {
      case Orientation.ROW:
        return {
          gridTemplateRows: `repeat(${
            1 + permutationsAsObject.length
          }, min-content)`,
          gridTemplateColumns: `repeat(${
            1 + numberOfPseudos + numberOfAttributes
          }, max-content)`,
          gridAutoFlow: 'row',
        };

      case Orientation.COLUMN:
      default:
        return {
          gridTemplateRows: `repeat(${
            1 + numberOfPseudos + numberOfAttributes
          }, min-content)`,
          gridTemplateColumns: `repeat(${
            1 + permutationsAsObject.length
          }, min-content)`,
          gridAutoFlow: 'column',
        };
    }
  };

  return isStoryDisabled ? (
    story
  ) : (
    <div
      className="pseudo-states-addon__container"
      style={{ ...styles.gridContainer, ...getGridStyles() }}
    >
      {/**
       * Map over all states and return a Fragment (will vanish in DOM) with the
       * full story including the normal state which is defined here
       */}
      {states.map((state: IState) => (
        <>
          <div
            className={`pseudo-states-addon__story pseudo-states-addon__story--${state.name}`}
          >
            <div className="pseudo-states-addon__story__header">
              {state.name}:
            </div>
            <div className="pseudo-states-addon__story__container">
              {/**
               * Need to add permutation attributes to the normal state,
               * therefore we clone the element and add the necessary props
               */}
              {React.cloneElement(
                story,
                state.permutation
                  ? {
                      [state.permutation.attr]: state.permutation.value,
                    }
                  : {}
              )}
            </div>
          </div>
          {state.states}
        </>
      ))}
    </div>
  );
}

/**
 * Given Pseudo States and Attributes, create all necessary
 * react element children and push them to a JSX Array to
 * return them to be rendered.
 */
const createPseudos = (
  story: any,
  pseudos: PseudoStates | undefined,
  attributesAsObject: Array<AttributeStatesObj>,
  permutation?: PermutationStatsObj
) => {
  // eslint-disable-next-line no-undef
  const states: Array<JSX.Element> = [];

  if (pseudos) {
    // Run through pseudo states and render a story element for each
    for (const state of pseudos) {
      const pstate = sanitizePseudoName(state);

      // When a permutation was given, add it to the story props
      const storyState = {
        ...story,
        props: permutation
          ? {
              ...story.props,
              [state]: true,
              [permutation.attr]: permutation.value,
            }
          : {
              ...story.props,
              [state]: true,
            },
      };

      const pseudoStoryPart = (
        <div
          className={`pseudo-states-addon__story pseudo-states-addon__story--${pstate}`}
          key={`pseudo-${pstate}`}
        >
          <div className="pseudo-states-addon__story__header">{state}:</div>
          <div className="pseudo-states-addon__story__container">
            {storyState}
          </div>
        </div>
      );

      states.push(pseudoStoryPart);
    }
    if (attributesAsObject) {
      // Run through the given attributes and add a story element for each
      for (const attr of attributesAsObject) {
        // When a permutation was given, add it to the story props
        const storyState = {
          ...story,
          props: permutation
            ? {
                ...story.props,
                [attr.attr]: attr.value,
                [permutation.attr]: permutation.value,
              }
            : {
                ...story.props,
                [attr.attr]: attr.value,
              },
        };

        states.push(
          <div
            className={`pseudo-states-addon__story pseudo-states-addon__story--attr-${attr.attr}`}
            key={`attr-${attr.attr}`}
          >
            <div className="pseudo-states-addon__story__header">
              {attr.attr}:
            </div>
            <div className="pseudo-states-addon__story__container">
              {storyState}
            </div>
          </div>
        );
      }
    }
  }
  return states;
};

export const withPseudo = makeDecorator({
  ...addonParameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => {
    return pseudoStateFn(getStory, context, settings);
  },
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

export default withPseudo;
