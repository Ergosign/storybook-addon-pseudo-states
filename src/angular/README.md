# Storybook Addon Pseudo States

Storybook Addon Pseudo States allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

- <a href="https://philippone.github.io/angular-ci-storybook-pseudo-states-example/" target="_blank">Live-Demo</a>
- <a href="https://github.com/philippone/angular-ci-storybook-pseudo-states-example" target="_blank">Example Repo (Angular CI)</a>

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
npm install @ergosign/storybook-addon-pseudo-states-angular --save-dev
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
  presets: ['@ergosign/storybook-addon-pseudo-states-angular/preset-postcss'],
};
```

This creates for each css pseudo class an equivalent as normal css class (for instance `:hover` to `\:hover`), so that 
you can use it in element's class attribute (`<div class=":hover">Element in hover state</div>`).

You can modify post css loader options (see type definition of [PseudoStatesPresetOptions](../share/preset-utils.ts)):

```js
module.exports = {
   presets: [
       {
            name:"@ergosign/storybook-addon-pseudo-states-angular/preset-postcss",
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

It's not recommended to alter the prefix option. But if you need to be change the prefix then it must not start with `:` 
because Angular's scoping put scope's context before each colon and breaks styling.

If you set another prefix you have to set the same for the addon, too. 
Therefore, add the following to your `.storybook/preview.js`:

```js
addParameters({
    withPseudo: {
        prefix: "still-pseudo-states--",
    },
});
```

### Show/Hide Toolbar-Button

You can enable a toolbar button that toggles the Pseudo States in the Preview area.

See [Framework Support](#framework-support) which Frameworks support this feature.

Enable the button by adding it to your `main.js` file (located in the Storybook config directory):

```js
// main.js

module.exports = {
  addons: ['@ergosign/storybook-addon-pseudo-states-angular/register'],
};
```

### Usage

> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.

#### Component Story Format (CSF, recommended)

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-angular';

const section = {
  component: ButtonComponent,
  title: 'Button',
  moduleMetadata: {
    declarations: [ButtonComponent],
    imports: [CommonModule],
  },
  decorators: [withPseudo()],
  parameters: {
    // <button> is a ViewChild of ButtonComponent
    withPseudo: { selector: 'button' },
  },
};
export default section;

export const Story = () => {
  return {
    component: ButtonComponent,
    moduleMetadata: {
      declarations: [ButtonComponent],
      imports: [CommonModule],
    },
    // ButtonComponent has same properties as props' keys
    props: {
      label: 'Test Label',
      anotherProperty: true,
    },
  };
};

export const StoryWithTemplate = () => {
  return {
    // always provide component!
    component: ButtonComponent,
    moduleMetadata: {
      entryComponents: [ButtonComponent], // required to support other addons, like knobs addon
      declarations: [ButtonComponent],
      imports: [CommonModule],
    },
    template: `<test-button [label]="label" [anotherProperty]="anotherProperty"></test-button>`,
    props: {
      label: 'Test Label',
      anotherProperty: true,
    },
  };
};
```

#### storyOf Format

```js
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-angular';

storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      selector: 'button', // css selector of pseudo state's host element
      pseudos: ['focus', 'hover', 'hover & focus', 'active'],
      attributes: ['disabled', 'readonly', 'error'],
    },
  })
  .add('Icon Button', () => <Button />);
```

There is a default configuration for `selector`, `pseudos` and `attributes`. Thus, you can leave `withPseudo` options it empty.

#### Parameters & Types

See [Types](../share/types.ts)
