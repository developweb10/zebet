import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DepositComponent } from './deposit.component';
export default {
  title: 'Deposit Component',
  component: DepositComponent,
  decorators: [
    moduleMetadata({
      declarations: [DepositComponent],
    }),
  ],
} as Meta;

const Template: Story<DepositComponent> = (args: DepositComponent) => ({
  component: DepositComponent,
  props: args,
});

export const payment = Template.bind({});
payment.args = {
  paymentMethod: 'opay',
};

export const Amount = Template.bind({});
Amount.args = {
  selectedAmount: 1000,
  selectAmountActive: 1000,
  paymentMethod: 'opay',
};

export const history = Template.bind({});
history.args = {
  selectedAmount: 1000,
  selectAmountActive: 1000,
  paymentMethod: 'opay',
  history: true,
  deposit: false,
};
