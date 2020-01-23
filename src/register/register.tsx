import React from 'react';
import addons, { MatchOptions, types } from '@storybook/addons';
import { API } from '@storybook/api';
import { PseudoStateTool } from '../share/PseudoStateTool';
import { ADDON_ID, TOOL_ID, TOOL_TITLE } from '../share/constants';

// export default () => {

addons.register(ADDON_ID, (api: API): void => {
  addons.add(TOOL_ID, {
    title: TOOL_TITLE,
    type: types.TOOL,
    match: ({ viewMode }: MatchOptions) => viewMode === 'story',
    render: () => <PseudoStateTool api={api} />,
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

// @ts-ignore
export async function addon(baseConfig, options) {
  console.log(console.log(baseConfig, options));
  return {
    ...baseConfig,
    module: {
      ...module,
      rules: [
        // @ts-ignore
        ...(module.rules || []),
        {
          /* some new loader */
        },
      ],
    },
  };
}

// @ts-ignore
export async function webpack(baseConfig, options) {
  console.log(console.log(baseConfig, options));
  debugger;
}
