import {
  addons,
  makeDecorator,
  OptionsParameter,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import { addonParameters } from '../share/constants';
import {
  AttributesStatesDefault,
  PseudoState,
  PseudoStatesDefault,
  PseudoStatesDefaultPrefix,
  PseudoStatesParameters,
  Selector,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { getMixedPseudoStates } from '../share/utils';
import { styles } from '../share/styles';
import { AttributeStatesObj } from '../share/AttributeStatesObj';

const pseudoStateFn = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
): any => {
  const channel = addons.getChannel();

  // are options set by user
  const options: OptionsParameter = settings?.options;

  // Are parameters set by user
  const parameters: PseudoStatesParameters = settings?.parameters || {};

  const addonDisabled = settings?.parameters?.disabled || false;

  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  if (addonDisabled) {
    return getStory(context);
  }

  // Use user values, default user options or default values
  parameters.pseudos =
    parameters?.pseudos || options?.pseudos || PseudoStatesDefault;
  parameters.attributes =
    parameters?.attributes || options?.attributes || AttributesStatesDefault;

  // convert attributes to object notation
  const attributesAsObject: Array<AttributeStatesObj> = [
    ...parameters.attributes,
  ].map((item) => AttributeStatesObj.fromAttributeState(item));

  // Use prefix without `:` because angular add component scope before each `:`
  // Maybe not editable by user in angular context?
  parameters.prefix =
    parameters?.prefix || options?.prefix || PseudoStatesDefaultPrefix;

  // use selector form addonParameters or if not set use settings selector or null
  parameters.selector = settings?.parameters?.selector || null;

  return {
    template: `
        <div>
            <div class="pseudo-states-addon__container"
                 v-if="!isDisabled">
                <!-- nomal -->
                <div class="pseudo-states-addon__story pseudo-states-addon__story--Normal"
                     :style="styles.storyContainer">
                    <div class="pseudo-states-addon__story__header"
                         :style="styles.storyHeader">Normal:
                    </div>
                    <div class="pseudo-states-addon__story__container">
                        <story/>
                    </div>
                </div>

                <!-- pseudo states -->
                <div v-for="state in parameters.pseudos"
                     class="pseudo-states-addon__story"
                     :style="styles.storyContainer"
                     :class="'pseudo-states-addon__story--' + state">
                    <div class="pseudo-states-addon__story__header"
                         :style="styles.storyHeader">{{state}}:
                    </div>
                    <div class="pseudo-states-addon__story__container">
                        <story/>
                    </div>
                </div>

                <!-- attributes -->
                <div v-for="attr in attributesAsObject"
                     class="pseudo-states-addon__story"
                     :style="styles.storyContainer"
                     :class="'pseudo-states-addon__story--attr-' + attr.attr">
                    <div class="pseudo-states-addon__story__header"
                         :style="styles.storyHeader">{{attr.attr}}:
                    </div>
                    <div class="pseudo-states-addon__story__container">
                        <story ref="attr.attr"/>
                    </div>
                </div>

            </div>
            <!-- display original story when addon is disabled by toolbar -->
            <div v-if="isDisabled">
                <story/>
            </div>
        </div>
    `,
    data() {
      return {
        styles,
        parameters,
        attributesAsObject,
        isDisabled: false,
      };
    },
    mounted() {
      channel.once(STORY_RENDERED, () => {
        this.updatePseudoStates();
        this.updateAttributes();
      });

      channel.addListener(SAPS_BUTTON_CLICK, (isDisabled: boolean) => {
        this.isDisabled = isDisabled;
      });

      channel.once(STORY_CHANGED, () => {
        channel.removeAllListeners(SAPS_BUTTON_CLICK);
      });
    },
    updated() {
      if (!this.isDisabled) {
        this.updatePseudoStates();
        this.updateAttributes();
      }
    },
    methods: {
      updatePseudoStates() {
        if (parameters.pseudos) {
          for (const pState of parameters.pseudos) {
            const container = document.querySelector(
              `.pseudo-states-addon__story--${pState} .pseudo-states-addon__story__container`
            );

            const applyPseudoStateToHost = (
              containerElem: Element,
              selectorStr: Selector | null
            ) => {
              let host: Element | null = null;
              if (!selectorStr) {
                host = containerElem.children[0];
              } else if (typeof selectorStr === 'string') {
                host = containerElem.querySelector(selectorStr);
              } else if (Array.isArray(selectorStr)) {
                for (const s of selectorStr as Array<PseudoState>) {
                  applyPseudoStateToHost(containerElem, s);
                }
              }

              const subPseudoStates = getMixedPseudoStates(pState);
              // and append pseudo class
              for (const s of subPseudoStates) {
                host?.classList.add(parameters.prefix + s.trim());
              }
            };

            if (container) {
              applyPseudoStateToHost(container, parameters.selector);
            }
          }
        }
      },
      updateAttributes() {
        if (attributesAsObject) {
          for (const attr of attributesAsObject) {
            const container = document.querySelector(
              `.pseudo-states-addon__story--attr-${attr.attr} .pseudo-states-addon__story__container`
            );

            const elem = container?.children[0];

            // get vue component
            // @ts-ignore
            const vm = elem?.__vue__.$children[0];

            if (vm) {
              // set attribute to true
              if (Object.prototype.hasOwnProperty.call(vm, attr.attr)) {
                vm[attr.attr] = attr.value;
              }

              // set attribute to element to support :disabled, :readonly, etc.
              if (vm?.$el.hasOwnProperty(attr)) {
                vm.$el[attr.attr] = attr.value;
              }

              // force update
              vm.$forceUpdate();
            }
          }
        }
      },
    },
  };
};

export const withPseudo = makeDecorator({
  ...addonParameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => pseudoStateFn(getStory, context, settings),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
