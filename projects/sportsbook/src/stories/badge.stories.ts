import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from '../app/shared/badge/badge.component';
import { HttpClientModule } from '@angular/common/http';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<BadgeComponent> = {
  title: 'Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  render: (args: BadgeComponent) => ({
    props: {
      ...args,
    },
  })
};

export default meta;
type Story = StoryObj<BadgeComponent>;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const modules = [
  HttpClientModule, // Add HttpClientModule to the modules
];
