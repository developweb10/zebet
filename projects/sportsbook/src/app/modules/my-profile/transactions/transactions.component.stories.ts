import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TransactionsComponent } from './transactions.component';
export default {
  title: 'Transactions Component',
  component: TransactionsComponent,
  decorators: [
    moduleMetadata({
      declarations: [TransactionsComponent],
    }),
  ],
} as Meta;

const Template: Story<TransactionsComponent> = (
  args: TransactionsComponent
) => ({
  component: TransactionsComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  showFilterModal: false,
};

export const Calendar = Template.bind({});
Calendar.args = {
  showFilterModal: true,
};
