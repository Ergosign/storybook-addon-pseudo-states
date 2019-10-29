# Stroybook Addon Pseudo States 

Stroybook Addon Pseudo States allows you to automatically display pseudo states (and attribute states) of a component in Storybook's preview area.

This is how it look like:

![example](./addon-example.png)

**TODO** add live example

## Framework Support

| Framework | Display States | Tool-Button to show/hide |
|-----------|:--------------:|:------------------------:|
| Angular   |        +       |             +            |
| React     |        +       |             +*           |
| Lit       |        +       |             +*           |
| HTML      |        +       |                          |
| Vue       |                |                          |

&ast; Could lead to sync problems with other addons, like knobs

## Getting started

First of all, you need to install Pseudo States into your project as a dev dependency.

```sh
npm install @stroybook/addon-pseudo-states --save-dev
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


> **WARNING**: `withPseudo` should always the first element in your `decorators` array because it alters the template of the story.


#### With Angular

At the moment, only [Component Story Format](https://storybook.js.org/docs/formats/component-story-format/) is supported.

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
    // ButtonComponent's styling has prefixed pseudo-states styling
    withPseudo({ prefix: "pseudoclass--" })
  ],
  parameters: {
    // <button> exists inside of angular component ButtonComponent 
    withPseudo: {selector: 'button'} 
  },
};
export default section;

export const Story = () => {
    return {
        component: ButtonComponent,
        moduleMetadata: {
            declarations: [ButtonComponent],
            imports: [CommonModule]
        },
        // ButtonComponent has same properties as props' keys
        props: { 
            label: 'Test Label',
            anotherProperty: true
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
            imports: [CommonModule]
        },
        template: `<test-button [label]="label" [anotherProperty]="anotherProperty"></test-button>`,
        props: { 
            label: 'Test Label',
            anotherProperty: true
      },
    };
};

```

### With React

Presumption:
- Using CSS Modules
    -  which providing the pseudo state/attribute styling
- Component provides prop that controls styling
    - `export interface ExplComponentProps extends PseudoStateDefaults`
    - `PseudoStateDefaults extends PseudoStateActive, PseudoStateFocus, PseudoStateHover, PseudoStateDisabled`

```js
storiesOf('Button', module)
  .addDecorator(withPseudo)
  .addParameters({
    withPseudo: {
      stateComposition: StatesCompositionDefault
    }
  })
  .add('Button', () => (
        <Button label="I'm a normal button"/>
  ))

  .addParameters({
    withPseudo: {
        stateComposition: {
            pseudo: PseudoStateOrderDefault,
            attributes: [...AttributesStateOrderDefault, 'selected', 'error', 'isLoading', 'isReady']
        }
    }
    })
  .add('Button', () => (
      <Button label="I'm a normal button"/>
  ));
```



#### With HTML

```js
storiesOf('Demo', module)
    .addDecorator(withPseudo)
    .addParameters({withPseudo: {selector: null}})
    .add('story1', () => {
            const button = document.createElement('button');
            button.type = 'button';
            button.innerText = 'Hello World!';
            button.addEventListener('click', e => console.log(e));
            return button;
        }
    )
    // story with selecotr on inner element
    .addParameters({withPseudo: {selector: 'span'}} )
    .add('story2', () => {
            const headline = document.createElement('h1');
            const span = document.createElement('span');
            span.innerHTML = 'Hello World';

            headline.appendChild(span);

            return headline;
        }
    );
   
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
export type AttributeState = AttributeStatesEnum | string;
```
