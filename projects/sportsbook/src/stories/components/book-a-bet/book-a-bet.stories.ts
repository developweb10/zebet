import { Story, Meta } from '@storybook/angular/template/components';
import { BookABetComponent } from './book-a-bet.component';

export default {
  title: 'Example/Book-A-Bet (web)',
  component: BookABetComponent,
} as Meta;

const Template: Story<BookABetComponent> = (
  args: BookABetComponent
) => ({
  component: BookABetComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
