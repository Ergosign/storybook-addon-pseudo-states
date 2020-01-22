import React, { useState } from 'react';
import {
  addons,
  makeDecorator,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
// import { useAddonState } from '@storybook/client-api';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import { ADDON_GLOBAL_DISABLE_STATE, parameters } from '../share/constants';
import {
  PseudoState,
  PseudoStatesDefaultPrefix,
  Selector,
  StatesComposition,
  StatesCompositionDefault,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { getMixedPseudoStates, sanitizePseudoName } from '../share/utils';

function pseudoStateFn(
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
) {
  const story = getStory(context);
  const channel = addons.getChannel();
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

  const composition: StatesComposition =
    settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string =
    settings?.parameters?.prefix || PseudoStatesDefaultPrefix;
  const states: Array<JSX.Element> = [];

  // create story's new template
  if (composition.pseudo) {
    for (const state of composition.pseudo) {
      const pstate = sanitizePseudoName(state);
      // const storyState = {...story, props: {...story.props, [state]: true}};

      const pseudoStoryPart = (
        <div
          className={`pseudo-states-addon__story pseudo-states-addon__story--${pstate}`}
          key={`pseudo-${pstate}`}
        >
          <div className="pseudo-states-addon__story__header">{state}:</div>
          <div className="pseudo-states-addon__story__container">{story}</div>
        </div>
      );

      states.push(pseudoStoryPart);
    }
  }
  if (composition.attributes) {
    for (const attr of composition.attributes) {
      const storyState = { ...story, props: { ...story.props, [attr]: true } };

      states.push(
        <div
          className={`pseudo-states-addon__story pseudo-states-addon__story--attr-${attr}`}
          key={`attr-${attr}`}
        >
          <div className="pseudo-states-addon__story__header">{attr}:</div>
          <div className="pseudo-states-addon__story__container">
            {storyState}
          </div>
        </div>
      );
    }
  }

  // update pseudo states after story is rendered
  const updatePseudoStates = () => {
    if (composition.pseudo) {
      for (const pstateRaw of composition.pseudo) {
        const pstate = sanitizePseudoName(pstateRaw);

        const container = document.querySelector(
          `.pseudo-states-addon__story--${pstate} .pseudo-states-addon__story__container`
        );

        const applyPseudoStateToHost = (
          container: Element,
          selector: Selector | null
        ) => {
          let host;
          if (!selector) {
            host = container.children[0];
          } else if (typeof selector === 'string') {
            host = container.querySelector(selector);
          } else if (Array.isArray(selector)) {
            for (const s of selector as Array<PseudoState>) {
              applyPseudoStateToHost(container, s);
            }
          }
          // get css module [path][name]__[local] and remove [local]
          // TODO test if first class represents always css module
          let moduleClass = [''];
          if (host?.classList[0]) {
            moduleClass = host?.classList[0].match(/(.+?)?__/) as Array<string>;
          }

          if (moduleClass && moduleClass?.length >= 1) {
            const subPseudoStates = getMixedPseudoStates(pstateRaw);

            if (subPseudoStates.length >= 1) {
              for (const s of subPseudoStates) {
                host?.classList.add(`${moduleClass[1]}__${prefix}${s.trim()}`);
              }
            } else {
              // and append pseudo class
              host?.classList.add(`${moduleClass[1]}__${prefix}${pstate}`);
            }
          }
        };

        if (container) {
          applyPseudoStateToHost(container, selector);
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

  return isStoryDisabled ? (
    story
  ) : (
    <div className="pseudo-states-addon__container">
      <div className="pseudo-states-addon__story pseudo-states-addon__story--Normal">
        <div className="pseudo-states-addon__story__header">Normal:</div>
        <div className="pseudo-states-addon__story__container">{story}</div>
      </div>
      {states}
    </div>
  );
}

export const withPseudo = makeDecorator({
  ...parameters,
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
