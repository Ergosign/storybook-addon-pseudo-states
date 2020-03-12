# Storybook Addon Pseudo States

Storybook Addon Pseudo States allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

## Framework Support

| Framework | Display States | Tool-Button to show/hide |
| --------- | :------------: | :----------------------: |
| Angular   |       +        |           +\*            |
| React     |       +        |           +\*            |
| Lit       |       +        |           +\*            |
| HTML      |       +        |           +\*            |
| Vue       |       +        |           +\*            |

\* Could lead to sync problems with other addons, like knobs

## Getting started

First of all, you need to install Pseudo States into your project as a dev dependency.

```sh
npm install @ergosign/storybook-addon-pseudo-states-lit --save-dev
```

Then, configure it as an addon by adding it to your main.js file (located in the Storybook config directory).

To display the pseudo states, you have to add specific css classes to your styling, see [Styling](###Styling)

Then, you can set the decorator locally, see [Usage](###Usage).

### Styling

#### Automatically generated with PostCss Webpack config (recommended)

Preset-Postcss adds [postcss-loader](https://github.com/postcss/postcss-loader) to Storybook's custom webpack config.

You must also install [postcss-pseudo-classes](https://github.com/giuseppeg/postcss-pseudo-classes).
Unfortunately, latest version is only tagged and not released. Please use at least [tagged version 0.3.0](https://github.com/giuseppeg/postcss-pseudo-classes/releases/tag/v0.3.0)

```bash
npm install postcss-pseudo-classes@0.3.0 --save-dev
```

Then add the preset `preset-postcss` to your configuration in `main.js` (located in the Storybook config directory):

```js
main.js;

module.exports = {
  presets: [
    {
      name: '@ergosign/storybook-addon-pseudo-states-lit/preset-postcss',

      // set rules for which postcss-loader will be attached to
      // if not set, it tries to add postcss-loader to all scss|sass rules
      options: {
        postCssLoaderOptions: {
          rules: [/\.comp\.scss$/],
        },
      },
    },
  ],
};
```

If `postCssLoaderOptions` are not set, the preset tries to add `postcss-loader` to all available `scss|sass` rules.

### Show/Hide Toolbar-Button

You can enable a toolbar button that toggles the Pseudo States in the Preview area.

Enable the button by adding it to your `main.js` file (located in the Storybook config directory):

```js
// main.js

module.exports = {
  addons: [
    {
      name: '@ergosign/storybook-addon-pseudo-states-lit',
      options: {
        visibleByDefault: true,
      },
    },
  ],
};
```

`visibleByDefault` option defaults to `false`

### Usage

> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.

#### Component Story Format (CSF, recommended)

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-lit';

//not tested yet
```

#### storyOf Format

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-<framework>';

storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      selector: 'button', // css selector of pseudo state's host element
      stateComposition: {
        pseudo: ['focus', 'hover', 'hover & focus', 'active'],
        attributes: ['disabled', 'readonly', 'error'],
      },
    },
  })
  .add('Icon Button', () => <Button />);
```

There is a default configuration for `StateComposition`. Thus, you can leave it empty.

## Parameters

```typescript
export interface PseudoStatesParameters {
  disabled?: boolean;
  // query for selector to host element[s] that have to be modified
  selector?: string | Array<string>;
  // prefix for state classes that will be added to host element
  prefix?: string;
  stateComposition?: StatesComposition;
}

export interface StatesComposition {
  pseudo?: Array<PseudoState>;
  attributes?: Array<AttributeState>;
}

export type PseudoState = PseudoStateEnum | string;
export const StatesCompositionDefault: StatesComposition = {
  pseudo: PseudoStateOrderDefault,
  attributes: AttributesStateOrderDefault,
};

export const PseudoStateOrderDefault: Array<PseudoState> = [
  FOCUS,
  HOVER,
  ACTIVE,
];
export const AttributesStateOrderDefault: Array<AttributeState> = [DISABLED];
export const AttributesStateOrderInputDefault: Array<AttributeState> = [
  DISABLED,
  READONLY,
];
```
