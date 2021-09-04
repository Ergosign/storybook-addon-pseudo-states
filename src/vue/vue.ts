import {
  addons,
  makeDecorator,
  OptionsParameter,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import Vue from 'vue';
import { AttributeStatesObj } from '../share/AttributeStatesObj';
import { addonParameters } from '../share/constants';
import { SAPS_BUTTON_CLICK, SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { styles } from '../share/styles';
import {
  AttributesStatesDefault,
  Orientation,
  PermutationStatesObject,
  PseudoState,
  PseudoStatesDefault,
  PseudoStatesDefaultPrefix,
  PseudoStatesParameters,
  WrapperPseudoStateSettings,
} from '../share/types';
import { getMixedPseudoStates } from '../share/utils';
import { PermutationStatsObj } from '../share/PermutationsStatesObj';

const pseudoStateFn = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
): any => {
  const channel = addons.getChannel();

  const addonDisabled = settings?.parameters?.disabled || false;
  channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

  // Don't modify the story if the addon is disabled
  if (addonDisabled) {
    return getStory(context);
  }

  // Assemble config
  const opts: OptionsParameter = settings?.options || {};
  const parameters: PseudoStatesParameters = settings?.parameters || {};

  const config: PseudoStatesParameters = {
    ...parameters,
    pseudos: parameters.pseudos || opts.pseudos || PseudoStatesDefault,
    attributes:
      parameters.attributes || opts.attributes || AttributesStatesDefault,
    prefix: parameters?.prefix || opts?.prefix || PseudoStatesDefaultPrefix,
    selector: settings?.parameters?.selector || null,
  };

  // Convert attributes to object notation
  const attributes: Array<AttributeStatesObj> =
    config.attributes?.map((item) =>
      AttributeStatesObj.fromAttributeState(item)
    ) || [];

  // convert permutations to object notation
  let permutationsAsObject: Array<PermutationStatsObj> = [];
  if (parameters.permutations) {
    permutationsAsObject = [...parameters?.permutations].map((item) =>
      PermutationStatsObj.fromPermutationState(item)
    );
  }

  if (permutationsAsObject.length > 0) {
    config.permutations = permutationsAsObject;
  }

  const numberOfPseudos = config.pseudos ? config.pseudos.length : 0;
  const numberOfAttributes = config.attributes ? config.attributes.length : 0;

  return {
    template: `
      <div>
      <div class="pseudo-states-addon__container"
           :style="{ ...styles.gridContainer, ...getGridStyles() }"
           v-if="!isDisabled">
        <!-- Normal -->
        <div
          class="pseudo-states-addon__story pseudo-states-addon__story--Normal"
          :style="styles.storyContainer"
        >
          <div
            class="pseudo-states-addon__story__header"
            :style="styles.storyHeader"
          >
            normal:
          </div>
          <div class="pseudo-states-addon__story__container">
            <story />
          </div>
        </div>

        <!-- Pseudo states -->
        <div
          v-for="state in config.pseudos"
          class="pseudo-states-addon__story"
          :class="'pseudo-states-addon__story--' + state"
          :style="styles.storyContainer"
        >
          <div
            class="pseudo-states-addon__story__header"
            :style="styles.storyHeader"
          >
            {{ state }}:
          </div>
          <div class="pseudo-states-addon__story__container">
            <story :ref="state" />
          </div>
        </div>

        <!-- Attributes -->
        <div
          v-for="attribute in attributes"
          class="pseudo-states-addon__story"
          :class="'pseudo-states-addon__story--attr-' + attribute.attr"
          :style="styles.storyContainer"
        >
          <div
            class="pseudo-states-addon__story__header"
            :style="styles.storyHeader"
          >
            {{ attribute.attr }}:
          </div>
          <div class="pseudo-states-addon__story__container">
            <story :ref="attribute.attr" />
          </div>
        </div>


        <!-- Permutations -->
        <template
          v-for="permutation in config.permutations"
        >
          <!-- Normal -->
          <div
            class="pseudo-states-addon__story"
            :class="'pseudo-states-addon__story--' + permutation.label"
            :style="styles.storyContainer"
          > 
            <div
              class="pseudo-states-addon__story__header"
              :style="styles.storyHeader"
            >
              {{ permutation.label }}
            </div>
            <div class="pseudo-states-addon__story__container">
              <story :ref="permutation.attr" />
            </div>
          </div>

          <!-- Pseudo states -->
          <div
            v-for="state in config.pseudos"
            class="pseudo-states-addon__story"
            :class="'pseudo-states-addon__story--' + state"
            :style="styles.storyContainer"
          >
            <div
              class="pseudo-states-addon__story__header"
              :style="styles.storyHeader"
            >
              {{ state }}:
            </div>
            <div class="pseudo-states-addon__story__container">
              <story :ref="permutation.attr + '-'+ state" />
            </div>
          </div>

          <!-- Attributes -->
          <div
            v-for="attribute in attributes"
            class="pseudo-states-addon__story"
            :class="'pseudo-states-addon__story--attr-' + attribute.attr"
            :style="styles.storyContainer"
          >
            <div
              class="pseudo-states-addon__story__header"
              :style="styles.storyHeader"
            >
              {{ attribute.attr }}:
            </div>
            <div class="pseudo-states-addon__story__container">
              <story :ref="permutation.attr + '-'+ attribute.attr" />
            </div>
          </div>

        </template>
      </div>
      <!-- display original story when addon is disabled by toolbar -->
      <div v-if="isDisabled">
        <story />
      </div>
      </div>
    `,

    data: () => ({
      styles,
      config,
      attributes,
      isDisabled: false,
    }),

    mounted() {
      // Initialize once the story has loaded
      channel.once(STORY_RENDERED, () => this.refresh());

      /**
       * Listen for changes of dark mode add-on and re-apply pseudo states.
       * https://github.com/hipstersmoothie/storybook-dark-mode
       */
      channel.on('DARK_MODE', this.updatePseudoStates);

      // React to toolbar events
      channel.addListener(SAPS_BUTTON_CLICK, (isDisabled: boolean) => {
        this.isDisabled = isDisabled;
      });

      // Cleanup when the story is no longer active
      channel.once(STORY_CHANGED, () => {
        channel.removeAllListeners(SAPS_BUTTON_CLICK);
        channel.off('DARK_MODE', this.updatePseudoStates);
      });
    },

    updated() {
      if (!this.isDisabled) {
        this.refresh();
      }
    },

    methods: {
      /**
       * Applies pseudostates and attributes again when something has changed.
       */
      refresh() {
        this.updateAttributes();
        setTimeout(() => {
          this.updatePseudoStates();
        });
      },

      /**
       * Applies pseudo state classes to a component or a selector within the component.
       */
      updatePseudoStates(this: any) {
        if (!this.config?.pseudos) {
          return;
        }

        this.config.pseudos.forEach((state: PseudoState) => {
          if (!this.$refs[state]) {
            return;
          }

          const [component] = this.$refs[state];

          if (component?.$el) {
            this.applyPseudoState(component.$el, state, this.config);
          }
        });

        if (!this.config?.permutations) {
          return;
        }
        this.config.permutations.forEach(
          (permutation: PermutationStatesObject) => {
            this.config.pseudos.forEach((state: PseudoState) => {
              if (!this.$refs[`${permutation.attr}-${state}`]) {
                return;
              }

              const [component] = this.$refs[`${permutation.attr}-${state}`];

              if (component?.$el) {
                this.applyPseudoState(component.$el, state, this.config);
              }
            });
          }
        );
      },

      /**
       * Sets a prop or data attribute on a component.
       */
      updateAttributes(this: any) {
        if (!this.attributes) {
          return;
        }

        this.attributes.forEach((attr: AttributeStatesObj) => {
          if (!this.$refs[attr.attr]) {
            return;
          }

          const [vm] = this.$refs[attr.attr];

          // This will cause Vue to warn about manipulating props and setting data at runtime.
          // TODO: Check for a better way after upgrading to Vue 3
          if (vm?.$children?.length > 0) {
            Vue.set(vm.$children[0], attr.attr, attr.value);
          }
        });

        if (!this.config?.permutations) {
          return;
        }
        this.config.permutations.forEach(
          (permutation: PermutationStatesObject) => {
            if (this.$refs[permutation.attr]) {
              const [vm] = this.$refs[permutation.attr];

              // This will cause Vue to warn about manipulating props and setting data at runtime.
              // TODO: Check for a better way after upgrading to Vue 3
              if (vm?.$children?.length > 0) {
                Vue.set(vm.$children[0], permutation.attr, permutation.value);
              }

              this.config.pseudos.forEach((state: PseudoState) => {
                if (this.$refs[`${permutation.attr}-${state}`]) {
                  const [vm] = this.$refs[`${permutation.attr}-${state}`];

                  // This will cause Vue to warn about manipulating props and setting data at runtime.
                  // TODO: Check for a better way after upgrading to Vue 3
                  if (vm?.$children?.length > 0) {
                    Vue.set(
                      vm.$children[0],
                      permutation.attr,
                      permutation.value
                    );
                  }
                }
              });

              this.attributes.forEach((attr: AttributeStatesObj) => {
                if (!this.$refs[`${permutation.attr}-${attr.attr}`]) {
                  return;
                }

                const [vm] = this.$refs[`${permutation.attr}-${attr.attr}`];

                // This will cause Vue to warn about manipulating props and setting data at runtime.
                // TODO: Check for a better way after upgrading to Vue 3
                if (vm?.$children?.length > 0) {
                  Vue.set(vm.$children[0], attr.attr, attr.value);
                }
              });
            }
          }
        );
      },

      /**
       * Applies a state to an element based on the options.
       *
       * @param el Element to apply the state to
       * @param state State name to add to the element
       * @param options
       */
      applyPseudoState(
        el: Element,
        state: string,
        options: Pick<PseudoStatesParameters, 'selector' | 'prefix'>
      ) {
        if (!el || !state) {
          return;
        }

        const prefix = options.prefix || '';

        const mixedStates = getMixedPseudoStates(state).map(
          (mixed) => prefix + mixed.trim()
        );

        // Generate the list of hosts that the state should be applied to. If the selector option is
        // empty, use the element itself. If the selector is a single element, use that. If the
        // selector is a string, find all matches.
        let hosts = [];
        if (!options.selector) {
          hosts = [el];
        } else if (Array.isArray(options.selector)) {
          hosts = options.selector.map((s) => el.querySelector(s));
        } else {
          hosts = [el.querySelector(options.selector)];
        }

        hosts.forEach((host) => {
          if (host) {
            host.classList.add(...mixedStates);
          }
        });
      },

      /**
       * Grid can either be row or column oriented, depening on the
       * parameters.styles variable (ROW or COLUMN). We flip the
       * row / column count when ROW was given.
       */
      getGridStyles() {
        switch (parameters.styles) {
          case Orientation.ROW:
            return {
              gridTemplateRows: `repeat(${
                1 + permutationsAsObject.length
              }, min-content)`,
              gridTemplateColumns: `repeat(${
                1 + numberOfPseudos + numberOfAttributes
              }, max-content)`,
              gridAutoFlow: 'row',
            };

          case Orientation.COLUMN:
          default:
            return {
              gridTemplateRows: `repeat(${
                1 + numberOfPseudos + numberOfAttributes
              }, min-content)`,
              gridTemplateColumns: `repeat(${
                1 + permutationsAsObject.length
              }, min-content)`,
              gridAutoFlow: 'column',
            };
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

if (module?.hot?.decline) {
  module.hot.decline();
}
