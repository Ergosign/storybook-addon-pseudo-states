import { makeDecorator } from '@storybook/addons';
import { PseudoStateWrapperComponent, PseudoStateWrapperContainer } from './PseudoStateWrapperComponents';
import { StatesComposition, StatesCompositionDefault } from './types';
import parameters from './parameters';

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
  ...parameters,
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
