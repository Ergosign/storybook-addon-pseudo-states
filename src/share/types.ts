import { WrapperSettings } from '@storybook/addons';

export enum PseudoStateEnum {
  HOVER = 'hover',
  ACTIVE = 'active',
  FOCUS = 'focus',
  FOCUS_WITHIN = 'focus-within',
  VISITED = 'visited',
}

export const { HOVER, ACTIVE, FOCUS, FOCUS_WITHIN, VISITED } = PseudoStateEnum;

export enum AttributeStatesEnum {
  DISABLED = 'disabled',
  READONLY = 'readonly',
}

export const { DISABLED, READONLY } = AttributeStatesEnum;

export enum Orientation {
  ROW,
  COLUMN,
}
export const { ROW, COLUMN } = Orientation;

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

export interface WrapperPseudoStateSettings extends WrapperSettings {
  parameters: PseudoStatesParameters;
}

export const PseudoStatesDefaultPrefix = ':';

export const PseudoStatesDefaultPrefixAlternative = 'pseudo-states--';

export type Selector = string | Array<string> | null | undefined;

export interface PseudoStatesParameters {
  disabled?: boolean;
  // query for selector to host element[s] that have to be modified
  selector?: Selector;
  // prefix for state classes that will be added to host element
  prefix?: string;
  pseudos?: PseudoStates;
  attributes?: AttributeStates;
  styles?: {
    // orientation of pseudo states wrapper
    orientation?: Orientation;
  };
  // [key: string]: any;
}
