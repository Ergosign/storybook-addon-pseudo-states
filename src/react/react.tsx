import React, { useState } from 'react';
import { addons, makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';
import { ADDON_GLOBAL_DISABLE_STATE, parameters } from '../share/constants';
import { StatesComposition, StatesCompositionDefault, WrapperPseudoStateSettings } from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { STORY_CHANGED, STORY_INIT, STORY_RENDERED } from '@storybook/core-events';
import { useAddonState } from '@storybook/api';


function pseudoStateFn(getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) {

  const story = getStory(context);
  const channel = addons.getChannel();
  const addonDisabled = settings?.parameters?.disabled || false;
  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  // setTimeout(() => {

  channel.once(STORY_RENDERED, () => {

    console.log('Story rendered');
    // const [s, _] = useAddonState(ADDON_GLOBAL_DISABLE_STATE, false);
    //
    // console.log(s);
  });
  // });

  if (addonDisabled) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: string | Array<string> | null =
    settings?.parameters?.selector || null;

  const composition: StatesComposition = settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string | null = settings?.parameters?.prefix || null;
  const states = [];

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
      const storyState = {...story, props: {...story.props, [state]: true}};

      states.push(
        <div className="pseudo-states-addon__story pseudo-states-addon__story--"
             key={state}>
          <div className="pseudo-states-addon__story__header">{state}:</div>
          <div className="pseudo-states-addon__story__container">{storyState}</div>
        </div>
      );
    }
  }

  if (composition.attributes) {
    for (const atrr of composition.attributes) {
      const storyState = {...story, props: {...story.props, [atrr]: true}};

      states.push(
        <div className="pseudo-states-addon__story pseudo-states-addon__story--"
             key={atrr}>
          <div className="pseudo-states-addon__story__header">{atrr}:</div>
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
