import React from 'react';
import addons, { MatchOptions, types } from '@storybook/addons';
import { logger } from '@storybook/node-logger';
import * as util from 'util';
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

  /*
    addons.addPanel(PANEL_ID, {
      title,
      render: ({active, key}) => <PseudoStatePanel key={key}
                                                   api={api}
                                                   active={active}/>
    });
    */

  /* addons.add(PREVIEW_ID, {
        title: 'pseudo test',
        type: types.PREVIEW,
        match: ({ viewMode }) => viewMode === 'story',
        render: () => <MyTool api={api} />,
    }); */
});

logger.info(`==> ADDON - registered`);

// @ts-ignore
export async function addon(baseConfig, options) {
  logger.info(
    `==> ADDON - baseconfig:: ${util.inspect(baseConfig, {
      showHidden: false,
      depth: null,
    })}`
  );
  logger.info(
    `==> ADDON - options:: ${util.inspect(options, {
      showHidden: false,
      depth: null,
    })}`
  );

  return baseConfig;
}
