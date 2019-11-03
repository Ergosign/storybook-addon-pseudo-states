import { deprecate } from 'util';


const withPseudo = deprecate(
  () => {
  },
  `
  Using "import {withPseudo} from "@storybook/addon-pseudo-states";" is deprecated.
  Please use framework specific files:
  "import {withPseudo} from "@storybook/addon-pseudo-states/html";"
  "import {withPseudo} from "@storybook/addon-pseudo-states/angular";"
  "import {withPseudo} from "@storybook/addon-pseudo-states/react";"
  "import {withPseudo} from "@storybook/addon-pseudo-states/lit";"
`
)();

export default withPseudo;

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

