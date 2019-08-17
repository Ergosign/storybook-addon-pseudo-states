"use strict";
// register.js
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
var core_events_1 = require("@storybook/core-events");
var addons_1 = __importStar(require("@storybook/addons"));
var ADDON_ID = 'pseudo-states';
var PANEL_ID = ADDON_ID + "/panel";
var PREVIEW_ID = ADDON_ID + "/preview";
var TOOL_ID = ADDON_ID + "/tool";
var MyPanel = /** @class */ (function (_super) {
    __extends(MyPanel, _super);
    function MyPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { value: '' };
        _this.onSomeAction = function (text) {
            // do something with the passed data
            console.log('onSomeAction', text);
        };
        _this.onStoryChange = function (id) {
            // do something with the new selected storyId
            console.log('onStoryChange', id);
        };
        return _this;
    }
    MyPanel.prototype.componentDidMount = function () {
        var api = this.props.api;
        api.on('pseudo/addPseudo', this.onSomeAction);
        api.on(core_events_1.STORY_CHANGED, this.onStoryChange);
    };
    MyPanel.prototype.componentWillUnmount = function () {
        var api = this.props.api;
        api.off('pseudo/addPseudo', this.onSomeAction);
        api.off(core_events_1.STORY_CHANGED, this.onStoryChange);
    };
    MyPanel.prototype.render = function () {
        var value = this.state.value;
        var active = this.props.active;
        var api = this.props.api;
        if (active && api) {
            var storyData = api.getCurrentStoryData();
            if (storyData) {
                // console.log(storyData);
                // const story = api.selectStory('Basics', 'Icon');
                // console.log('story', story);
            }
        }
        return active ? react_1.default.createElement("div", null,
            "value:",
            value) : null;
    };
    return MyPanel;
}(react_1.default.Component));
var MyTool = /** @class */ (function (_super) {
    __extends(MyTool, _super);
    function MyTool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyTool.prototype.render = function () {
        return react_1.default.createElement("div", null, "tool test");
    };
    return MyTool;
}(react_1.default.Component));
var MyPreview = /** @class */ (function (_super) {
    __extends(MyPreview, _super);
    function MyPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyPreview.prototype.render = function () {
        return react_1.default.createElement("div", null, "tool test");
    };
    return MyPreview;
}(react_1.default.Component));
addons_1.default.register(ADDON_ID, function (api) {
    var title = 'Pseudo States';
    addons_1.default.addPanel(PANEL_ID, {
        title: title,
        render: function (_a) {
            var active = _a.active, key = _a.key;
            return react_1.default.createElement(MyPanel, { key: key, api: api, active: active });
        }
    });
    addons_1.default.add(TOOL_ID, {
        title: 'pseudo test',
        type: addons_1.types.TOOL,
        match: function (_a) {
            var viewMode = _a.viewMode;
            return viewMode === 'story';
        },
        render: function () { return react_1.default.createElement(MyTool, { api: api }); },
    });
    // addons.add(PREVIEW_ID, {
    //     title: 'pseudo test',
    //     type: types.PREVIEW,
    //     match: ({ viewMode }) => viewMode === 'story',
    //     render: () => <MyTool api={api} />,
    // });
});
console.log('pseudo state addon registerd');
