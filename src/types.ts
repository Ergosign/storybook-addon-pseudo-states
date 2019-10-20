import { WrapperSettings } from '@storybook/addons';

export enum PseudoStateEnum {
  HOVER = 'hover',
  ACTIVE = 'active',
  FOCUS = 'focus',
  FOCUS_WITHIN = 'focus-within',
  VISITED = 'visited'
}

export enum AttributeStatesEnum {
  DISABLED = 'disabled',
  READONLY = 'readonly'
}

export type PseudoState = PseudoStateEnum | string;
export type AttributeState = AttributeStatesEnum | string;

export interface StatesComposition {
  pseudo?: Array<PseudoState>;
  attributes?: Array<AttributeState>;
}

export const PseudoStateOrderDefault: Array<PseudoState> = [
  PseudoStateEnum.FOCUS, PseudoStateEnum.HOVER, PseudoStateEnum.ACTIVE
];
export const AttributesStateOrderDefault: Array<AttributeState> = [
  AttributeStatesEnum.DISABLED
];
export const AttributesStateOrderInputDefault: Array<AttributeState> = [
  AttributeStatesEnum.DISABLED, AttributeStatesEnum.READONLY
];

export const StatesCompositionDefault: StatesComposition = {
  pseudo: PseudoStateOrderDefault,
  attributes: AttributesStateOrderDefault
};

export const StatesCompositionDefaultInputC = {
  pseudo: PseudoStateOrderDefault,
  attributes: AttributesStateOrderInputDefault
};

export interface WrapperPseudoStateSettings extends WrapperSettings {
  parameters: PseudoStatesParameters
}

export interface PseudoStatesParameters {
  disabled?: boolean;
  selector?: string;
  stateComposition?: StatesComposition;
  // [key: string]: any;
}
