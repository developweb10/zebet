import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { ToastNotificationComponent } from './toast-notification.component';
import { provideHttpClient } from '@angular/common/http';

const meta: Meta<ToastNotificationComponent> = {
  title: 'Example/ToastUI',
  component: ToastNotificationComponent,
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
type Story = StoryObj<ToastNotificationComponent>;

export const Story = {};
