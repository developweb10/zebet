import type { Meta, StoryObj } from '@storybook/angular';
import { SimpleButtonTabComponent } from '../app/shared/simple-button-tab/simple-button-tab.component';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<SimpleButtonTabComponent> = {
  title: 'Example/SimpleButtonTab',
  component: SimpleButtonTabComponent,
  tags: ['autodocs'],
  render: (args: SimpleButtonTabComponent) => ({
    props: {
      tabs: null,
      ...args,
    },
  }),
  argTypes: {
    backgroundColor: {
        control: 'color',
      },
  },
};

export default meta;
type Story = StoryObj<SimpleButtonTabComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    tabs: ['One','Two','Three']
  },
};

export const Secondary: Story = {
  args: {
    tabs: ['One','Two','Three']
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    tabs: ['One','Two','Three']
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    tabs: ['One','Two','Three']
  },
};
