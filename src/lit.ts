import { makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';
import { WrapperPseudoStateSettings } from './types';
import { html } from 'lit-html';

function pseudoStateFn(getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperPseudoStateSettings): any {

  console.log(getStory, context, settings);

  const story = getStory(context);

  const container = html`<div class="pseudo-state__container">${story}</div>`;

  // render(story, container);
  // console.log('withPseudo', 'story', story);
  //
  // const container = document.createElement('div');
  // container.classList.add('pseudo-states__container');
  // Object.assign(container.style, style_ps_container.style);
  // render(story, container);

  console.log('withPseudo', 'container', container);
  return container;
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => {
    return pseudoStateFn(getStory, context, settings);
  }
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}


console.log('load lit addon');
