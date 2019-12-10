import {
  addons,
  makeDecorator,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import { parameters } from '../share/constants';
import {
  PseudoState,
  PseudoStatesDefaultPrefix,
  Selector,
  StatesComposition,
  StatesCompositionDefault,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { getMixedPseudoStates } from '../share/utils';
import { styles } from '../share/styles';

const pseudoStateFn = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
): any => {
  const channel = addons.getChannel();
  const addonDisabled = settings?.parameters?.disabled || false;

  // notify toolbar button
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  if (addonDisabled) {
    return getStory(context);
  }

  // use selector form parameters or if not set use settings selector or null
  const selector: Selector | null = settings?.parameters?.selector || null;

  const composition: StatesComposition =
    settings?.parameters?.stateComposition || StatesCompositionDefault;

  const prefix: string =
    settings?.parameters?.prefix || PseudoStatesDefaultPrefix;

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
                <div v-for="state in composition.pseudo"
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
                <div v-for="attr in composition.attributes"
                     class="pseudo-states-addon__story"
                     :style="styles.storyContainer"
                     :class="'pseudo-states-addon__story--attr-' + attr">
                    <div class="pseudo-states-addon__story__header"
                         :style="styles.storyHeader">{{attr}}:
                    </div>
                    <div class="pseudo-states-addon__story__container">
                        <story ref="attr"/>
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
        selector,
        composition,
        prefix,
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
        if (composition.pseudo) {
          for (const pState of composition.pseudo) {
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

              if (subPseudoStates.length >= 1) {
                for (const s of subPseudoStates) {
                  host?.classList.add(prefix + s.trim());
                }
              } else {
                // and append pseudo class
                host?.classList.add(prefix + pState);
              }
            };

            if (container) {
              applyPseudoStateToHost(container, selector);
            }
          }
        }
      },
      updateAttributes() {
        if (composition.attributes) {
          for (const attr of composition.attributes) {
            const container = document.querySelector(
              `.pseudo-states-addon__story--attr-${attr} .pseudo-states-addon__story__container`
            );

            const elem = container?.children[0];

            // get vue component
            // @ts-ignore
            const vm = elem?.__vue__.$children[0];

            if (vm) {
              // set attribute to true
              if (Object.prototype.hasOwnProperty.call(vm, attr)) {
                vm[attr] = true;
              }

              // set attribute to element to support :disabled, :readonly, etc.
              if (vm?.$el.hasOwnProperty(attr)) {
                vm.$el[attr] = true;
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
  ...parameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => pseudoStateFn(getStory, context, settings),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
