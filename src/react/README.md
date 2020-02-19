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
npm install storybook-addon-pseudo-states-react --save-dev
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

### Show/Hide Button (alpha only)

You can enable a toolbar button that toggles the Pseudo States in the Preview area.

See [Framework Support](##Framework Support) which Frameworks support this feature.

Enable the button by adding it to your `addons.js` file (located in the Storybook config directory):

```js
import 'storybook-addon-pseudo-states-react/register';
```

### Usage

> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.

#### General

##### Component Story Format (CSF, recommended)

```js
import { withPseudo } from 'storybook-addon-pseudo-states-react';

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
      stateComposition: {
        pseudo: ['focus', 'hover', 'hover & focus', 'active'],
        attributes: ['disabled', 'readonly', 'error'],
      },
    },
  })
  .add('Icon Button', () => <Button />);
```

There is a default configuration for `StateComposition`.

### With React

When using [CSS Modules](https://github.com/css-modules/css-modules), you must use automatically styling generation via `postcss-loader` (see [Styling section](###Styling)).

`StateComposition.attributes` enable component's props.

```js
import { withPseudo } from 'storybook-addon-pseudo-states-react';

storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      stateComposition: StatesCompositionDefault,
    },
  })
  .add('Button', () => <Button label="I'm a normal button" />)

  .addParameters({
    withPseudo: {
      stateComposition: {
        pseudo: [...PseudoStatesDefault, 'hover & focus'],
        attributes: [
          ...AttributesStatesDefault,
          'selected',
          'error',
          'isLoading',
          'isReady',
        ],
      },
    },
  })
  .add('Button', () => <Button label="I'm a normal button" />);
```

#### With Angular

At the moment, only [Component Story Format](https://storybook.js.org/docs/formats/component-story-format/) is supported (tested).

```js
import { withPseudo } from 'storybook-addon-pseudo-states-angular';

const section = {
  component: ButtonComponent,
  title: 'Button',
  moduleMetadata: {
    declarations: [ButtonComponent],
    imports: [CommonModule],
  },
  decorators: [
    // ButtonComponent's styling has prefixed pseudo-states styling
    withPseudo({ prefix: 'pseudoclass--' }),
  ],
  parameters: {
    // <button> exists inside of angular component ButtonComponent
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

#### With HTML

```js
storiesOf('Demo', module)
  .addDecorator(withPseudo)
  .addParameters({ withPseudo: { selector: null } })
  .add('story1', () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'Hello World!';
    button.addEventListener('click', e => console.log(e));
    return button;
  })
  // story with selecotr on inner element
  .addParameters({ withPseudo: { selector: 'span' } })
  .add('story2', () => {
    const headline = document.createElement('h1');
    const span = document.createElement('span');
    span.innerHTML = 'Hello World';

    headline.appendChild(span);

    return headline;
  });
```

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
