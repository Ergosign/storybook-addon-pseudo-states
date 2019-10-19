export enum PseudoStateEnum {
  FOCUS = 'focus',
  HOVER = 'hover',
  FOCUS_WITHIN = 'focus-within',
  ACTIVE = 'active'
}

export enum AttributeStatesEnum {
  DISABLED = 'disabled',
  READONLY = 'readonly'
}

export type PseudoState = PseudoStateEnum | string;
export type AttributeState = AttributeStatesEnum | string;

export type StatesComposition = {
  pseudo?: { [key: string]: boolean },
  attributes?: { [key: string]: boolean }
}


export const PseudoStateOrder: Array<PseudoStateEnum | string> = [
  PseudoStateEnum.FOCUS, PseudoStateEnum.HOVER, PseudoStateEnum.ACTIVE
];

export const StatesDefaultComposition: StatesComposition = {
  pseudo: {
    'focus': true,
    'focus-within': false,
    'hover': true,
    'active': true
  },
  attributes: {
    'disabled': true,
    'readonly': false
  }
};

export const StatesDefaultInputComposition = {
  pseudo: {
    'focus': true,
    'focus-within': false,
    'hover': true,
    'active': true
  },
  attributes: {
    'disabled': true,
    'readonly': true
  }
};
