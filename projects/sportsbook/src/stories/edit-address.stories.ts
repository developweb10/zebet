import { Story, Meta } from '@storybook/angular/template/components';
import { EditAddressComponent } from '../app/modules/my-profile/edit-address/edit-address.component';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';

export default {
  title: 'Edit Profile/Edit Address',
  component: EditAddressComponent,
  decorators: [
    moduleMetadata({
      declarations: [EditAddressComponent],
    }),
    applicationConfig({
      providers: [provideHttpClient()],
    }),
  ],
} as Meta;

const Template: Story<EditAddressComponent> = (args: EditAddressComponent) => ({
  component: EditAddressComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};