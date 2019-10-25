import React from 'react';
import { ADDON_ID } from '../register';

export const TOOL_ID = `${ADDON_ID}/tool`;

export class PseudoStateTool extends React.Component<any, any> {

  render() {
    return <div>tool test</div>;
  }
}
