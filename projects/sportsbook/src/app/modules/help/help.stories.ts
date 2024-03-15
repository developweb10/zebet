import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { HelpComponent } from './help.component';
import { provideHttpClient } from '@angular/common/http';

const meta: Meta<HelpComponent> = {
  title: 'Example/HelpComponent',
  component: HelpComponent,
  tags: ['autodocs'],
  render: (args) => ({ props: args }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule],
    }),

    applicationConfig({
      providers: [provideHttpClient()],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<HelpComponent>;

export const Story = {};
