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
npm install storybook-addon-pseudo-states-html --save-dev
```

Then, configure it as an addon by adding it to your addons.js file (located in the Storybook config directory).

To display the pseudo states, you have to add specific css classes to your styling, see [Styling](###Styling)

Then, you can set the decorator locally, see [Usage](###Usage).

### Styling

#### Automatically generated with PostCss Webpack config (recommended)

Add [postcss-loader](https://github.com/postcss/postcss-loader) to a Storybook custom webpack config

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // ATTENTION when using css modules
              modules: {
                // !!! must not use [hash]'
                localIdentName: '[path][name]__[local]',
              },
            },
          },
          // Add loader here
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
```

Add [postcss-pseudo-classes](https://github.com/giuseppeg/postcss-pseudo-classes).

```bash
npm install postcss-pseudo-classes --save-dev
```

And enable it in `postcss.config.js`

```js
module.exports = {
  plugins: {
    'postcss-pseudo-classes': {
      // prefix: 'pseudoclass--',
      // blacklist: ':not'
    },
  },
};
```

<details>
<summary>When using a custom `prefix` parameter, use the same for postcss-pseudo-classes</summary>

```js
module.exports = {
  plugins: {
    'postcss-pseudo-classes': {
      prefix: 'pseudoclass-example-prefix',
    },
  },
};
```

</details>

#### Manually

In addition to the standard pseudo state styling, you have to add fake classes consisting of `prefix` + `pseudostate` (`\:hover`, `\:focus`, `\:active`, `\:yourOwnState`) by yourself.
Be aware that default prefix is `\:`. When using your own prefix, update your styling accordingly.

```scss
.element {
  //element styling

  &:hover,
  &\:hover {
    // hover styling
  }
}
```

<details>
<summary>With a custom prefix</summary>

custom prefix: `.pseudoclass--`

```js
// in your story
parameters: {
    withPseudo: {
        selector: "element",
        prefix: "pseudoclass--"
    }
}
```

```scss
.element {
  //element styling

  &:hover,
  &.pseudoclass--hover {
    // hover styling
  }
}
```

</details>

### Show/Hide Toolbar-Button

You can enable a toolbar button that toggles the Pseudo States in the Preview area.

See [Framework Support](##Framework Support) which Frameworks support this feature.

Enable the button by adding it to your `main.js` file (located in the Storybook config directory):

```js
// main.js

module.exports = {
  addons: ['storybook-addon-pseudo-states-angular/register'],
};
```

### Usage

> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.

#### General

##### Component Story Format (CSF, recommended)

```js
import { withPseudo } from 'storybook-addon-pseudo-states-html';

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

##### storyOf Format

```js
import { withPseudo } from 'storybook-addon-pseudo-states-<framework>';

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

There is a default configuration for `StateComposition`.

#### With html

TODO

## Parameters

```typescript
export interface PseudoStatesParameters {
  disabled?: boolean;
  // query for selector to host element[s] that have to be modified
  selector?: Selector;
  // prefix for state classes that will be added to host element
  prefix?: string;
  pseudos?: PseudoStates;
  attributes?: AttributeStates;
}

export type PseudoState = PseudoStateEnum | string;
export type AttributeState = AttributeStatesEnum | string;

export type PseudoStates = Array<PseudoState>;
export type AttributeStates = Array<AttributeState>;

export const PseudoStatesDefault: PseudoStates = [FOCUS, HOVER, ACTIVE];
export const AttributesStatesDefault: AttributeStates = [DISABLED];
export const AttributesStatesInputDefault: AttributeStates = [
  DISABLED,
  READONLY,
];
```
