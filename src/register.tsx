import React from 'react';
import addons, { types } from '@storybook/addons';
import { PseudoStateTool } from './share/PseudoStateTool';
import { ADDON_ID, TOOL_ID, TOOL_TITLE } from './share/constants';
import { API } from '@storybook/api';



addons.register(ADDON_ID, (api: any): void => {

  addons.add(TOOL_ID, {
    title: TOOL_TITLE,
    type: types.TOOL,
    match: ({viewMode}) => viewMode === 'story',
    render: () => <PseudoStateTool api={api}/>
  });

  // addons.addPanel(PANEL_ID, {
  //   title,
  //   render: ({active, key}) => <PseudoStatePanel key={key}
  //                                                api={api}
  //                                                active={active}/>
  // });

  // addons.add(PREVIEW_ID, {
  //     title: 'pseudo test',
  //     type: types.PREVIEW,
  //     match: ({ viewMode }) => viewMode === 'story',
  //     render: () => <MyTool api={api} />,
  // });
});

