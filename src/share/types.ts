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
  ENABLED = 'enabled',
  READONLY = 'readonly',
}

export const { DISABLED, READONLY } = AttributeStatesEnum;

/**
 * AttributeStatesObject denotes an Attribute by name and value.
 * Default value is true.
 */
export interface AttributeStatesObject {
  name: AttributeStatesEnum | string;
  value?: unknown | true;
}

/**
 * Orientation of components inside the story canvas.
 */
export enum Orientation {
  ROW,
  COLUMN,
}

export const { ROW, COLUMN } = Orientation;

export type PseudoState = PseudoStateEnum | string;
export type AttributeState =
  | AttributeStatesEnum
  | AttributeStatesObject
  | string;

export type PseudoStates = Array<PseudoState>;
export type AttributeStates = Array<AttributeState>;

export const PseudoStatesDefault: PseudoStates = [FOCUS, HOVER, ACTIVE];
export const AttributesStatesDefault: AttributeStates = [
  { name: DISABLED, value: true },
];
export const AttributesStatesInputDefault: AttributeStates = [
  { name: DISABLED, value: true },
  { name: READONLY, value: true },
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
  permutations?: AttributeStates;
  styles?: {
    // orientation of pseudo states wrapper
    orientation?: Orientation;
  };
  // [key: string]: any;
}
