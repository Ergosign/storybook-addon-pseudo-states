# Storybook Addon Pseudo States

Storybook Addon Pseudo States allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

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
  presets: ['@ergosign/storybook-addon-pseudo-states-lit/preset-postcss'],
};
```


You can modify post css loader options (see type definition of [PseudoStatesPresetOptions](../share/preset-utils.ts)):

```js
module.exports = {
   presets: [
       {
            name: '@ergosign/storybook-addon-pseudo-states-lit/preset-postcss',
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
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-lit';

storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      selector: 'button', // css selector of pseudo state's host element
      pseudo: ['focus', 'hover', 'hover & focus', 'active'],
      attributes: ['disabled', 'readonly', 'error']
    },
  })
  .add('Icon Button', () => <Button />);
```

There is a default configuration for `selector`, `pseudos` and `attributes`. Thus, you can leave `withPseudo` options empty.

#### Parameters & Types

See [Types](../share/types.ts)
