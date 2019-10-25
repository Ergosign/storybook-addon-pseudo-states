"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var addons_1 = __importStar(require("@storybook/addons"));
var PseudoStateGenerator = /** @class */ (function (_super) {
    __extends(PseudoStateGenerator, _super);
    function PseudoStateGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PseudoStateGenerator.prototype.render = function () {
        console.log('pseudostategenerator');
        return react_1.default.createElement("div", null, "tool test");
    };
    return PseudoStateGenerator;
}(react_1.default.Component));
exports.default = addons_1.makeDecorator({
    name: 'withPseudo',
    parameterName: 'pseudo',
    // This means don't run this decorator if the withPseudo decorator is not set
    skipIfNoParametersOrOptions: false,
    allowDeprecatedUsage: false,
    wrapper: function (getStory, context, _a) {
        var parameters = _a.parameters;
        // Get an instance to the channel where you can communicate with the manager and the preview.
        var channel = addons_1.default.getChannel();
        // Our simple API above simply sets the notes parameter to a string,
        // which we send to the channel
        channel.emit('pseudo/addPseudo', parameters);
        // we can also add subscriptions here using channel.on('eventName', callback);
        // plain html
        //  story.classList.add('testclass');
        //  return html`<div> test ${story} </div>`;
        var story = getStory(context);
        console.log('context', context, parameters);
        // console.log('story', story);
        // console.log('before', story, story.getHTML(), story.getTemplateElement());
        //
        var ele = story.getTemplateElement();
        // debugger;
        ele.content.firstChild.classList.add('testclass');
        //
        console.log('after', story, story.getHTML(), story.getTemplateElement());
        // story.strings = [story.strings, story.strings].flat();
        // const first = '<PseudoStateGenerator>' + story.strings[0];
        // const last = story.strings[story.strings.length - 1] + '</PseudoStateGenerator>';
        //
        // const test = [first, story.strings.slice(1, -1), last].flat();
        return react_1.default.createElement("div", null,
            " test ",
            story,
            " ");
        //  return story;
        // return null;
    }
});
console.log('register decorator');
