import React from 'react';
import { ADDON_ID } from '../register';
import { useChannel, useStorybookState } from '@storybook/api';
import { IconButton } from '@storybook/components';

export const TOOL_ID = `${ADDON_ID}/tool`;

export class PseudoStateTool extends React.Component<any, any> {


  init() {
    const state = useStorybookState();

    const emit = useChannel({
      STORY_RENDERED: id => { /* do something */
      },
      'saps/toolbutton-click': () => { /* so something */
      }
    });

    // emit('saps/toolbutton-click');
  }

  onButtonClick() {

    const emit = useChannel({
      STORY_RENDERED: id => { /* do something */
      },
      'saps/toolbutton-click': () => { /* so something */
      }
    });
    emit('saps/toolbutton-click', );

    console.log('test button click')
  }

  render() {
    console.log('render', PseudoStateTool);

    // return <IconButton onClick={() => emit('saps/toolbutton-click')}></IconButton>;
    return <IconButton onClick={this.onButtonClick }>pseudo-states</IconButton>;
  }
}
