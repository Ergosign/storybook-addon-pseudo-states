import React, { ReactNode } from 'react';
import { makeDecorator, StoryContext, StoryFn, StoryGetter, WrapperSettings } from '@storybook/addons';
import parameters from '../share/parameters';

function centered(storyFn: () => ReactNode) {
  return (
    <div className="pseudoState">
      {storyFn()}
    </div>
  );
}

export const withPseudo = makeDecorator({
  ...parameters,
  wrapper: (getStory: StoryGetter, context: StoryContext, settings: WrapperSettings) => {
    const storyFn = getStory(context);
    return centered(storyFn);
  }
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

export default withPseudo;
