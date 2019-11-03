import { STORY_CHANGED } from '@storybook/core-events';
import React from 'react';
import { RenderOptions } from '@storybook/addons';
import { ADDON_ID } from './constants';

export interface PanelProps extends RenderOptions {
  api: any;
}

export const PANEL_ID = `${ADDON_ID}/panel`;

export class PseudoStatePanel extends React.Component<PanelProps, any> {

  state = {value: ''};

  onSomeAction = (text: string) => {
    // do something with the passed data
    console.log('onSomeAction', text);
  };
  onStoryChange = (id: number) => {
    // do something with the new selected storyId
    console.log('onStoryChange', id);
  };

  componentDidMount() {
    console.log('myPanel', 'componentDidMount');
    const {api} = this.props;
    api.on('pseudo/addPseudo', this.onSomeAction);
    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    const {api} = this.props;
    api.off('pseudo/addPseudo', this.onSomeAction);
    api.off(STORY_CHANGED, this.onStoryChange);
  }

  constructor(props: PanelProps) {
    super(props);
  }

  render() {
    const {value} = this.state;
    const {active} = this.props;
    const {api} = this.props;

    if (active && api) {

      const storyData = api.getCurrentStoryData();
      if (storyData) {
        debugger;

        console.log('storyData', storyData);
        // const story = api.selectStory('Basics', 'Icon');
        // console.log('story', story);
      }
    }

    return active ? <div>{value}</div> : null;
  }

};
