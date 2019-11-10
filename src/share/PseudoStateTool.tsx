import React, { useState } from 'react';
import { useChannel } from '@storybook/api';
import { IconButton, Icons } from '@storybook/components';
import { SAPS_BUTTON_CLICK } from './events';


/*interface Props {
  api: API;
}*/

export const PseudoStateTool = (/*props: Props*/) => {

  // active story params
  // const storyParams = useParameter<PseudoStatesParameters>(parameters.parameterName, {stateComposition: StatesCompositionDefault});

  // toolbar button visibility (only when addon is enabled)
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // isDisabled by user story (active state of button)
  const [isDisabled, setIsDisabled] = useState(false);

  // global state, valid in all stories
  // const [globallyDisabled, setgloballyDisabled] = useAddonState<boolean>(ADDON_GLOBAL_DISABLE_STATE, false);

  /**
   * register hooks
   */
  const emit = useChannel({
    'storyChanged': () => {
      // show button only when story uses withPseudo addon
      setIsVisible(false);
      setIsDisabled(false);
    },
    'saps/init-pseudo-states': (addonDisabled: boolean) => {
      // show button only when story uses withPseudo addon and is not disabled
      setIsVisible(!addonDisabled);
    }
  });


  /**
   * button click handler
   */
  const onButtonClick = () => {

    // TODO use global state
    const swap = !isDisabled;
    emit(SAPS_BUTTON_CLICK, swap);
    // update
    setIsDisabled(swap);
    // setgloballyDisabled(swap);

  };

  return isVisible ? <IconButton active={!isDisabled}
                                 title="Show/hide Pseudo States"
                                 onClick={onButtonClick}>
    <Icons icon="button"/>
  </IconButton> : null;

};

