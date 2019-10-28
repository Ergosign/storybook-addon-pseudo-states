import React, { useState } from 'react';
import { addons, makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';
import parameters from '../share/parameters';
import { StatesComposition, WrapperPseudoStateSettings } from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';


function pseudoStateFn(getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) {

  const story = getStory(context);
  const channel = addons.getChannel();
  const addonDisabled = settings?.parameters?.disabled || false;
// notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  if (addonDisabled) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: string | Array<string> | null =
    settings?.parameters?.selector || null;
  debugger;
  const composition: StatesComposition =
    settings?.parameters?.stateComposition || {}/*|| StatesCompositionDefault*/;

  const prefix: string | null = settings?.parameters?.prefix || null;

  console.log('story', story);


  const states = [];

  const [isDisabled, setIsDisabled] = useState(addonDisabled);

  channel.addListener(SAPS_BUTTON_CLICK,(value: boolean) => {
    console.log('saps/init-pseudo-states', 'emiited', value);

    setIsDisabled(value);
  });
  channel.once(SAPS_INIT_PSEUDO_STATES, () => {
    channel.removeAllListeners(SAPS_BUTTON_CLICK);
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

  const container = isDisabled ? story : <div className="pseudo-states-addon__container">
    <div className="pseudo-states-addon__story pseudo-states-addon__story--Normal">
      <div className="pseudo-states-addon__story__header">Normal:</div>
      <div className="pseudo-states-addon__story__container">{story}</div>
    </div>
    {states}
  </div>;

  return container;

}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) => {

    debugger;
    return pseudoStateFn(getStory, context, settings);
  }
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

export default withPseudo;
