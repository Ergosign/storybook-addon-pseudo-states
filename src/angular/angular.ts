import { makeDecorator } from '@storybook/addons';
import { StatesComposition, StatesCompositionDefault } from '../share/types';
import { PseudoStateWrapperComponent, PseudoStateWrapperContainer } from './PseudoStateWrapperComponents';


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
  wrapper: (getStory, context, settings) => {
    const metadata = getStory(context);
    const story = getStory(context);

    const compInternal = story.component.__annotations__[0];
    const composition: StatesComposition = StatesCompositionDefault;

    const newTemplate = story.template ? story.template : `<${compInternal.selector}>${compInternal.template}</${compInternal.selector}>`;

    return {
      ...metadata,
      template: `<pseudo-state-wrapper 
                       [statesComposition]="'${escape(JSON.stringify(composition))}'"
                    ><ng-template #storyTmpl>      
                        ${newTemplate}
                        </ng-template>
                    </pseudo-state-wrapper>`,
      moduleMetadata: getModuleMetadata(metadata),
      props: {
        ...metadata.props
      }
    };
  }
});
