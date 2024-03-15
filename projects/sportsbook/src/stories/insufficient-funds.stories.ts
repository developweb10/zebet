import type { Meta, StoryObj } from '@storybook/angular';
import { InsufficientFundsComponent } from '../app/shared/insufficient-funds/insufficient-funds.component';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<InsufficientFundsComponent> = {
  title: 'Insufficient Funds',
  component: InsufficientFundsComponent,
  tags: ['autodocs'],
  render: (args: InsufficientFundsComponent) => ({
    props: {
      ...args,
    },
  })
};

export default meta;
type Story = StoryObj<InsufficientFundsComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Story = {
};

