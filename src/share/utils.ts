import { PseudoState } from './types';

/**
 * Sanitize pseudoname so that you can use it as css classe
 */
export const sanitizePseudoName = (pseudoStateName: PseudoState) => {
  return pseudoStateName.replace(/\s/g, '').replace('&', '-');
};

export const getMixedPseudoStates = (pseudoState: PseudoState) => {
  return pseudoState.split('&');
};
