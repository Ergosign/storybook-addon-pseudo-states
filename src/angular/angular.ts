import { addons, makeDecorator, OptionsParameter, StoryContext, StoryGetter } from '@storybook/addons';
import { PseudoStatesParameters, StatesCompositionDefault, WrapperPseudoStateSettings } from '../share/types';
import { PseudoStateWrapperComponent, PseudoStateWrapperContainer } from './PseudoStateWrapperComponents';
import { SAPS_INIT_PSEUDO_STATES } from '../share/events';


function getModuleMetadata(metadata: any) {
  const {moduleMetadata, component} = metadata;

  if (component && !moduleMetadata) {
    return {
      declarations: [metadata.component]
    };
  }

  if (component && moduleMetadata) {
    return {
      ...moduleMetadata,
      // add own wrapper components
      declarations: [...moduleMetadata.declarations, metadata.component, PseudoStateWrapperComponent, PseudoStateWrapperContainer]
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
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperPseudoStateSettings) => {
    const story = getStory(context);

    const compInternal = story.component.__annotations__[0];

    // are options set by user
    const options: OptionsParameter = settings?.options;

    // are parameters set by user
    const parameters: PseudoStatesParameters = settings?.parameters || {};

    const channel = addons.getChannel();
    // notify toolbar button
    channel.emit(SAPS_INIT_PSEUDO_STATES, parameters.disabled ? parameters.disabled : false);

    if (parameters?.disabled) {
      return story;
    }

    let storyParameters = null;

    // use user values or default
    parameters.stateComposition = parameters.stateComposition || StatesCompositionDefault;
    if (parameters.prefix || options?.prefix) {
      parameters.prefix = parameters.prefix || options.prefix;
    }
    storyParameters = escape(JSON.stringify(parameters));

    let storyComponent = null;
    if (story.component && story.component.__annotations__[0]) {
      storyComponent = escape(JSON.stringify(story.component.__annotations__[0]));
    }

    let newTemplate = story.template;
    // if story has no template, set up component with provided proerties
    if (!newTemplate ) {
      let propertyString = ``;

      for (const property in story?.props) {
        // check if component has property with the same key
        const componentProperty = story?.component?.__prop__metadata__[property];

        if (componentProperty) {
          propertyString += `[${property}]="${property}" `;
        }
      }

      newTemplate = `<${compInternal.selector} ${propertyString}>${compInternal.template}</${compInternal.selector}>`
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
        ...story.props
      }
    };
  }
});
