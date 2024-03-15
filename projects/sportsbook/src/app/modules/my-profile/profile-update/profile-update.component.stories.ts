import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ProfileUpdateComponent } from './profile-update.component';

export default {
  title: 'Profile Update Component',
  component: ProfileUpdateComponent,
  decorators: [
    moduleMetadata({
      declarations: [ProfileUpdateComponent],
    }),
  ],
} as Meta;

const Template: Story<ProfileUpdateComponent> = (args: ProfileUpdateComponent) => ({
  component: ProfileUpdateComponent,
  props: args,
});

export const UpdateProfile = Template.bind({});
UpdateProfile.args = {

};
