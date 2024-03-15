import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../app/services/loader.service';

import { SearchMenuComponent } from '../app/modules/sports-book/search-menu/search-menu.component';

const meta: Meta<SearchMenuComponent> = {
  title: 'Search Menu Selector Bar',
  component: SearchMenuComponent,
  tags: ['autodocs'],
  render: (args) => ({ props: args }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [CommonModule],
    }),

    applicationConfig({
      providers: [LoaderService],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<SearchMenuComponent>;

export const Story = {};