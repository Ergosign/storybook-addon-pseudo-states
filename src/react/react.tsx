import React, { DOMElement, useState } from 'react';
import { addons, makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';
import { parameters } from '../share/constants';
import { PseudoStatesDefaultPrefix, StatesComposition, StatesCompositionDefault, WrapperPseudoStateSettings } from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { STORY_CHANGED, STORY_INIT, STORY_RENDERED } from '@storybook/core-events';


function pseudoStateFn(getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) {

  const story = getStory(context);
  const channel = addons.getChannel();
  const addonDisabled = settings?.parameters?.disabled || false;
  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  // setTimeout(() => {

  // channel.once(STORY_RENDERED, () => {

  // console.log('Story rendered');
  // const [s, _] = useAddonState(ADDON_GLOBAL_DISABLE_STATE, false);
  //
  // console.log(s);
  // });
  // });
  // @ts-ignore
  // console.log('globalState', addons.disabled);
  // @ts-ignore
  if (addonDisabled /*|| addons.disabled*/) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: string | Array<string> | null =
    settings?.parameters?.selector || null;

  const composition: StatesComposition = settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string | null = settings?.parameters?.prefix || PseudoStatesDefaultPrefix;
  const states: Array<JSX.Element> = [];

  const [isStoryDisabled, setIsStoryDisabled] = useState(false);

  channel.once(SAPS_BUTTON_CLICK, (value: boolean) => {
    console.log('SAPS_BUTTON_CLICK', 'received', value);

    setIsStoryDisabled(value);
  });
  channel.once(STORY_CHANGED, () => {
    channel.removeAllListeners(SAPS_BUTTON_CLICK);
  });
  channel.once(STORY_INIT, () => {
    // notify toolbar button
    channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);
  });


  if (composition.pseudo) {
    for (const state of composition.pseudo) {
      const pstate = state.replace(/\s/g, '')
        .replace('&', '-');
      // const storyState = {...story, props: {...story.props, [state]: true}};

      const pseudoStoryPart = <div className={`pseudo-states-addon__story pseudo-states-addon__story--${pstate}`}
                                   key={`pseudo-${pstate}`}>
        <div className="pseudo-states-addon__story__header">{state}:</div>
        <div className="pseudo-states-addon__story__container">{story}</div>
      </div>;

      // console.log('pseudoStoryPart', pseudoStoryPart);

      states.push(
        pseudoStoryPart
      );
    }
    channel.once(STORY_RENDERED, () => {

        if (composition.pseudo) {
          let i = 0;
          for (const pstateRaw of composition.pseudo) {
            // TODO use above
            const pstate = pstateRaw.replace(/\s/g, '')
              .replace('&', '-');

            const element = states[i++];
            // console.log('state', element.props.children[1].props);

            const container = document.querySelector(`.pseudo-states-addon__story--${pstate} .pseudo-states-addon__story__container`);

            console.log(pstate, `.pseudo-states-addon__story--${pstate}`, container);
            if (container) {
              let host;
              if (!selector) {
                host = container.children[0];
              } else if (typeof selector === 'string') {
                host = container.querySelector(selector);
              } else if (Array.isArray(selector)) {
                // TODO
              }
              // get css module [path][name]__[local] and remove [local]
              const moduleClass = host?.classList[0].match(/(.+?)?__/);
              if (moduleClass && moduleClass?.length >= 1) {
                console.log('test');
                const subPseudoStates = pstateRaw.split('&');
                console.log(pstateRaw, subPseudoStates);
                if (subPseudoStates.length >= 1) {
                  for (const s of subPseudoStates) {
                    host?.classList.add(moduleClass[1] + '__' + prefix + s.trim());
                  }
                } else {
                  // and append pseudo class
                  host?.classList.add(moduleClass[1] + '__' + prefix + pstate);
                }
              }
            }
          }
        }
      }
    );
  }

  if (composition.attributes) {
    for (const attr of composition.attributes) {
      const storyState = {...story, props: {...story.props, [attr]: true}};

      states.push(
        <div className={`pseudo-states-addon__story pseudo-states-addon__story--attr-${attr}`}
             key={`attr-${attr}`}>
          <div className="pseudo-states-addon__story__header">{attr}:</div>
          <div className="pseudo-states-addon__story__container">{storyState}</div>
        </div>
      );
    }
  }

  return isStoryDisabled ? story : <div className="pseudo-states-addon__container">
    <div className="pseudo-states-addon__story pseudo-states-addon__story--Normal">
      <div className="pseudo-states-addon__story__header">Normal:</div>
      <div className="pseudo-states-addon__story__container">{story}</div>
    </div>
    {states}
  </div>;

}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) => {

    return pseudoStateFn(getStory, context, settings);
  }
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

export default withPseudo;
