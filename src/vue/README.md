# Storybook Addon Pseudo States for Vue

This storybook addon allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

- [Example repository](https://github.com/andreasphil/vue-storybook-pseudo-states-example)
- [Live Demo](https://vue-storybook-pseudo-states-example.netlify.app/?path=/story/simple-button--pseudo-states)

## Framework support

| Framework | Display States | Tool-Button to show/hide |
| --------- | :------------: | :----------------------: |
| Angular   |       +        |            +             |
| React     |       +        |            +             |
| Lit       |       +        |            +             |
| HTML      |       +        |            +             |
| Vue       |       +        |            +             |

## Getting started

First, add the addon to your project as a dev dependency:

```sh
npm install @ergosign/storybook-addon-pseudo-states-vue --save-dev
```

Next, enable it by adding it as an addon to `.storybook/main.js`, e.g.

```js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@ergosign/storybook-addon-pseudo-states-vue',
  ],
};
```

Since there's no way to force an element to appear with a specific pseudo state, the addon relies on specific classes to simulate the state. The [Styling](#styling) section explains how to generate them.

Once that's done, you can add the decorator to a story, as explained in [Usage](#usage).

## Styling

The recommended approach is to generate classes from your pseudo state CSS rules automatically. The easiest way is to use the [postcss-pseudo-classes](https://github.com/giuseppeg/postcss-pseudo-classes) PostCSS plugin.

```sh
npm i -D postcss-pseudo-classes
```

Then add it to your `postcss.config.js`:

```js
module.exports = {
  plugins: [require('postcss-pseudo-classes')],
};
```

`postcss-pseudo-classes` extracts all pseudo states from your styling and creates a class for each of them by adding a prefix, e.g. `button:hover {}` becomes `button.\:hover {}`. The default prefix is `\:`, and `storybook-addon-pseudo-states-vue` is configured to work with that configuration. If you need a different prefix, pass it to the plugin options:

```js
module.exports = {
  plugins: {
    'postcss-pseudo-classes': {
      prefix: 'pseudoclass--',
    },
  },
};
```

And update your story config accordingly (more on configuring stories below):

```js
{
  parameters: {
    withPseudo: {
      selector: "element",
      prefix: "pseudoclass--"
    },
  },
};
```

If you're unsure about how to set up PostCSS, you can check out the [Vue CLI](https://cli.vuejs.org/guide/css.html#automatic-imports) or [PostCSS](https://github.com/postcss/postcss#usage) docs.

### Manually

Alternatively, you can code the pseudo state classes manually. The naming pattern is `prefix` + `pseudostate`. With the default `\:` prefix, it would look something like this:

```scss
.element {
  // ...

  &:hover,
  &\:hover {
    // hover styling
  }

  &:focus,
  &\:focus {
    // focus styling
  }
}
```

## Show/hide toolbar button

You can enable a toolbar button that toggles the pseudo states in the preview area. See [framework support](#framework-support) for information on which frameworks support this feature.

Enable the button by adding it to your `.storybook/main.js` file:

```js
module.exports = {
  addons: ['@ergosign/storybook-addon-pseudo-states-vue'],
};
```

## Usage

> ⚠️ `withPseudo` should always come first in your `decorators` array because it alters the template of the story.

### General

#### Component Story Format (CSF, recommended)

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-vue';

const section = {
  title: 'Button',
  decorators: [withPseudo],
  parameters: {
    withPseudo: { selector: 'button' },
  },
};
export default section;

export const Story = () => {
  return {
    component: ButtonComponent,
  };
};
```

#### storyOf Format

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-vue';

storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      selector: 'button', // css selector of pseudo state's host element
      pseudo: ['focus', 'hover', 'hover & focus', 'active'],
      attributes: ['disabled', 'readonly', 'error'],
    },
  })
  .add('Icon Button', () => <Button />);
```

There is a default configuration for `selector`, `pseudos` and `attributes`. Thus, you can leave `withPseudo` options empty.

### With Vue

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-vue';
import { PseudoStateOrderDefault } from '@ergosign/storybook-addon-pseudo-states-vue/dist/share/types';
import SimpleButton from '../components/SimpleButton.vue';

export default {
  title: 'Simple Button',
  decorators: [withPseudo],
  parameters: {
    withPseudo: {
      pseudo: PseudoStateOrderDefault,
      attributes: ['disabled', { attr: 'appearance', value: 'primary' }],
    },
  },
  argTypes: {
    appearance: {
      control: false,
    },
  },
};

const template = (args, { argTypes }) => ({
  components: { SimpleButton },
  props: Object.keys(argTypes),
  template: '<simple-button :label="label" :disabled="disabled" />',
});

export const PseudoStates = template.bind({});
PseudoStates.args = {
  label: 'Hello World',
  disabled: false,
  appearance: false,
};
```

### Parameters & Types

See [types.ts](../share/types.ts)

## Known limitations


- Vue 2.x support/not tested with Vue 3
- Broken in docs view
