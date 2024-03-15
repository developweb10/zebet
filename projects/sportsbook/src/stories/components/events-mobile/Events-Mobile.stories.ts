import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import Event from './events-mobile.component';

const meta: Meta<Event> = {
  title: 'Example/EventItem(mobile)',
  component: Event,
  tags: ['autodocs'],
  render: (args) => ({ props: args }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<Event>;

export const Story = {};
