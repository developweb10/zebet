import { Story, Meta } from '@storybook/angular/template/components';
import { BookABetComponent } from '../app/pages/book-a-bet/book-a-bet.component';
// import { BookABetComponent } from '../app/shared/book-a-bet-desktop/book-a-bet-desktop.component';

export default {
  title: 'Example/Book-A-Bet (mobile)',
  component: BookABetComponent,
} as Meta;

const Template: Story<BookABetComponent> = (args: BookABetComponent) => ({
  component: BookABetComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};