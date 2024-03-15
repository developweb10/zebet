import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { MyProfileComponent } from '../app/modules/my-profile/my-profile/my-profile.component';

const meta: Meta<MyProfileComponent> = {
  title: 'List Bar Component',
  component: MyProfileComponent,
  tags: ['autodocs'],
  render: (args) => ({ props: args }),
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [],
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
type MyProfileStory = StoryObj<MyProfileComponent>;

export const MyProfileStory = {
  args: {
    fetchDataFromAPI: false,
    // data: [
    //   {
    //     "banner": "assets/img/logos/bundesliga-logo.png",
    //     "link": "#",
    //   },
    //   {
    //     "banner": "assets/img/logos/image 14.png",
    //     "link": "#",
    //   },
    //   {
    //     "banner": "assets/img/logos/image 15.png",
    //     "link": "#",
    //   },
    //   {
    //     "banner": "assets/img/logos/ligue-1-logo-transparent.png",
    //     "link": "#",
    //   },
    //   {
    //     "banner": "assets/img/logos/seria a.png",
    //     "link": "#",
    //   },
    //   {
    //     "banner": "assets/img/logos/uel-logo.png",
    //     "link": "#",
    //   }
    // ],
  },
};