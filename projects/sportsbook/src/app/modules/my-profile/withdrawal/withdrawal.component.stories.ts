import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WithdrawalComponent } from './withdrawal.component';

export default {
  title: 'Withdrawal Component',
  component: WithdrawalComponent,
  decorators: [
    moduleMetadata({
      declarations: [WithdrawalComponent],
    }),
  ],
} as Meta;

const Template: Story<WithdrawalComponent> = (args: WithdrawalComponent) => ({
  component: WithdrawalComponent,
  props: args,
});

export const uploadNIN = Template.bind({});
uploadNIN.args = {
  uploadNIN: true,
  selectedAmount: null,
};

export const uploadNINClicked = Template.bind({});
uploadNINClicked.args = {
  uploadNIN: false,
  selectedAmount: null,
};

export const AddNew = Template.bind({});
AddNew.args = {
  uploadNIN: false,
  showAddNewModal: true,
  selectedBank: '',
};

export const SelectedValue = Template.bind({});
SelectedValue.args = {
  uploadNIN: false,
  showAddNewModal: true,
  selectedBank: 'Access bank',
  enteredAccountNumber: '1012456780',
};

export const PaymentAccount = Template.bind({});
PaymentAccount.args = {
  uploadNIN: false,
  paymentAccounts: [
    { selectedBank: 'Access bank', enteredAccountNumber: '1012456780' },
  ],
  selectedBank: 'Access bank',
  accountNumber: '1012456780',
  activeIndex: 0,
};

export const Amount = Template.bind({});
Amount.args = {
  uploadNIN: false,
  paymentAccounts: [
    { selectedBank: 'Access bank', enteredAccountNumber: '1012456780' },
  ],
  selectedAmount: 10000,
  selectAmountActive: 10000,
  selectedBank: 'Access bank',
  accountNumber: '1012456780',
  activeIndex: 0,
};
export const Withdraw = Template.bind({});
Withdraw.args = {
  uploadNIN: false,
  showWithdrawModal: true,
  paymentAccounts: [
    { selectedBank: 'Access bank', enteredAccountNumber: '1012456780' },
  ],
  selectedAmount: 10000,
  selectAmountActive: 10000,
  selectedBank: 'Access bank',
  accountNumber: '1012456780',
  activeIndex: 0,
};

export const TwoPaymentAccount = Template.bind({});
TwoPaymentAccount.args = {
  uploadNIN: false,
  paymentAccounts: [
    { selectedBank: 'Access bank', enteredAccountNumber: '1012456780' },
    {
      selectedBank: 'Access bank(diamond)',
      enteredAccountNumber: '9295456580',
    },
  ],
  selectedBank: 'Access bank',
  accountNumber: '1012456780',
  activeIndex: 0,
};
