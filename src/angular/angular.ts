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
  PseudoStatesDefaultPrefixAlternative,
  PseudoStatesParameters,
  WrapperPseudoStateSettings,
} from '../share/types';
import { SAPS_INIT_PSEUDO_STATES } from '../share/events';
import { PseudoStateWrapperComponent } from './PseudoStateWrapperComponent.component';
import { PseudoStateWrapperContainer } from './PseudoStateWrapperContainer.component';
import { AttributeStatesObj } from '../share/AttributeStatesObj';

function getModuleMetadata(metadata: any) {
  let moduleMetadata = metadata?.moduleMetadata;
  const component = metadata?.component;

  if (component && !moduleMetadata) {
    moduleMetadata = {
      declarations: [component],
    };
  } else if (moduleMetadata && !moduleMetadata.declarations) {
    moduleMetadata = {
      ...moduleMetadata,
      declarations: [],
    };
  }

  if (component && moduleMetadata) {
    return {
      ...moduleMetadata,
      // add own wrapper components
      declarations: [
        ...moduleMetadata.declarations,
        // metadata.component,
        PseudoStateWrapperComponent,
        PseudoStateWrapperContainer,
      ],
    };
  }

  return moduleMetadata;
}

const isValidInputOrOutputOfComponent = (
  storyComponent: any,
  property: string
): 'Output' | 'Input' | undefined => {
  // are not visible in __props__metadata
  // eslint-disable-next-line camelcase
  const componentProperty = storyComponent?.__prop__metadata__[property];

  // eslint-disable-next-line no-proto
  if (!componentProperty && storyComponent?.__proto__) {
    // look in abstract component
    // eslint-disable-next-line no-proto
    return isValidInputOrOutputOfComponent(storyComponent?.__proto__, property);
  }
  const isDef = componentProperty.length > 0;

  if (isDef) {
    const p = componentProperty[0];
    // eslint-disable-next-line no-proto
    const proto = p?.__proto__;
    return proto?.ngMetadataName;
  }
  return undefined;
};

export const withPseudo = makeDecorator({
  name: 'withPseudo',
  parameterName: 'withPseudo',
  // This means don't run this decorator if the withPseudo decorator is not set
  skipIfNoParametersOrOptions: false,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperPseudoStateSettings
  ) => {
    const story = getStory(context);
    const channel = addons.getChannel();
    const compInternal = story.component?.__annotations__[0];

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
      PseudoStatesDefaultPrefixAlternative;

    storyParameters = escape(JSON.stringify(parameters));

    let storyComponent = null;
    if (story.component && compInternal) {
      storyComponent = escape(JSON.stringify(compInternal));
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        'Pseudo States Addon:',
        'add component property to your story'
      );
    }

    let permutationsAndAttributes: Array<AttributeStatesObj> = [];
    if (parameters.permutations?.length) {
      permutationsAndAttributes = permutationsAndAttributes.concat(
        parameters.permutations.map((item) =>
          AttributeStatesObj.fromAttributeState(item)
        )
      );
    }

    if (parameters.attributes?.length) {
      permutationsAndAttributes = permutationsAndAttributes.concat(
        parameters.attributes.map((item) =>
          AttributeStatesObj.fromAttributeState(item)
        )
      );
    }

    const generateLetBlock = () => {
      return permutationsAndAttributes
        ?.map((value) => {
          return `let-${value.attr}="${value.attr}"`;
        })
        .join(' ');
    };

    const permutationBinding = permutationsAndAttributes
      ?.map((value) => {
        return `[${value.attr}]="${value.attr}"`;
      })
      .join(' ');

    let newTemplate = story.template;
    // if story has no template, set up component with provided properties
    if (!newTemplate) {
      let propertyString = '';

      for (const property in story?.props) {
        if (Object.prototype.hasOwnProperty.call(story?.props, property)) {
          // check if component has property with the same key
          if (story?.component) {
            const ioType = isValidInputOrOutputOfComponent(
              story.component,
              property
            );

            // TODO add two-way-binding
            switch (ioType) {
              case 'Input':
                propertyString += `[${property}]="${property}" `;
                break;
              case 'Output':
                propertyString += `(${property})="${property}($event)" `;
                break;
              default:
                // eslint-disable-next-line no-console
                console.warn(
                  'Pseudo States Addon:',
                  'unkown prop for @Input/@Output',
                  property
                );
                break;
            }
          }
        }
      }

      newTemplate = `<${compInternal.selector} ${propertyString} ${permutationBinding}></${compInternal.selector}>`;
    } else {
      newTemplate = newTemplate.replace(
        `<${compInternal.selector} `,
        `<${compInternal.selector} ${permutationBinding}`
      );
    }

    return {
      ...story,
      template: `<pseudo-state-wrapper 
                        [parameters]="'${storyParameters}'"
                        [storyComponent]="'${storyComponent}'"
                    ><ng-template 
                        ${generateLetBlock()}
                        #storyTmpl>      
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
