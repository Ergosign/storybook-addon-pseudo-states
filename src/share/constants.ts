export const parameters = {
  name: 'withPseudo',
  parameterName: 'withPseudo',
  // This means don't run this decorator if the withPseudo decorator is not set
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: false
} as const;


export const ADDON_ID = 'pseudo-states';
export const TOOL_ID = `${ADDON_ID}/tool`;

export const TOOL_TITLE = 'Pseudo States';

export const ADDON_GLOBAL_DISABLE_STATE = `${ADDON_ID}/globallyDisabled`;

//const PREVIEW_ID = `${ADDON_ID}/preview`;
