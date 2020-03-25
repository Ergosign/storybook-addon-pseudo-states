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

You can modify post css loader options:

```js
module.exports = {
   presets: [
       {
            name:"@ergosign/storybook-addon-pseudo-states-angular/preset-postcss",
            options: {
                postCssLoaderOptions: {
                    //prefix: 'pseudo-sates--', // default for angular
                    blacklist: [':nth-child', ':nth-of-type']
                }
            }
        }     
    ] 
}
```

It's not recommended to alter the prefix option. But if you need to be change the prefix then it must not start with `:` 
because Angular's scoping put scope's context before each colon and breaks styling.


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
import { withPseudo } from '@ergosign/storybook-addon-pseudo-states-<framework>';

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

There is a default configuration for `StateComposition`.

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
