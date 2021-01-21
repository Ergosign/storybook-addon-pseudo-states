# Storybook Addon Pseudo States

Storybook Addon Pseudo States allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

- <a href="https://philippone.github.io/create-react-app-storybook-addon-pseuo-states/" target="_blank">Live-Demo</a>
- <a href="https://github.com/philippone/create-react-app-storybook-addon-pseuo-states" target="_blank">Example Repo (CRA)</a>

![example](../../addon-example.png)


## Framework Support

| Framework | Display States | Tool-Button to show/hide |
| --------- | :------------: | :----------------------: |
| Angular   |       +        |           +              |
| React     |       +        |           +              |
| Lit       |       +        |           +              |
| HTML      |       +        |           +              |
| Vue       |       +        |           +              |


## Getting started

First of all, you need to install Pseudo States into your project as a dev dependency.

```sh
npm install @ergosign/storybook-addon-pseudo-states-react --save-dev
```

Then, configure it as an addon by adding it to your addons.js file (located in the Storybook config directory).

To display the pseudo states, you have to add specific css classes to your styling, see [Styling](#Styling)

Then, you can set the decorator locally, see [Usage](#Usage).

### Styling

### With Preset

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
  presets: ['@ergosign/storybook-addon-pseudo-states-react/preset-postcss'],
};
```

This creates for each css pseudo class an equivalent as normal css class (for instance `:hover` to `\:hover`), so that 
you can use it in element's class attribute (`<div class=":hover">Element in hover state</div>`).

You can modify post css loader options (see type definition of [PseudoStatesPresetOptions](../share/preset-utils.ts)):

```js
module.exports = {
   presets: [
       {
            name:"@ergosign/storybook-addon-pseudo-states-react/preset-postcss",
            options: {
                rules: [/\.scss$|\.sass$/, ".sass", ...],
                cssLoaderOptions: CssLoaderOptions,
                postCssLoaderPseudoClassesPluginOptions: {
                    prefix: 'pseudo-sates--', // default for angular
                    blacklist: [':nth-child', ':nth-of-type']
                }
            }
        }     
    ] 
}
```

If you set another prefix you have to set the same for the addon, too. 
Therefore, add the following to your `.storybook/preview.js`:

```js
addParameters({
    withPseudo: {
        prefix: "still-pseudo-states--",
    },
});
```

#### Own Webpack config (but automatically generated with PostCss)

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

See [Framework Support](#framework-support) which Frameworks support this feature.

Enable the button by adding it to your `main.js` file (located in the Storybook config directory):

```js
// main.js

module.exports = {
  addons: ['@ergosign/storybook-addon-pseudo-states-react/register'],
};
```

### Usage

> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.

#### General

##### Component Story Format (CSF, recommended)

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-react';

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
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-react';

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

### With React

When using [CSS Modules](https://github.com/css-modules/css-modules), you must use automatically styling generation via `postcss-loader` (see [Styling section](#Styling)).

`attributes` enable component's props.

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-react';

storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      attributes: [], // no attributes to show --> overwrite default [DISABLE]
    },
  })
  .add('Button', () => <Button label="I'm a normal button" />)

  .addParameters({
    withPseudo: {
        pseudo: [...PseudoStatesDefault, 'hover & focus'],
        attributes: [
          ...AttributesStatesDefault,
          'selected',
          'error',
          'isLoading',
          'isReady',
        ]
    },
  })
  .add('Button', () => <Button label="I'm a normal button" />);
```

#### Parameters & Types

See [Types](../share/types.ts)
