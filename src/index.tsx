import React, {Fragment} from 'react';
import addons, {makeDecorator} from '@storybook/addons';
import {html} from "lit-html";

class PseudoStateGenerator extends React.Component<any, any> {

    render() {
        console.log('pseudostategenerator');

        return <Fragment><div>tool test</div></Fragment>;
    }
}

export const withPseudo = makeDecorator({
    name: 'withPseudo',
    parameterName: 'pseudo',
    // This means don't run this decorator if the withPseudo decorator is not set
    skipIfNoParametersOrOptions: false,
    allowDeprecatedUsage: false,
    wrapper: (getStory, context, {options, parameters}) => {
        // Get an instance to the channel where you can communicate with the manager and the preview.
        const channel = addons.getChannel();
        const story = getStory(context);

        // Our simple API above simply sets the notes parameter to a string,
        // which we send to the channel
        channel.emit('pseudo/addPseudo', parameters);
        // we can also add subscriptions here using channel.on('eventName', callback);

        // plain html
        //  story.classList.add('testclass');
        //  return html`<div> test ${story} </div>`;

        console.log('context', context, options, parameters);
        //
        // const test = [first, story.strings.slice(1, -1), last].flat();
        const container = document.createElement('div');
        const tmpl = html`<div> test ${story} </div>`;
        const tmpl2 = <div>so funktioniert's?</div>;
        // render(tmpl, container);
        // return <div>so funktioniert's?</div>;
        console.log('vgl', story, '2', tmpl, '3', tmpl2);

        const parser = new DOMParser();
        // var el = parser.parseFromString(`<div>testing</div>`, "text/html");
        const el = document.createElement('span');
        el.innerHTML = 'testing';
        container.append(tmpl.getTemplateElement());

        // return <PseudoStateGenerator stroy={story}/>;

        const test = <Fragment><div>tool test {getStory(context)}</div></Fragment>;

        console.log('test', test);
        // return html`<div>lit-html test</div>`;
        // return () => <Fragment><div>tool test {getStory(context)}</div></Fragment>;
        return story;
        // return null;
    }
});

console.log('register decorator', 'hiho', 'hohoho');
