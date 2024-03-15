import { Story, Meta } from '@storybook/angular/template/components';
import { OtherSettingsComponent } from '../app/modules/my-profile/other-settings/other-settings.component';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';

export default {
  title: 'Edit Profile/Other Settings',
  component: OtherSettingsComponent,
  decorators: [
    moduleMetadata({
      declarations: [OtherSettingsComponent],
    }),
    applicationConfig({
      providers: [provideHttpClient()],
    }),
  ],
} as Meta;

const Template: Story<OtherSettingsComponent> = (args: OtherSettingsComponent) => ({
  component: OtherSettingsComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};