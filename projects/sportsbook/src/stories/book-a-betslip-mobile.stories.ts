import { Story, Meta } from '@storybook/angular/template/components';
import { BookBetslipComponent } from '../app/pages/book-betslip/book-betslip.component';
export default {
  title: 'Example/Book-A-Betslip (mobile)',
  component: BookBetslipComponent,
} as Meta;

const Template: Story<BookBetslipComponent> = (args: BookBetslipComponent) => ({
  component: BookBetslipComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};