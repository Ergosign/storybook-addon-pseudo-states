import { addons, makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from '../share/parameters';
import { PseudoState, StatesComposition, StatesCompositionDefault, WrapperPseudoStateSettings } from '../share/types';
import { directive, html, render, TemplateResult } from 'lit-html';
import { PseudoStateEventsEnum } from '../share/events';


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

  // TODO find better solution
  setTimeout(() => {
    const storyContainerElement = document.querySelector(`.pseudo-states-addon__story--${state} .pseudo-states-addon__story__container`);
    if (storyContainerElement) {
      const host = storyContainerElement.firstElementChild;
      if (host) {
        addStateClass(host, state, selector, prefix);
      }
    }
  }, 100);

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
    // TODO
  }

};


// TODO support Array<string>
const generatePseudoStates = (story: TemplateResult,
                              composition: StatesComposition,
                              selector: string | Array<string> | null,
                              prefix: string | null): TemplateResult => {

  let addonDisabled = false;
  const channel = addons.getChannel();


  // const forceWrite = directive((value) => (part: any) => {
  //   part.setValue(value);
  // });

  const tmpl = html`
        ${modifyState(story, 'Normal', null, null)}
        ${displayStates(story, composition, selector, prefix)}
    `;

  const container = html`<div class="pseudo-states-addon__container">${tmpl}</div>`;


  channel.on('saps/toolbutton-click', (value) => {

    const containerRef = document.querySelector('.pseudo-states-addon__container');
    console.log('button clicked emitted to addon', value, containerRef);

    addonDisabled = value;

    if (containerRef) {
      if (value) {
        render(story, containerRef);
      } else {
        render(tmpl, containerRef);
      }
    }
  });

  console.log('withPseudo', 'container', container);


  return container;
};

const pseudoStateFn = (getStory: StoryGetter,
                       context: StoryContext,
                       settings: WrapperPseudoStateSettings): any => {

  console.log(getStory, context, settings);

  const channel = addons.getChannel();
  const story = getStory(context) as TemplateResult;
  console.log('withPseudo', 'story', story);

  let addonDisabled = settings?.parameters?.disabled || false;

  channel.on('saps/toolbutton-click', (value) => {
    console.log('button clicked emitted to addon', value);
    // TODO update correctly and remove correctly
    addonDisabled = value;
  });
  channel.emit(PseudoStateEventsEnum.INIT_PSEUDO_STATES, addonDisabled);

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


console.log('load lit addon');
