import React, { useState } from 'react';
import { useChannel } from '@storybook/api';
import { IconButton, Icons } from '@storybook/components';
import { SAPS_BUTTON_CLICK } from './events';
import { addons } from '@storybook/addons';


interface Props {
  api: any;
}

export const PseudoStateTool = (props: Props) => {

  // isDisabled by user story
  const [isDisabled, setIsDisabled] = useState(false);

  // toobar button visibility
  const [isVisible, setIsVisible] = useState(false);

  const [globallyDisabled, setgloballyDisabled] = useState(false);

  // globalState.isDisabled = globallyDisabled;

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

      // console.log('saps/init-pseudo-states', 'received init', 'is disabled = ', value);

      // show button only when story uses withPseudo addon and is not disabled
      setIsVisible(!value);
      setIsDisabled(value);
    }
  });

  const onButtonClick = () => {

    emit(SAPS_BUTTON_CLICK, !isDisabled);
    setIsDisabled(!isDisabled);
    // update
    // @ts-ignore
    addons.disabled = !addons.disabled;
    // @ts-ignore
    setgloballyDisabled(addons.disabled);
    // @ts-ignore
    console.log('button click', addons.disabled);

  };

  return isVisible ? <IconButton active={!globallyDisabled}
                                 title="Show/hide Pseudo States"
                                 onClick={onButtonClick}>
    <Icons icon="button"/>
  </IconButton> : null;

};

