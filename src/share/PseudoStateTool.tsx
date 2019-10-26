import React from 'react';
import { ADDON_ID } from '../register';
import { useChannel, useStorybookState } from '@storybook/api';
import { IconButton } from '@storybook/components';

export const TOOL_ID = `${ADDON_ID}/tool`;


interface Props {
  api: any;
}

export const PseudoStateTool = (props: any) => {

  let isDisabled = false;

  const emit = useChannel({
    STORY_RENDERED: id => { /* do something */
      console.log('story_Rendered', 'emitted');
    },
    'saps/init-pseudo-states': (value) => { /* so something */

      console.log('saps/init-pseudo-states', 'emiited', value);

      // PseudoStateTool.isDisabled = value;
    }
  });

  const onButtonClick = () => {

    console.log('onButtonClick', props);

    isDisabled = !isDisabled;
    emit('saps/toolbutton-click', isDisabled);

    console.log('test button click', emit);
  };

  // render() {

  // return <IconButton onClick={() => emit('saps/toolbutton-click')}></IconButton>;
  return <IconButton onClick={onButtonClick}>pseudo-states</IconButton>;
  // }
};

