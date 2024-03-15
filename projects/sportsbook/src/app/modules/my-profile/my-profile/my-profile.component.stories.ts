import { moduleMetadata, Story, Meta, applicationConfig } from '@storybook/angular';
import { MyProfileComponent } from './my-profile.component';
import { provideHttpClient } from '@angular/common/http';

export default {
  title: 'My Profile Component',
  component: MyProfileComponent,
  decorators: [
    moduleMetadata({
      declarations: [MyProfileComponent],
    }),
    applicationConfig({
      providers: [provideHttpClient()],
    }),
  ],
} as Meta;

const Template: Story<MyProfileComponent> = (args: MyProfileComponent) => ({
  component: MyProfileComponent,
  props: args,
});
export const Default = Template.bind({});
Default.args = {};
