# Pseudo State Addon

## Parameters

```js
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


## Frameworks

### Angular

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
