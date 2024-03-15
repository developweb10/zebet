import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

import { ClientLogosComponent } from '../app/modules/sports-book/client-logos/client-logos.component';

const meta: Meta<ClientLogosComponent> = {
  title: 'List Bar Component',
  component: ClientLogosComponent,
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
type Story = StoryObj<ClientLogosComponent>;

export const Story = {
  args: {
    fetchDataFromAPI: false,
    data: [
      {
        "banner": "assets/img/logos/bundesliga-logo.png",
        "link": "#",
      },
      {
        "banner": "assets/img/logos/image 14.png",
        "link": "#",
      },
      {
        "banner": "assets/img/logos/image 15.png",
        "link": "#",
      },
      {
        "banner": "assets/img/logos/ligue-1-logo-transparent.png",
        "link": "#",
      },
      {
        "banner": "assets/img/logos/seria a.png",
        "link": "#",
      },
      {
        "banner": "assets/img/logos/uel-logo.png",
        "link": "#",
      }
    ],
  },
};