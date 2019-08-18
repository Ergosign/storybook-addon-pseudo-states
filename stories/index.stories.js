import {document, console} from 'global';
import {storiesOf} from '@storybook/html';
import {withPseudo} from "../dist/index";

storiesOf('Demo', module)
    .addDecorator(withPseudo)
    .add('heading', () => '<h1>Hello World</h1>')
    .add('button', () => {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerText = 'Hello Button';
        button.addEventListener('click', e => console.log(e));
        return button;
    });
