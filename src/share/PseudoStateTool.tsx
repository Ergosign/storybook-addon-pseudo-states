import React, { useState } from 'react';
import { API, useAddonState, useChannel } from '@storybook/api';
import { IconButton, Icons } from '@storybook/components';
import { SAPS_BUTTON_CLICK } from './events';
import { ADDON_GLOBAL_DISABLE_STATE } from './constants';

interface Props {
  api: API;
}

// @ts-ignore
export const PseudoStateTool = (props: Props) => {
  // active story params
  // const storyParams = useParameter<PseudoStatesParameters>(parameters.parameterName, {stateComposition: StatesCompositionDefault});

  // toolbar button visibility (only when addon is enabled)
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // isDisabled by user story (active state of button)
  const [isDisabled, setIsDisabled] = useState(false);

  // const globallyDisabledDefault = sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';

  // global state, valid in all stories
  const [, setgloballyDisabled] = useAddonState<boolean>(
    ADDON_GLOBAL_DISABLE_STATE,
    false
  );

  // TODO use shared useAddonState
  // Workaround until 6.0 version is released and useAddonState hook is shared between tool and panel
  // save disable state in session storage
  // sessionStorage.setItem(ADDON_GLOBAL_DISABLE_STATE, globallyDisabled.toString());

  /**
   * register hooks
   */
  const emit = useChannel({
    storyChanged: () => {
      // show button only when story uses withPseudo add-on
      setIsVisible(false);
    },
    'saps/init-pseudo-states': (addonDisabled: boolean) => {
      // show button only when story uses withPseudo addon and is not disabled
      setIsVisible(!addonDisabled);

      if (!addonDisabled) {
        const disableStateFromStorage =
          sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';
        setgloballyDisabled(disableStateFromStorage);
        setIsDisabled(disableStateFromStorage);
      }
    },
  });

  /**
   * button click handler
   */
  const onButtonClick = () => {
    const disableStateFromStorage =
      sessionStorage.getItem(ADDON_GLOBAL_DISABLE_STATE) === 'true';

    // TODO use shared useAddonState
    const swap = !disableStateFromStorage;
    setgloballyDisabled(swap);
    setIsDisabled(swap);
    sessionStorage.setItem(ADDON_GLOBAL_DISABLE_STATE, swap.toString());
    emit(SAPS_BUTTON_CLICK, swap);
  };

  return isVisible ? (
    <IconButton
      active={!isDisabled}
      title="Show/hide Pseudo States"
      onClick={onButtonClick}
    >
      <Icons icon="button" />
    </IconButton>
  ) : null;
};
