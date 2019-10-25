import React from 'react';
import addons, { RenderOptions, types } from '@storybook/addons';
import { API } from '@storybook/api';


export const ADDON_ID = 'pseudo-states';
const PREVIEW_ID = `${ADDON_ID}/preview`;


/*
addons.register(ADDON_ID, (api: API) => {

  const title = 'Pseudo States';

  addons.addPanel(PANEL_ID, {
    title,
    render: ({active, key}) => <PseudoStatePanel key={key}
                                                 api={api}
                                                 active={active}/>
  });

  addons.add(TOOL_ID, {
    title: 'pseudo test',
    type: types.TOOL,
    match: ({viewMode}) => viewMode === 'story',
    render: () => <PseudoStateTool api={api}/>
  });

  // addons.add(PREVIEW_ID, {
  //     title: 'pseudo test',
  //     type: types.PREVIEW,
  //     match: ({ viewMode }) => viewMode === 'story',
  //     render: () => <MyTool api={api} />,
  // });
});
*/

console.log('pseudo state addon registerd', 'test test wtf');
