import React from 'react';
import addons, { types } from '@storybook/addons';
import { PseudoStateTool, TOOL_ID } from './share/PseudoStateTool';
import { PANEL_ID, PseudoStatePanel } from './share/PseudoStatePanel';
import { API } from '@storybook/api';

export const ADDON_ID = 'pseudo-states';
const PREVIEW_ID = `${ADDON_ID}/preview`;


addons.register(ADDON_ID, (api) => {


  const title = 'Pseudo States';

  // addons.addPanel(PANEL_ID, {
  //   title,
  //   render: ({active, key}) => <PseudoStatePanel key={key}
  //                                                api={api}
  //                                                active={active}/>
  // });
  
  addons.add(TOOL_ID, {
    title: title,
    type: types.TOOL,
    match: ({viewMode}) => viewMode === 'story',
    render: () => <PseudoStateTool api={api}/>
  });

  console.log('register tool');

  // addons.add(PREVIEW_ID, {
  //     title: 'pseudo test',
  //     type: types.PREVIEW,
  //     match: ({ viewMode }) => viewMode === 'story',
  //     render: () => <MyTool api={api} />,
  // });
});

console.log('register pseudo-states addon');
