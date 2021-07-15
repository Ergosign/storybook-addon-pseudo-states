// eslint-disable-next-line no-shadow
enum PseudoStateEventsEnum {
  SAPS_BUTTON_CLICK = 'saps/toolbutton-click',
  SAPS_INIT_PSEUDO_STATES = 'saps/init-pseudo-states',
}
// Enables: `import PseudoStateEventsEnum from ...`
export default PseudoStateEventsEnum;
// Enables: `import * as PseudoStateEventsEnum from ...` or `import { SAPS_BUTTON_CLICK } as PseudoStateEventsEnum from ...`
// This is the preferred method
export const {
  SAPS_BUTTON_CLICK = 'saps/toolbutton-click',
  SAPS_INIT_PSEUDO_STATES = 'saps/init-pseudo-states',
} = PseudoStateEventsEnum;
