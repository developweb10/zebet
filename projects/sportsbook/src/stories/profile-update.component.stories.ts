import { Story, Meta } from '@storybook/angular/template/components';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';

export default {
  title: 'Edit Profile/ProfileUpdate',
  component: ProfileUpdateComponent,
} as Meta;


const Template: Story<ProfileUpdateComponent> = (args: ProfileUpdateComponent) => ({
  component: ProfileUpdateComponent,
  props: args,
});

export const ComponentView = Template.bind({});
ComponentView.args = {
  figCaptionTxt: '',
};

  
