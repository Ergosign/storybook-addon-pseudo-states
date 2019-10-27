# Stroybook Addon Pseudo States 

Stroybook Addon Pseudo States allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

This is how it look like:

![example](./addon-example.png)

**TODO** add live example

## Framework Support

| Framework | Display States | Tool-Button to show/hide |
|-----------|:--------------:|:------------------------:|
| Angular   |        +       |             +            |
| HTML      |        +       |                          |
| React     |                |                          |
| Vue       |                |                          |
| Lit       |                |                          |

## Getting started

First of all, you need to install Pseudo States into your project as a dev dependency.

```sh
npm install @stroybook/addon-pseudo-states --dev
```

Then, configure it as an addon by adding it to your addons.js file (located in the Storybook config directory).

To display the pseudo states, you have to add specifc css classes to your stlying, see [Styling](###Styling)

Then, you can set the decorator locally, see [Usage](###Usage).

### Styling 

#### Automatically generated with PostCss Webpack config

Add [postcss-loader](https://github.com/postcss/postcss-loader) to a Storybook custom webpack config

```js
module.exports = {
    module: {
        rules: [{
                    test: /\.(scss|css)$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                config: {
                                    path: 'postcss.config.js'
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }
            ]
    }
};
```

Add [postcss-pseudo-classes](https://github.com/grouchal/postcss-pseudo-classes) to `postcss.config.js`

```js
module.exports = {
    plugins: {   
        'postcss-pseudo-classes': {}
    }
};
```

#### Manually 

Add pseudo state classes (`.hover`, `.focus`, `.active`, `.yourOwnState`) when styling your component 

```scss
.element {
    //element styling

    &:hover, .hover {
      // hover styling    
    } 
}
```

You can prefix your classes and configure your `prefix` in addon's `parameter object`, for instance use `.pseudoclass--hover` and configure

```
 parameters: {
    withPseudo: {
      selector: "element",
      prefix: "pseudoclass--"
    },
    knobs: {
      disableDebounce: true
    }
  }
```

### Show/Hide Button

You can enable a toolbar button that toggles the Pseudo States in the Preview area. 

See [Framework Support](##Framework Support) which Frameworks support this feature.

Enable the button by adding it to your `addons.js` file (located in the Storybook config directory):
```js
import "@storybook/addon-pseudo-states/register";
```

### Usage
At the moment, only [Component Story Format](https://storybook.js.org/docs/formats/component-story-format/) is supported.

> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.


#### With Angular

```js
import { withPseudo } from "@storybook/addon-pseudo-states/angular";

const section = {
  component: ButtonComponent,
  title: "Button",
  moduleMetadata: {
    declarations: [ButtonComponent],
    imports: [CommonModule]
  },
  decorators: [
    withPseudo({ prefix: "pseudoclass--" })
  ],
  parameters: {
    withPseudo: {selector: 'button'}
  },
};
export default section;

const normalButton = {
  component: ButtonComponent,
  props: { ...defaultProps },
  declarations: [ButtonComponent],
  moduleMetadata: {
    declarations: [ButtonComponent],
    imports: [CommonModule]
  },
  template: `<test-button [label]="label" [primary]="'primary'" style="display: flex;"></test-button>`

};
export const Normal = () => normalButton;

```

#### With HTML


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
export type AttributeState = AttributeStatesEnum | string;
```
