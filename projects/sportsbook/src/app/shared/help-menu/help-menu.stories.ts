import type { Meta, StoryObj } from '@storybook/angular';
import { HelpMenuComponent } from './help-menu.component';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<HelpMenuComponent> = {
  title: 'Example/HelpMenuComponents',
  component: HelpMenuComponent,
  tags: ['autodocs'],
  render: (args: HelpMenuComponent) => ({
    props: {
      tabs: null,
      ...args,
    },
  }),
  argTypes: {},
};

export default meta;
type Story = StoryObj<HelpMenuComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'How To Place a Bet',
  },
};
