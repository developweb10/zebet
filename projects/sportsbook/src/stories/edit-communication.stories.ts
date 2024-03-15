import { Story, Meta } from '@storybook/angular/template/components';
import { EditCommunicationComponent } from '../app/modules/my-profile/edit-communication/edit-communication.component';

export default {
  title: 'Edit Profile/Edit Communications',
  component: EditCommunicationComponent,
} as Meta;

const Template: Story<EditCommunicationComponent> = (args: EditCommunicationComponent) => ({
  component: EditCommunicationComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};