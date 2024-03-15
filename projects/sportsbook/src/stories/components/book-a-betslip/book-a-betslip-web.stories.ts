import { Story, Meta } from '@storybook/angular/template/components';
import { BookBetslipDesktopComponent } from './book-betslip-desktop.component';

export default {
  title: 'Example/Book-A-Betslip (web)',
  component: BookBetslipDesktopComponent,
} as Meta;

const Template: Story<BookBetslipDesktopComponent> = (
  args: BookBetslipDesktopComponent
) => ({
  component: BookBetslipDesktopComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};
