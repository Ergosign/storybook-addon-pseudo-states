import React from 'react';
import addons, {makeDecorator} from '@storybook/addons';

class PseudoStateGenerator extends React.Component {

    render () {
        console.log('pseudostategenerator');

        return <div>tool test</div>;
    }
}

export const withPseudo = makeDecorator({
    name: 'withPseudo',
    parameterName: 'pseudo',
    // This means don't run this decorator if the withPseudo decorator is not set
    skipIfNoParametersOrOptions: false,
    allowDeprecatedUsage: false,
    wrapper: (getStory, context, {parameters}) => {
        // Get an instance to the channel where you can communicate with the manager and the preview.
        const channel = addons.getChannel();

        // Our simple API above simply sets the notes parameter to a string,
        // which we send to the channel
        channel.emit('pseudo/addPseudo', parameters);
        // we can also add subscriptions here using channel.on('eventName', callback);

        // plain html
        //  story.classList.add('testclass');
        //  return html`<div> test ${story} </div>`;

        const story = getStory(context);
        console.log('context', context, parameters);

        // console.log('story', story);

        // console.log('before', story, story.getHTML(), story.getTemplateElement());
        //
        const ele = story.getTemplateElement();
    // debugger;
        ele.content.firstChild.classList.add('testclass');
        //
        // console.log('after', story, story.getHTML(), story.getTemplateElement());
        // story.strings = [story.strings, story.strings].flat();

        // const first = '<PseudoStateGenerator>' + story.strings[0];
        // const last = story.strings[story.strings.length - 1] + '</PseudoStateGenerator>';
        //
        // const test = [first, story.strings.slice(1, -1), last].flat();

        // return <div> test {story} </div>;
         return story;
        // return null;
    }
});

console.log('register decorator', 'hiho', 'hohoho');
