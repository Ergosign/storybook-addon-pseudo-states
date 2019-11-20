"use strict";
exports.__esModule = true;
var PseudoStateEnum;
(function (PseudoStateEnum) {
    PseudoStateEnum["HOVER"] = "hover";
    PseudoStateEnum["ACTIVE"] = "active";
    PseudoStateEnum["FOCUS"] = "focus";
    PseudoStateEnum["FOCUS_WITHIN"] = "focus-within";
    PseudoStateEnum["VISITED"] = "visited";
})(PseudoStateEnum = exports.PseudoStateEnum || (exports.PseudoStateEnum = {}));
exports.HOVER = PseudoStateEnum.HOVER, exports.ACTIVE = PseudoStateEnum.ACTIVE, exports.FOCUS = PseudoStateEnum.FOCUS, exports.FOCUS_WITHIN = PseudoStateEnum.FOCUS_WITHIN, exports.VISITED = PseudoStateEnum.VISITED;
var AttributeStatesEnum;
(function (AttributeStatesEnum) {
    AttributeStatesEnum["DISABLED"] = "disabled";
    AttributeStatesEnum["READONLY"] = "readonly";
})(AttributeStatesEnum = exports.AttributeStatesEnum || (exports.AttributeStatesEnum = {}));
exports.DISABLED = AttributeStatesEnum.DISABLED, exports.READONLY = AttributeStatesEnum.READONLY;
exports.PseudoStateOrderDefault = [
    exports.FOCUS, exports.HOVER, exports.ACTIVE
];
exports.AttributesStateOrderDefault = [
    exports.DISABLED
];
exports.AttributesStateOrderInputDefault = [
    exports.DISABLED, exports.READONLY
];
exports.StatesCompositionDefault = {
    pseudo: exports.PseudoStateOrderDefault,
    attributes: exports.AttributesStateOrderDefault
};
exports.StatesCompositionDefaultInputC = {
    pseudo: exports.PseudoStateOrderDefault,
    attributes: exports.AttributesStateOrderInputDefault
};
exports.PseudoStatesDefaultPrefix = ':';
