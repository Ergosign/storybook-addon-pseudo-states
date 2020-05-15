import { PseudoState } from './types';

/**
 * Sanitize pseudoname so that you can use it as css class
 */
export const sanitizePseudoName = (pseudoStateName: PseudoState): PseudoState =>
  // remove whitespace
  pseudoStateName.replace(/\s/g, '').replace(/\W/g, '').replace('&', '-');

/**
 * Get mixed pseudo states
 * @param pseudoState
 */
export const getMixedPseudoStates = (
  pseudoState: PseudoState
): Array<PseudoState> =>
  // split at &
  // replace non-word character
  // trim
  pseudoState.split('&').map((item: string) => item.replace(/\W/g, '').trim());
