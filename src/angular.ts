import { makeDecorator, StoryContext, StoryFn, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from './parameters';


function pseudoStateFn(getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) {
  const metadata = getStory(context);

  const retStory = {
    // @ts-ignore
    ...metadata
  };
  console.log('withPseudoFn', metadata, retStory);

  return metadata;

  // template: getTemplate(metadata),
  // moduleMetadata: getModuleMetadata(metadata),
  // props: {
  //   ...metadata.props
  // styles,
  // }
// };
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => pseudoStateFn(getStory, context, settings)
});


console.log('load html addon');
