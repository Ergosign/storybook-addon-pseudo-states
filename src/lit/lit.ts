import { addons, makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import { parameters } from '../share/constants';
import { PseudoState, StatesComposition, StatesCompositionDefault, WrapperPseudoStateSettings } from '../share/types';
import { html, render, TemplateResult } from 'lit-html';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';


const displayStates = (story: TemplateResult,
                       composition: StatesComposition,
                       selector: string | Array<string> | null,
                       prefix: string | null): TemplateResult => {

  if (composition?.pseudo) {
    const sates = composition.pseudo;
    return html`
       ${sates.map((state) => {
      return modifyState(story, state, selector, prefix);
    })
    }
    `;
  } else {
    return html``;
  }


};

const modifyState = (story: TemplateResult,
                     state: PseudoState | string,
                     selector: string | Array<string> | null,
                     prefix: string | null) => {
  /*console.log('templatResult of story', story, story.getTemplateElement());

  const storyTemplateElement: HTMLTemplateElement = story.getTemplateElement();
  const storyFragment: DocumentFragment = storyTemplateElement.content;

  // t.content.firstElementChild
  storyFragment.querySelector('es-button')
    ?.classList
    .add(state);

  console.log(' altered', story, story.getTemplateElement());
  const s = story.strings;
  console.log('story.strings', s);
  debugger;
  const newStory = new TemplateResult(story.strings, story.values, story.type, story.processor);*/

  const channel = addons.getChannel();

  channel.addListener(STORY_RENDERED, () => {

    // setTimeout(() => {
    const storyContainerElement = document.querySelector(`.pseudo-states-addon__story--${state} .pseudo-states-addon__story__container`);
    if (storyContainerElement) {
      const host = storyContainerElement.firstElementChild;
      if (host) {
        addStateClass(host, state, selector, prefix);
      }
    }
    // }, 100);
  });

  channel.once(STORY_CHANGED, () => {
    channel.removeAllListeners(STORY_RENDERED);
  });

  return html`
    <div class="pseudo-states-addon__story pseudo-states-addon__story--${state}">  
        <div class="pseudo-states-addon__story__header">${state}:</div>
        <div class="pseudo-states-addon__story__container">${story}</div>
    </div>
  `;
};

const addStateClass = (host: Element,
                       state: PseudoState | string,
                       selector: string | Array<string> | null,
                       prefix: string | null) => {

  const newClass = `${prefix ? prefix : ''}${state}`;
  if (!selector) {
    host.classList.add(newClass);
  } else if (typeof selector === 'string') {
    if (host.shadowRoot) {
      host.shadowRoot.querySelector(selector)
        ?.classList
        .add(newClass);
    } else {
      host.querySelector(selector)
        ?.classList
        .add(newClass);
    }
  } else if (Array.isArray(selector)) {
    for (const s of selector) {
      addStateClass(host, state, s, prefix);
    }
  }

};


const generatePseudoStates = (story: TemplateResult,
                              composition: StatesComposition,
                              selector: string | Array<string> | null,
                              prefix: string | null): TemplateResult => {

  let addonDisabled = false;
  const channel = addons.getChannel();

  const tmpl = html`
        ${modifyState(story, 'Normal', null, null)}
        ${displayStates(story, composition, selector, prefix)}
    `;
  const container = html`<div class="pseudo-states-addon__container">${tmpl}</div>`;


  const handleDisableState = (value: boolean) => {

    const containerRef = document.querySelector('.pseudo-states-addon__container');

    addonDisabled = value;

    if (containerRef) {
      if (value) {
        render(story, containerRef);
      } else {
        render(tmpl, containerRef);
      }
    }
  };

  // listen for toobar button click
  channel.on(SAPS_BUTTON_CLICK, handleDisableState);

  // remove listener when story changed
  const storyChangedListener = channel.once(STORY_CHANGED, () => {
    channel.removeListener(SAPS_BUTTON_CLICK, handleDisableState);
    channel.removeAllListeners(SAPS_BUTTON_CLICK);
  });


  return container;
};


const pseudoStateFn = (getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperPseudoStateSettings): any => {

  const story = getStory(context) as TemplateResult;
  const channel = addons.getChannel();
  const addonDisabled = settings?.parameters?.disabled || false;

  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  if (addonDisabled) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: string | Array<string> | null =
    settings?.parameters?.selector || null;

  const composition: StatesComposition =
    settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string | null = settings?.parameters?.prefix || null;

  return generatePseudoStates(story, composition, selector, prefix);
};

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => {
    return pseudoStateFn(getStory, context, settings);
  }
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
