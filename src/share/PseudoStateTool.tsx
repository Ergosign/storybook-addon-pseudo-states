import React, { useState } from 'react';
import { useAddonState, useChannel } from '@storybook/api';
import { IconButton, Icons } from '@storybook/components';
import { SAPS_BUTTON_CLICK } from './events';
import { ADDON_GLOBAL_DISABLE_STATE } from './constants';


interface Props {
  api: any;
}

export const PseudoStateTool = (props: Props) => {

  // isDisabled by user story
  const [isDisabled, setIsDisabled] = useState(false);

  // toobar button visibility
  const [isVisible, setIsVisible] = useState(false);

  const [globallyDisabled, setgloballyDisabled] = useAddonState(ADDON_GLOBAL_DISABLE_STATE, false);

  /**
   * register hooks
   */
  const emit = useChannel({
    'storyChanged': () => {
      // show button only when story uses withPseudo addon
      setIsVisible(false);
      console.log('storychanged');
    },
    'saps/init-pseudo-states': (value: boolean) => { /* so something */

      console.log('saps/init-pseudo-states', 'received init', 'is disabled = ', value);

      // show button only when story uses withPseudo addon and is not disabled
      setIsVisible(!value);
      setIsDisabled(value);
    }
  });

  const onButtonClick = () => {

    emit(SAPS_BUTTON_CLICK, !isDisabled);
    setIsDisabled(!isDisabled);
    setgloballyDisabled(!globallyDisabled);

    console.log('SAPS_BUTTON_CLICK', !isDisabled);
  };

  return isVisible ? <IconButton active={!globallyDisabled}
                                 title="Show/hide Pseudo States"
                                 onClick={onButtonClick}>
    <Icons icon="button"/>
  </IconButton> : null;

};

