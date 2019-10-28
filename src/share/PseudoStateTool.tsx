import React, { useState } from 'react';
import { ADDON_ID } from '../register';
import { useChannel } from '@storybook/api';
import { IconButton } from '@storybook/components';
import { SAPS_BUTTON_CLICK } from './events';

export const TOOL_ID = `${ADDON_ID}/tool`;


interface Props {
  api: any;
}

export const PseudoStateTool = (props: Props) => {

  const [isDisabled, setIsDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const buttonStyle = {
    background: '#1EA7FD',
    color: 'white'
  };

  const emit = useChannel({
    'storyChanged': () => {
      setIsVisible(false);
    },
    'saps/init-pseudo-states': (value: boolean) => { /* so something */

      console.log('saps/init-pseudo-states', 'emiited', value);

      setIsVisible(true);
      setIsDisabled(value);
    }
  });

  const onButtonClick = () => {

    console.log('onButtonClick', props);
    emit(SAPS_BUTTON_CLICK, !isDisabled);
    setIsDisabled(!isDisabled);

    console.log('test button click', emit);
  };


  return isVisible ? <IconButton style={!isDisabled ? buttonStyle : undefined} onClick={onButtonClick}>pseudo</IconButton> : null;

};

