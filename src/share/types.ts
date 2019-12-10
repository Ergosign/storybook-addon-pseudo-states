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

export type PseudoState = PseudoStateEnum | string;
export type AttributeState = AttributeStatesEnum | string;

export interface StatesComposition {
  pseudo?: Array<PseudoState>;
  attributes?: Array<AttributeState>;
}

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

export const StatesCompositionDefault: StatesComposition = {
  pseudo: PseudoStateOrderDefault,
  attributes: AttributesStateOrderDefault,
};

export const StatesCompositionDefaultInputC = {
  pseudo: PseudoStateOrderDefault,
  attributes: AttributesStateOrderInputDefault,
};

export interface WrapperPseudoStateSettings extends WrapperSettings {
  parameters: PseudoStatesParameters;
}

export const PseudoStatesDefaultPrefix = ':';

export type Selector = string | Array<string>;

export interface PseudoStatesParameters {
  disabled?: boolean;
  // query for selector to host element[s] that have to be modified
  selector?: Selector;
  // prefix for state classes that will be added to host element
  prefix?: string;
  stateComposition?: StatesComposition;
  // [key: string]: any;
}
