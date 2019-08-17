// register.js

import React from 'react';
import {STORY_CHANGED} from '@storybook/core-events';
import addons, {RenderOptions, types} from '@storybook/addons';
import {API} from "@storybook/api";

const ADDON_ID = 'pseudo-states';
const PANEL_ID = `${ADDON_ID}/panel`;
const PREVIEW_ID = `${ADDON_ID}/preview`;
const TOOL_ID = `${ADDON_ID}/tool`;

interface PanelProps extends RenderOptions {
    api: API;
}

class MyPanel extends React.Component<PanelProps, any> {

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

                // console.log(storyData);
                // const story = api.selectStory('Basics', 'Icon');
                // console.log('story', story);
            }
        }

        return active ? <div>value:{value}</div> : null;
    }
}


class MyTool extends React.Component<any, any> {

    render() {
        return <div>tool test</div>;
    }
}

class MyPreview extends React.Component<any, any> {

    render() {
        return <div>tool test</div>;
    }
}

addons.register(ADDON_ID, (api: API) => {

    const title = 'Pseudo States';

    addons.addPanel(PANEL_ID, {
        title,
        render: ({active, key}) => <MyPanel key={key} api={api} active={active}/>
    });

    addons.add(TOOL_ID, {
        title: 'pseudo test',
        type: types.TOOL,
        match: ({viewMode}) => viewMode === 'story',
        render: () => <MyTool api={api}/>,
    });

    // addons.add(PREVIEW_ID, {
    //     title: 'pseudo test',
    //     type: types.PREVIEW,
    //     match: ({ viewMode }) => viewMode === 'story',
    //     render: () => <MyTool api={api} />,
    // });
});

console.log('pseudo state addon registerd', 'test test wtf');
