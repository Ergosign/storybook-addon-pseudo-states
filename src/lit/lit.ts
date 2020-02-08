import {
  addons,
  makeDecorator,
  StoryContext,
  StoryGetter,
  WrapperSettings,
} from '@storybook/addons';
import { html, render, TemplateResult } from 'lit-html';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import {
  AttributeState,
  PseudoState,
  PseudoStatesDefaultPrefix,
  Selector,
  StatesComposition,
  StatesCompositionDefault,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { ADDON_GLOBAL_DISABLE_STATE, parameters } from '../share/constants';

const displayAtrributes = (
  story: TemplateResult,
  composition: StatesComposition,
  selector: string | Array<string> | null,
  prefix: string | null
) => {
  if (composition?.attributes) {
    const { attributes } = composition;
    return html`
      ${attributes.map(attr => modifyAttr(story, attr, selector, prefix))}
    `;
  }
  return html``;
};

const addAttr = (
  host: Element,
  attr: AttributeState | string,
  selector: string | Array<string> | null,
  prefix: string | null
) => {
  if (!selector) {
    const elem = host;
    elem.setAttribute(attr, 'true');
    // @ts-ignore
    elem[attr] = true;
  } else if (typeof selector === 'string') {
    if (host.shadowRoot) {
      const elem = host.shadowRoot.querySelector(selector);
      if (elem) {
        elem.setAttribute(attr, 'true');
        // @ts-ignore
        elem[attr] = true;
      }
    } else {
      const elem = host.querySelector(selector);
      if (elem) {
        elem.setAttribute(attr, 'true');
        // @ts-ignore
        elem[attr] = true;
      }
    }
  } else if (Array.isArray(selector)) {
    for (const s of selector) {
      addStateClass(host, attr, s, prefix);
    }
  }
};

const modifyAttr = (
  story: TemplateResult,
  attr: AttributeState | string,
  selector: string | Array<string> | null,
  prefix: string | null
) => {
  const channel = addons.getChannel();

  channel.addListener(STORY_RENDERED, () => {
    // setTimeout(() => {
    const storyContainerElement = document.querySelector(
      `.pseudo-states-addon__story--attr-${attr} .pseudo-states-addon__story__container`
    );
    if (storyContainerElement) {
      const host = storyContainerElement.firstElementChild;
      if (host) {
        addAttr(host, attr, selector, prefix);
      }
    }
    // }, 100);
  });

  channel.once(STORY_CHANGED, () => {
    channel.removeAllListeners(STORY_RENDERED);
  });

  return html`
    <div
      class="pseudo-states-addon__story pseudo-states-addon__story--attr-${attr}"
    >
      <div class="pseudo-states-addon__story__header">${attr}:</div>
      <div class="pseudo-states-addon__story__container">${story}</div>
    </div>
  `;
};

const displayStates = (
  story: TemplateResult,
  composition: StatesComposition,
  selector: string | Array<string> | null,
  prefix: string | null
): TemplateResult => {
  if (composition?.pseudo) {
    const sates = composition.pseudo;
    return html`
      ${sates.map(state => modifyState(story, state, selector, prefix))}
    `;
  }
  return html``;
};

const modifyState = (
  story: TemplateResult,
  state: PseudoState | string,
  selector: string | Array<string> | null,
  prefix: string | null
) => {
  /* console.log('templatResult of story', story, story.getTemplateElement());

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
  const newStory = new TemplateResult(story.strings, story.values, story.type, story.processor); */

  const channel = addons.getChannel();

  channel.addListener(STORY_RENDERED, () => {
    // setTimeout(() => {
    const storyContainerElement = document.querySelector(
      `.pseudo-states-addon__story--${state} .pseudo-states-addon__story__container`
    );
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
    <div
      class="pseudo-states-addon__story pseudo-states-addon__story--${state}"
    >
      <div class="pseudo-states-addon__story__header">${state}:</div>
      <div class="pseudo-states-addon__story__container">${story}</div>
    </div>
  `;
};

const addStateClass = (
  host: Element,
  state: PseudoState | string,
  selector: string | Array<string> | null,
  prefix: string | null
) => {
  const newClass = `${prefix || ''}${state}`;
  if (!selector) {
    host.classList.add(newClass);
  } else if (typeof selector === 'string') {
    if (host.shadowRoot) {
      host.shadowRoot.querySelector(selector)?.classList.add(newClass);
    } else {
      host.querySelector(selector)?.classList.add(newClass);
    }
  } else if (Array.isArray(selector)) {
    for (const s of selector) {
      addStateClass(host, state, s, prefix);
    }
  }
};

const generatePseudoStates = (
  story: TemplateResult,
  composition: StatesComposition,
  selector: string | Array<string> | null,
  prefix: string | null
): TemplateResult => {
  const channel = addons.getChannel();

  let globallyDisabled =
    sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';

  const tmpl = html`
    ${modifyState(story, 'Normal', null, null)}
    ${displayStates(story, composition, selector, prefix)}
    ${displayAtrributes(story, composition, selector, prefix)}
  `;
  const container = html`
    ${globallyDisabled
      ? // show default story in wrapping container
        html`
          <div class="pseudo-states-addon__container">${story}</div>
        `
      : html`
          <div class="pseudo-states-addon__container">${tmpl}</div>
        `}
  `;

  const handleDisableState = (value: boolean) => {
    globallyDisabled = value;

    const containerRef = document.querySelector(
      '.pseudo-states-addon__container'
    );

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
  channel.once(STORY_CHANGED, () => {
    channel.removeListener(SAPS_BUTTON_CLICK, handleDisableState);
    channel.removeAllListeners(SAPS_BUTTON_CLICK);
  });

  return container;
};

const pseudoStateFn = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
): any => {
  const story = getStory(context) as TemplateResult;
  const channel = addons.getChannel();
  const addonDisabled = settings?.parameters?.disabled || false;

  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  if (addonDisabled) {
    return story;
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: Selector | null = settings?.parameters?.selector || null;

  const composition: StatesComposition =
    settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string =
    settings?.parameters?.prefix || PseudoStatesDefaultPrefix;

  return generatePseudoStates(story, composition, selector, prefix);
};

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperSettings
  ) => pseudoStateFn(getStory, context, settings),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
