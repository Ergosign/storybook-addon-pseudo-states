import {
  StoryContext,
  StoryGetter,
  WrapperSettings,
  makeDecorator,
} from '@storybook/addons';

import { addonParameters } from 'src/share/constants';
import { WrapperPseudoStateSettings } from 'src/share/types';

const pseudoStateFn = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperPseudoStateSettings
): any => {
  console.log({ getStory });
  console.log({ context });
  console.log({ settings });

  return getStory(context);
};

export const withPseudo = makeDecorator({
  ...addonParameters,
  wrapper: (
    getStory: StoryGetter,
    context: StoryContext,
    settings: WrapperSettings
  ) => pseudoStateFn(getStory, context, settings),
});
