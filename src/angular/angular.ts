import {
  addons,
  makeDecorator,
  OptionsParameter,
  StoryContext,
  StoryGetter,
} from '@storybook/addons';
import {
  AttributesStatesDefault,
  PseudoStatesDefault,
  PseudoStatesDefaultPrefix_ANGULAR,
  PseudoStatesParameters,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { PseudoStateWrapperComponent } from './PseudoStateWrapperComponent.component';
import { PseudoStateWrapperContainer } from './PseudoStateWrapperContainer.component';

function getModuleMetadata(metadata: any) {
  let moduleMetadata = metadata?.moduleMetadata;
  const component = metadata?.component;

  if (component && !moduleMetadata) {
    moduleMetadata = {
      declarations: [metadata.component],
    };
  }

  if (component && moduleMetadata) {
    return {
      ...moduleMetadata,
      // add own wrapper components
      declarations: [
        ...moduleMetadata.declarations,
        metadata.component,
        PseudoStateWrapperComponent,
        PseudoStateWrapperContainer,
      ],
    };
  }

  return moduleMetadata;
}

export const withPseudo = makeDecorator({
  name: 'withPseudo',
  parameterName: 'withPseudo',
  // This means don't run this decorator if the withPseudo decorator is not set
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: false,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => {
    const story = getStory(context);
    const channel = addons.getChannel();
    const compInternal = story.component.__annotations__[0];

    // are options set by user
    const options: OptionsParameter = settings?.options;

    // Are parameters set by user
    const parameters: PseudoStatesParameters = settings?.parameters || {};

    const addonDisabled = settings?.parameters?.disabled || false;

    // notify toolbar button
    channel.emit(SAPS_INIT_PSEUDO_STATES, addonDisabled);

    if (parameters?.disabled) {
      return story;
    }

    let storyParameters = null;

    // Use user values, default user options or default values
    parameters.pseudos =
      parameters?.pseudos || options?.pseudos || PseudoStatesDefault;
    parameters.attributes =
      parameters?.attributes || options?.attributes || AttributesStatesDefault;

    // Use prefix without `:` because angular add component scope before each `:`
    // Maybe not editable by user in angular context?
    parameters.prefix =
      parameters?.prefix ||
      options?.prefix ||
      PseudoStatesDefaultPrefix_ANGULAR;

    storyParameters = escape(JSON.stringify(parameters));

    let storyComponent = null;
    if (story.component && story.component.__annotations__[0]) {
      storyComponent = escape(
        JSON.stringify(story.component.__annotations__[0])
      );
    }

    let newTemplate = story.template;
    // if story has no template, set up component with provided proerties
    if (!newTemplate) {
      let propertyString = '';

      for (const property in story?.props) {
        if (story?.props.hasOwnProperty(property)) {
          // check if component has property with the same key
          const componentProperty =
            story?.component?.__prop__metadata__[property];

          if (componentProperty) {
            propertyString += `[${property}]="${property}" `;
          }
        }
      }

      newTemplate = `<${compInternal.selector} ${propertyString}>${compInternal.template}</${compInternal.selector}>`;
    }

    return {
      ...story,
      template: `<pseudo-state-wrapper 
                        [parameters]="'${storyParameters}'"
                        [storyComponent]="'${storyComponent}'"
                    ><ng-template #storyTmpl>      
                        ${newTemplate}
                        </ng-template>
                    </pseudo-state-wrapper>`,
      moduleMetadata: getModuleMetadata(story),
      props: {
        ...story.props,
      },
    };
  },
});
