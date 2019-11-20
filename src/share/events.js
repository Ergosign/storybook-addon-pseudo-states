"use strict";
exports.__esModule = true;
var PseudoStateEventsEnum;
(function (PseudoStateEventsEnum) {
    PseudoStateEventsEnum["SAPS_BUTTON_CLICK"] = "saps/toolbutton-click";
    PseudoStateEventsEnum["SAPS_INIT_PSEUDO_STATES"] = "saps/init-pseudo-states";
})(PseudoStateEventsEnum || (PseudoStateEventsEnum = {}));
// Enables: `import PseudoStateEventsEnum from ...`
exports["default"] = PseudoStateEventsEnum;
// Enables: `import * as PseudoStateEventsEnum from ...` or `import { SAPS_BUTTON_CLICK } as PseudoStateEventsEnum from ...`
// This is the preferred method
exports.SAPS_BUTTON_CLICK = PseudoStateEventsEnum.SAPS_BUTTON_CLICK, exports.SAPS_INIT_PSEUDO_STATES = PseudoStateEventsEnum.SAPS_INIT_PSEUDO_STATES;
