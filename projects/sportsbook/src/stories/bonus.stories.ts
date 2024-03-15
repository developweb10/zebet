import type { Meta, StoryObj } from '@storybook/angular';
import { BonusComponent } from '../app/modules/my-profile/bonus/bonus.component';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<BonusComponent> = {
  title: 'Bonus',
  component: BonusComponent,
  tags: ['autodocs'],
  render: (args: BonusComponent) => ({
    props: {
      ...args,
    },
  })
};

export default meta;
type Story = StoryObj<BonusComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Story = {};
